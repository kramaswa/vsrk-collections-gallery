
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Trash2, 
  Plus,
  Pencil,
  Loader2,
  Tag
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';

type Category = {
  id: string;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form states
  const [editName, setEditName] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [newName, setNewName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  
  const { toast } = useToast();
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEditOpen = (category: Category) => {
    setCategoryToEdit(category);
    setEditName(category.name);
    setEditDisplayName(category.display_name);
  };
  
  const handleEditClose = () => {
    setCategoryToEdit(null);
    setEditName('');
    setEditDisplayName('');
  };
  
  const handleEditSave = async () => {
    if (!categoryToEdit || !editName.trim() || !editDisplayName.trim()) return;
    
    setIsEditing(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editName.toLowerCase().trim(),
          display_name: editDisplayName.trim()
        })
        .eq('id', categoryToEdit.id);
      
      if (error) throw error;
      
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      handleEditClose();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleAddOpen = () => {
    setShowAddDialog(true);
    setNewName('');
    setNewDisplayName('');
  };
  
  const handleAddClose = () => {
    setShowAddDialog(false);
    setNewName('');
    setNewDisplayName('');
  };
  
  const handleAddSave = async () => {
    if (!newName.trim() || !newDisplayName.trim()) return;
    
    setIsAdding(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newName.toLowerCase().trim(),
          display_name: newDisplayName.trim()
        });
      
      if (error) throw error;
      
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      handleAddClose();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl font-semibold">Manage Categories</h2>
        <Button onClick={handleAddOpen} className="bg-vsrk-gold text-black hover:bg-vsrk-gold/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-vsrk-gold animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-gray-500">No categories found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium">{category.display_name}</h3>
                  <p className="text-sm text-gray-500">ID: {category.name}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditOpen(category)}
                  className="text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoryToDelete(category.id)}
                  className="text-red-600"
                  disabled={category.name === 'uncategorized'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone and may affect existing media items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Dialog */}
      <Dialog open={!!categoryToEdit} onOpenChange={(open) => !open && handleEditClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Internal Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., necklace"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-display-name">Display Name</Label>
              <Input
                id="edit-display-name"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="e.g., Necklace"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSave}
              disabled={!editName.trim() || !editDisplayName.trim() || isEditing}
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => !open && handleAddClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">Internal Name</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., necklace"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-display-name">Display Name</Label>
              <Input
                id="new-display-name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g., Necklace"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleAddClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSave}
              disabled={!newName.trim() || !newDisplayName.trim() || isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
