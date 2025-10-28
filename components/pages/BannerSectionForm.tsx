"use client"

import { Upload, X } from 'lucide-react';

export default function BannerSectionForm() {
  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      {/* Slider 1 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Slider 1</h3>
        <div className="space-y-4">
          {/* First row: Title, Sub Title, and Image Upload */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Tittle *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Sub Tittle *</label>
              <input 
                type="text" 
                placeholder="Efficiency starts at the Layout."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image 1 *</label>
              <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Image.png</span>
                <Upload className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          {/* Second row: Description, Button Name, and Image Thumbnail */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Description *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Name *</label>
              <input 
                type="text" 
                placeholder="Explore Our Projects."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <div className="relative w-32 h-24 border border-gray-300 rounded">
                <img src="/api/placeholder/130/100" alt="Banner" className="w-full h-full object-cover rounded" />
                <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider 2 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Slider 2</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Tittle *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Sub Tittle *</label>
              <input 
                type="text" 
                placeholder="Efficiency starts at the Layout."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image 2 *</label>
              <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Image.png</span>
                <Upload className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Description *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Name *</label>
              <input 
                type="text" 
                placeholder="Explore Our Projects."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <div className="relative w-32 h-24 border border-gray-300 rounded">
                <img src="/api/placeholder/130/100" alt="Banner" className="w-full h-full object-cover rounded" />
                <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider 3 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Slider 3</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Tittle *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Sub Tittle *</label>
              <input 
                type="text" 
                placeholder="Efficiency starts at the Layout."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image 3 *</label>
              <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Image.png</span>
                <Upload className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Description *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Name *</label>
              <input 
                type="text" 
                placeholder="Explore Our Projects."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <div className="relative w-32 h-24 border border-gray-300 rounded">
                <img src="/api/placeholder/130/100" alt="Banner" className="w-full h-full object-cover rounded" />
                <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


