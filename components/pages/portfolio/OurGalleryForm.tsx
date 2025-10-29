"use client"

import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function OurGalleryForm() {
  const [galleryItems, setGalleryItems] = useState([
    { id: 1, title: "Gallery Image 1", image: "/api/placeholder/130/100" },
    { id: 2, title: "Gallery Image 2", image: "/api/placeholder/130/100" }
  ]);

  const addNewItem = () => {
    const newItem = {
      id: galleryItems.length + 1,
      title: "New Gallery Image",
      image: "/api/placeholder/130/100"
    };
    setGalleryItems([...galleryItems, newItem]);
  };

  const removeItem = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Section Header */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            placeholder="Enter section title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Title *</label>
          <input
            type="text"
            placeholder="Enter section subtitle"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Gallery Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Gallery Images</h3>
          <button 
            onClick={addNewItem}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Image
          </button>
        </div>

        {galleryItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Title *</label>
                <input
                  type="text"
                  placeholder="Enter image title"
                  defaultValue={item.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
                <div className="flex items-start gap-3">
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                    <span className="text-sm text-gray-400">GalleryImage.png</span>
                    <Upload className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                    <img src={item.image} alt="Gallery" className="w-full h-full object-cover rounded" />
                    <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
