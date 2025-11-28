import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, FolderOpen, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea'; // Ensure this component exists or use Input
import { Switch } from '../components/ui/switch';
import { useApiCategories } from '../lib/hooks/useApiCategories';
import { categoryService } from '../lib/api/services/categoryService';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../components/figma/ImageWithFallback'; // Reuse this helper

export function CategoryManagement() {
  const { categories, loading, refetch } = useApiCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const fileInputRef = useRef(null);
 
  
  const location = useLocation();

  // ✨ ADD THIS EFFECT: Check URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
       // Wait a tiny bit for mount
       setTimeout(() => {
         setEditingCategory(null);
         setFormData({ name: '', displayName: '', description: '', icon: '', imageFile: null, imagePreview: '', isActive: true });
         setModalOpen(true);
       }, 100);
    }
  }, [location]);
 
  
  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    displayName: '', 
    description: '', 
    icon: '', 
    imageFile: null, 
    imagePreview: '',
    isActive: true 
  });

  const filteredCategories = categories.filter(c => 
    (c.displayName || c.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        displayName: category.displayName || category.name,
        description: category.description || '',
        icon: category.icon || '',
        imageFile: null,
        imagePreview: category.image || '', // Show existing image
        isActive: category.isActive ?? true
      });
    } else {
      setEditingCategory(null);
      setFormData({ 
        name: '', 
        displayName: '', 
        description: '', 
        icon: '', 
        imageFile: null, 
        imagePreview: '',
        isActive: true 
      });
    }
    setModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.displayName || (!formData.imageFile && !editingCategory)) {
       toast.error("Name, Display Name and Image are required");
       return;
    }

    try {
      if (editingCategory) {
        // Update logic pending
        toast.info("Update feature pending backend support");
      } else {
        await categoryService.createCategory(formData);
        showSuccessToast('Category created successfully!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this category?")) {
       try {
         toast.info("Delete feature pending backend support");
       } catch(err) {
         toast.error("Failed to delete");
       }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? <p>Loading...</p> : filteredCategories.map(cat => (
            <Card key={cat._id || cat.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                {/* ✨ Display Category Image/Icon */}
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                  {cat.image ? (
                     <ImageWithFallback 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover"
                     />
                  ) : (
                     <span className="text-2xl">{cat.icon || <FolderOpen className="h-6 w-6 text-blue-600" />}</span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium">{cat.displayName || cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.description || cat.name}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(cat)}>
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id || cat.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div className="flex justify-center">
               <div 
                  className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative"
                  onClick={() => fileInputRef.current?.click()}
               >
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-500">Upload Image</span>
                    </>
                  )}
               </div>
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input 
                    value={formData.displayName} 
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                    placeholder="e.g. Fresh Milk"
                />
                </div>
                <div className="space-y-2">
                <Label>Internal Name *</Label>
                <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. milk"
                    disabled={!!editingCategory} 
                />
                </div>
            </div>
            
             <div className="space-y-2">
              <Label>Icon (Emoji or Class)</Label>
              <Input 
                value={formData.icon} 
                onChange={(e) => setFormData({...formData, icon: e.target.value})} 
                placeholder="e.g. 🥛"
              />
            </div>

             <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Category description..."
              />
            </div>
            
            <div className="flex items-center space-x-2 border p-3 rounded-lg">
                <Switch 
                    checked={formData.isActive} 
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})} 
                />
                <Label>Active Status</Label>
            </div>

            <Button onClick={handleSubmit} className="w-full">Save Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}