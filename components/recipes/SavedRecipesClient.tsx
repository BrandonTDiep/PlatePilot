'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecipeCard from '@/components/recipes/recipe-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderPlus, Folder, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import type { FolderWithCount } from '@/services/folder';

interface Recipe {
  id: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: string;
  ingredients: { name: string; amount: string }[];
  directions: string[];
}

type Folder = FolderWithCount;

interface SavedRecipesClientProps {
  recipes: Recipe[];
  folderName?: string;
  folders?: Folder[];
}
const SavedRecipesClient = ({
  recipes,
  folderName,
  folders: initialFolders = [],
}: SavedRecipesClientProps) => {
  const router = useRouter();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(recipes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Update recipes when folderName changes (when navigating to folder view)
  useEffect(() => {
    setSavedRecipes(recipes);
  }, [recipes]);

  // Update folders when initialFolders prop changes (server-side data)
  useEffect(() => {
    setFolders(initialFolders);
  }, [initialFolders]);

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/folders');
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders);
      }
    } catch {
      console.error('Failed to fetch folders');
    }
  };

  const handleOrganizeFolders = async () => {
    if (isOrganizing) return;
    setIsOrganizing(true);
    try {
      const res = await fetch('/api/folders/organize', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await fetchFolders();
        router.refresh?.();
      } else {
        alert(data.error || 'Failed to organize folders');
      }
    } catch {
      alert('Failed to organize folders. Please try again.');
    } finally {
      setIsOrganizing(false);
    }
  };

  const handleToggleSave = async (recipeId: string) => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      }
    } catch {
      alert('Failed to unsave. Try again.');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        // Refresh folders from server after creation
        await fetchFolders();
        setNewFolderName('');
        setIsDialogOpen(false);
      } else {
        alert(data.error || 'Failed to create folder');
      }
    } catch {
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleFolderClick = (folder: Folder) => {
    const encodedSlug = encodeURIComponent(folder.name);
    router.push(`/saved/${encodedSlug}`);
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      const res = await fetch('/api/folders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: folderToDelete.id }),
      });

      const data = await res.json();

      if (data.success) {
        // Refresh folders from server after deletion
        await fetchFolders();
        setDeleteDialogOpen(false);
        setFolderToDelete(null);
        // If we're currently viewing this folder, redirect to saved page
        if (folderName === folderToDelete.name) {
          router.push('/saved');
        }
      } else {
        alert(data.error || 'Failed to delete folder');
      }
    } catch {
      alert('Failed to delete folder. Please try again.');
    }
  };

  const openDeleteDialog = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    setFolderToDelete(folder);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          {folderName && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/saved')}
              className="pl-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-2xl font-bold pl-8">
            {folderName ? `Folder: ${folderName}` : 'Folders'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleOrganizeFolders}
            disabled={isOrganizing}
            aria-busy={isOrganizing}
            className="min-w-[180px]"
          >
            {isOrganizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Organizing...
              </>
            ) : (
              'Organize Folders'
            )}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Organize your recipes by creating a new folder
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    placeholder="e.g., Italian Classics"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFolder();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Folders Section - Only show if not viewing a specific folder */}
      {!folderName && (
        <div className="pt-4 pl-8 pb-8">
          {folders.length > 0 && (
            <div className="mb-12">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {folders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 relative group"
                    onClick={() => handleFolderClick(folder)}
                  >
                    <div className="flex items-center gap-4 p-6">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Folder className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {folder._count?.recipes || 0}{' '}
                          {folder._count?.recipes === 1 ? 'recipe' : 'recipes'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => openDeleteDialog(e, folder)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold pl-8">
          {folderName ? 'Recipes' : 'All Recipes'}
        </h2>

        {savedRecipes.length === 0 ? (
          <p className="text-center pt-4">
            {folderName
              ? 'No recipes in this folder yet.'
              : 'No saved recipes yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4 pl-8 pb-8">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="w-full max-w-sm mx-auto">
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={true} // always true in Saved page
                  onSaveToggle={handleToggleSave}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{folderToDelete?.name}
              &quot;? This will remove the folder but the recipes inside will
              remain saved. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFolderToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedRecipesClient;
