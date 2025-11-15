import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OrganizerPlanSchema, type OrganizerPlan } from '@/schemas';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    // Load current state
    const [folders, recipes] = await Promise.all([
      db.folder.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      }),
      db.recipe.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          ingredients: true,
          directions: true,
          folderId: true,
        },
      }),
    ]);

    // Build a compact, deterministic prompt
    const baseSystemPrompt =
      'You group recipes into consistent folders. Be deterministic and conservative. Only output JSON matching the provided schema. Use existing folder names when appropriate; otherwise propose new ones. Avoid duplicates.';

    // If user already has folders, prefer re-using them and avoid creating
    // new folders unless they will receive at least one recipe. This helps
    // prevent creating empty folders when organizing.
    const systemPrompt =
      folders.length > 0
        ? baseSystemPrompt +
          ' There are existing folders for this user — prefer assigning recipes to them. Only propose creating new folders if you will assign at least one recipe to that new folder. Do not create folders that will contain zero recipes.'
        : baseSystemPrompt +
          ' Requirement: Avoid empty folders with no recipes.';

    const userContent = JSON.stringify({
      folders: folders.map((f) => ({ id: f.id, name: f.name })),
      recipes: recipes.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        ingredients: r.ingredients,
        directions: r.directions,
        folderId: r.folderId,
      })),
    });

    const model = process.env.MODEL || 'gpt-4o-mini';

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content:
            'Given the current folders and recipes, return an organization plan. Do not make empty folders with no recipes. JSON keys: createFolders [{name, description?, parentName?}], renameFolders [{from, to}], assignRecipes [{recipeId, folderName|null}].\nInput:' +
            userContent,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Model returned empty response' },
        { status: 500 },
      );
    }

    // Validate against schema
    let plan: OrganizerPlan;
    try {
      plan = OrganizerPlanSchema.parse(JSON.parse(content));
    } catch {
      return NextResponse.json(
        { error: 'Invalid plan returned by the model' },
        { status: 500 },
      );
    }

    // Post-process the plan to avoid creating folders that won't receive
    // any recipes. Compute folder names referenced by assignments and only
    // keep createFolders that are referenced. Also avoid recreating folders
    // that already exist.
    const referencedFolderNames = new Set<string>();
    for (const ar of plan.assignRecipes) {
      if (ar.folderName) referencedFolderNames.add(ar.folderName);
    }

    const existingFolderNames = new Set(folders.map((f) => f.name));

    plan.createFolders = plan.createFolders.filter((cf) => {
      if (!cf.name) return false;
      if (existingFolderNames.has(cf.name)) return false; // don't recreate
      return referencedFolderNames.has(cf.name);
    });

    // Apply the plan in a transaction
    const result = await db.$transaction(async (tx) => {
      // Helper: find folder by name for this user (case-insensitive)
      const findByName = async (name: string) => {
        return tx.folder.findFirst({
          where: { userId: session.user!.id, name },
        });
      };

      // Create folders (skip if exists)
      for (const cf of plan.createFolders) {
        const existing = cf.name ? await findByName(cf.name) : null;
        if (!existing) {
          await tx.folder.create({
            data: {
              name: cf.name,
              description: cf.description ?? null,
              userId: session.user!.id as string,
            },
          });
        }
      }

      // Rename folders (only if source exists and target does not)
      for (const rf of plan.renameFolders) {
        const source = await findByName(rf.from);
        if (!source) continue;
        const target = await findByName(rf.to);
        if (target) continue; // avoid conflicts
        await tx.folder.update({
          where: { id: source.id },
          data: { name: rf.to },
        });
      }

      // Refresh folder cache after mutations
      const allFolders = await tx.folder.findMany({
        where: { userId: session.user!.id },
      });

      const folderNameToId = new Map<string, string>();
      for (const f of allFolders) folderNameToId.set(f.name, f.id);

      // Assign recipes
      for (const ar of plan.assignRecipes) {
        const folderId = ar.folderName
          ? folderNameToId.get(ar.folderName)
          : null;
        // Only update recipes that belong to the user
        await tx.recipe.updateMany({
          where: { id: ar.recipeId, userId: session.user!.id },
          data: { folderId: folderId ?? null },
        });
      }

      // Return updated folders with counts
      const updatedFolders = await tx.folder.findMany({
        where: { userId: session.user!.id },
        include: {
          _count: { select: { recipes: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return { folders: updatedFolders };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to organize folders' },
      { status: 500 },
    );
  }
}
