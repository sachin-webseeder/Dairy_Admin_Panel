import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bell, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export function CreateNotificationModal({ open, onOpenChange, onSend }) {
  const [activeTab, setActiveTab] = useState('create');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Promotional',
    targetAudience: 'All Users',
    image: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      toast.error("Title and Message are required");
      return;
    }
    // Handle the send action (assuming parent passes onSend)
    if (onSend) onSend(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 bg-white rounded-xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        {/* ✨ FIX: Changed to flex-col and added padding/spacing for stacked layout */}
        <div className="px-6 py-4 border-b bg-gray-50 flex-shrink-0 flex flex-col items-start">
          <DialogTitle className="text-xl font-bold text-gray-900">Create New Notification</DialogTitle>
          
          {/* Custom Tabs - Stacked below title */}
          <div className="flex bg-gray-200 p-1 rounded-lg mt-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'create' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* CREATE TAB */}
          <div className={activeTab === 'create' ? 'block' : 'hidden'}>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Title <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="Enter notification title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Message <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Enter notification message" 
                  className="resize-none h-24 bg-gray-50 border-gray-200"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(val) => setFormData({...formData, type: val})}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Promotional">Promotional</SelectItem>
                      <SelectItem value="System">System Alert</SelectItem>
                      <SelectItem value="Update">App Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select 
                    value={formData.targetAudience} 
                    onValueChange={(val) => setFormData({...formData, targetAudience: val})}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="Active Users">Active Users (Last 7 days)</SelectItem>
                      <SelectItem value="Inactive Users">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image (Optional)</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors h-32 relative overflow-hidden group bg-gray-50/50"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 font-medium">Click to Upload Image</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW TAB */}
          <div className={activeTab === 'preview' ? 'flex flex-col items-center justify-center h-full min-h-[420px]' : 'hidden'}>
             <div className="relative w-[280px] h-[520px] bg-black rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-100 transform scale-95">
                {/* Status Bar Mock */}
                <div className="absolute top-0 w-full h-8 bg-black text-white flex justify-between px-6 items-center text-[10px] font-medium z-20">
                  <span>9:41</span>
                  <span>100%</span>
                </div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-gray-100 pt-12 px-3 flex flex-col items-center">
                   {/* Date Mock */}
                   <div className="text-gray-400 text-[10px] mb-4 font-medium">Wednesday, 7 June</div>

                   {/* Notification Toast */}
                   <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex gap-3 animate-in slide-in-from-top-4 duration-500 mb-2">
                      <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                        <Bell className="h-5 w-5 fill-current" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-gray-900 truncate">Dynasty App</h4>
                          <span className="text-[10px] text-gray-400">now</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{formData.title || "Special Offer!"}</p>
                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
                          {formData.message || "Get 50% off on your next order. Limited time offer!"}
                        </p>
                      </div>
                   </div>

                   {/* Mock App Background (Wallpaper) */}
                   <div className="mt-auto mb-12 opacity-5">
                      <div className="text-6xl font-bold text-gray-900 text-center">12:30</div>
                   </div>
                </div>
             </div>
             <p className="text-xs text-gray-400 mt-4 font-medium">Lock Screen Preview</p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10">Cancel</Button>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white h-10 px-6" 
            onClick={handleSubmit}
          >
            Send Notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}