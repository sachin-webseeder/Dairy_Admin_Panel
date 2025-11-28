import { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
// ✨ Import useNavigate
import { useNavigate } from 'react-router-dom';

// Smart Image Input Component
function ImageInput({ label, imageData, onChange, className = "" }) {
  const [inputType, setInputType] = useState('file'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onChange({ type: 'file', value: file, preview });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      onChange({ type: 'url', value: url, preview: url });
    }
  };
  
  const handleUrlBlur = () => {
     if (urlInput && !imageData) {
         onChange({ type: 'url', value: urlInput, preview: urlInput });
     }
  };

  const clearImage = () => {
    onChange(null);
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-xs font-semibold">{label}</Label>
        <div className="flex bg-gray-100 rounded-md p-0.5">
           <button 
             type="button"
             onClick={() => setInputType('file')}
             className={`px-2 py-0.5 text-[10px] rounded transition-all ${inputType === 'file' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Upload
           </button>
           <button 
             type="button"
             onClick={() => setInputType('url')}
             className={`px-2 py-0.5 text-[10px] rounded transition-all ${inputType === 'url' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Link
           </button>
        </div>
      </div>

      {imageData ? (
        <div className="relative w-full h-32 border rounded-lg overflow-hidden group bg-gray-50">
          <img src={imageData.preview} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-white/90 text-red-500 rounded-full hover:bg-red-50 shadow-sm border transition-opacity opacity-0 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
          {inputType === 'file' ? (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium text-center">Click to upload image</p>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
                ref={fileInputRef}
              />
            </label>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2">
              <LinkIcon className="w-8 h-8 text-gray-400" />
              <Input 
                placeholder="Paste image link here..." 
                value={urlInput}
                onChange={handleUrlChange}
                onBlur={handleUrlBlur}
                className="h-8 text-xs bg-white w-full max-w-[80%]"
              />
              <p className="text-[10px] text-gray-400">Paste URL above to preview</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Variant Row
function VariantRow({ index, variant, onChange, onRemove, onImageChange }) {
  return (
    <div className="border p-4 rounded-xl mb-4 bg-gray-50/50 relative group">
       <Button 
         variant="ghost" 
         size="icon" 
         onClick={() => onRemove(index)} 
         className="absolute top-2 right-2 text-gray-400 hover:text-red-500 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
       >
         <Trash2 className="h-4 w-4"/>
       </Button>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Image Section */}
          <div className="md:col-span-1">
             <ImageInput 
               label={`Variant Image ${index + 1}`}
               imageData={variant.imageData}
               onChange={(data) => onImageChange(index, data)}
             />
          </div>

          {/* Right: Inputs */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input value={variant.label} onChange={(e) => onChange(index, 'label', e.target.value)} placeholder="e.g. Family Pack" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Value</Label>
                <Input type="number" value={variant.value} onChange={(e) => onChange(index, 'value', e.target.value)} placeholder="500" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit</Label>
                <Select value={variant.unit} onValueChange={(val) => onChange(index, 'unit', val)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="gm">gm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Stock</Label>
                <Input type="number" value={variant.stock} onChange={(e) => onChange(index, 'stock', e.target.value)} placeholder="0" className="h-9 text-xs" />
              </div>
              <div className="space-y-1 col-span-2">
                 <Label className="text-xs">Price (₹)</Label>
                 <Input type="number" value={variant.price} onChange={(e) => onChange(index, 'price', e.target.value)} placeholder="0.00" className="h-9 text-xs font-medium" />
              </div>
          </div>
       </div>
    </div>
  );
}

export function AddProductModal({ open, onClose, onAdd, categories = [] }) {
  const navigate = useNavigate(); // ✨ Use Navigate hook
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    discountPercent: '',
    isVIP: false,
    description: '',
    mainImage: null, 
    availableForOrder: true,
    vegetarian: false,
  });

  const [variants, setVariants] = useState([
    { label: 'Standard', value: '', unit: 'gm', price: '', stock: '', imageData: null }
  ]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData({ name: '', category: '', cost: '', discountPercent: '', isVIP: false, description: '', mainImage: null, availableForOrder: true, vegetarian: false });
      setVariants([{ label: 'Standard', value: '', unit: 'gm', price: '', stock: '', imageData: null }]);
    }
  }, [open]);

  // Handlers
  const handleMainImageChange = (data) => {
    setFormData(prev => ({ ...prev, mainImage: data }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleVariantImageChange = (index, data) => {
    const newVariants = [...variants];
    newVariants[index].imageData = data;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { label: '', value: '', unit: 'gm', price: '', stock: '', imageData: null }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.cost) {
      toast.error("Name, Category and Cost are required");
      return;
    }
    
    setLoading(true);
    try {
      await onAdd({ ...formData, variants }); 
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };
  
  // ✨ Handle Navigation to Category Page
  const handleNavigateToCategories = () => {
     // Pass a state or query param if you want the category modal to open automatically
     // For now, just navigate
     navigate('/category-management?action=create'); 
     onClose(); // Close this modal
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            
            <ImageInput 
              label="Product Image"
              imageData={formData.mainImage}
              onChange={handleMainImageChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Butter Chicken" />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => {
                    if (value === 'create_new') {
                        // ✨ Redirect to Category Management
                        handleNavigateToCategories();
                    } else {
                        setFormData({ ...formData, category: value });
                    }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.displayName || cat.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="create_new" className="font-medium text-blue-600 border-t mt-1 pt-1 cursor-pointer bg-blue-50 hover:bg-blue-100">
                      <Plus className="h-4 w-4 mr-2 inline-block" /> Create New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Base Cost *</Label>
                <Input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input type="number" value={formData.discountPercent} onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })} placeholder="0" />
              </div>
            </div>

            {/* Variants Section */}
            <div className="space-y-3 border-t pt-4">
               <div className="flex justify-between items-center">
                 <Label className="text-base font-semibold">Variants</Label>
                 <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-8 gap-1"><Plus className="h-4 w-4"/> Add Variant</Button>
               </div>
               
               <div className="space-y-3">
                 {variants.map((variant, index) => (
                   <VariantRow 
                     key={index} 
                     index={index} 
                     variant={variant} 
                     onChange={handleVariantChange} 
                     onRemove={removeVariant}
                     onImageChange={handleVariantImageChange} 
                   />
                 ))}
               </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Product details..." />
            </div>

            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center space-x-2 border p-2 rounded bg-gray-50">
                <Switch checked={formData.availableForOrder} onCheckedChange={(c) => setFormData({...formData, availableForOrder: c})} />
                <Label>Available for Order</Label>
              </div>
              <div className="flex items-center space-x-2 border p-2 rounded bg-gray-50">
                <Switch checked={formData.isVIP} onCheckedChange={(c) => setFormData({...formData, isVIP: c})} />
                <Label>VIP Only</Label>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </form>
      </DialogContent>
    </Dialog>
  );
}