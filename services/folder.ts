import { db } from '@/lib/db';

export interface FolderWithCount {
  id: string;
  name: string;
  description: string | null;
  _count: {
    recipes: number;
  };
}

/**
 * Fetches all folders for a user from the database.
 *
 * @param userId - The unique identifier of the user.
 * @returns An array of folders with recipe counts, ordered by creation date (newest first).
 */
export const getFoldersByUserId = async (
  userId: string,
): Promise<FolderWithCount[]> => {
  try {
    const folders = await db.folder.findMany({
      where: {
        userId: userId,
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

    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      description: folder.description,
      _count: {
        recipes: folder._count.recipes,
      },
    }));
  } catch {
    return [];
  }
};

/**
 * Fetches a folder by its ID for a specific user.
 *
 * @param folderId - The unique identifier of the folder.
 * @param userId - The unique identifier of the user (for authorization).
 * @returns The folder object if found and belongs to the user, otherwise null.
 */
export const getFolderById = async (folderId: string, userId: string) => {
  try {
    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId: userId,
      },
    });

    return folder;
  } catch {
    return null;
  }
};

/**
 * Fetches a folder by its name for a specific user.
 *
 * @param folderName - The name of the folder.
 * @param userId - The unique identifier of the user (for authorization).
 * @returns The folder object if found and belongs to the user, otherwise null.
 */
export const getFolderByName = async (folderName: string, userId: string) => {
  try {
    const folder = await db.folder.findFirst({
      where: {
        name: folderName,
        userId: userId,
      },
    });

    return folder;
  } catch {
    return null;
  }
};
