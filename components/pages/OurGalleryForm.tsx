"use client"

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function OurGalleryForm() {
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, title: 'Smart Setup.', image: 'Image.png' },
    { id: 2, title: 'Smart Setup.', image: 'Image.png' },
    { id: 3, title: 'Smart Setup.', image: 'Image.png' },
    { id: 4, title: 'Smart Setup.', image: 'Image.png' }
  ]);

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      {/* Main Title and Description Fields */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tittle *</label>
          <input 
            type="text" 
            placeholder="Smart Setup."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description Sub Tittle *</label>
          <input 
            type="text" 
            placeholder="Efficiency starts at the Layout."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <input 
          type="text" 
          placeholder="Efficiency starts at the Layout."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
        />
      </div>

      {/* Gallery Image Entries */}
      {galleryImages.map((image, index) => (
        <div key={image.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Image {index + 1}:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tittle *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                defaultValue={image.title}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">{image.image}</span>
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src="/api/placeholder/130/100" alt="Gallery" className="w-full h-full object-cover rounded" />
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


