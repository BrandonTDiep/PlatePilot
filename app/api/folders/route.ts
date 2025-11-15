import { db } from '@/lib/db';
import { getUserById } from '@/services/user';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const { name, description, parentId } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 },
      );
    }

    const existingUser = await getUserById(session.user.id);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // If a parentId was provided, validate ownership
    if (parentId) {
      const parentFolder = await db.folder.findFirst({
        where: { id: parentId, userId: session.user.id },
      });
      if (!parentFolder) {
        return NextResponse.json(
          {
            error:
              'Invalid parent folder or you are not authorized for that folder',
          },
          { status: 400 },
        );
      }
    }

    // Create the folder
    const folder = await db.folder.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, folder });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const folders = await db.folder.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, folders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 },
      );
    }

    const { folderId } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 },
      );
    }

    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found or not authorized' },
        { status: 404 },
      );
    }

    // Delete the folder (recipes will have folderId set to null due to onDelete: SetNull)
    await db.folder.delete({ where: { id: folderId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 },
    );
  }
}
