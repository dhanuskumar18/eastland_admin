"use client"

import { Upload, X } from 'lucide-react';

export default function AboutUsForm() {
  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tittle *</label>
            <input 
              type="text" 
              placeholder="Smart Setup."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Tittle 1 *</label>
            <input 
              type="text" 
              placeholder="Smart Setup."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Tittle 2 *</label>
            <input 
              type="text" 
              placeholder="Smart Setup."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description Sub Tittle *</label>
            <input 
              type="text" 
              placeholder="Efficiency starts at the Layout."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input 
              type="text" 
              placeholder="Explore Our Projects."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input 
              type="text" 
              placeholder="Explore Our Projects."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Image Upload Fields - Row Below */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image 1 *</label>
          <div className="flex items-start gap-3">
            <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
              <span className="text-sm text-gray-400">Image.png</span>
              <Upload className="w-4 h-4 text-gray-500" />
            </div>
            <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
              <img src="/api/placeholder/130/100" alt="Upload" className="w-full h-full object-cover rounded" />
              <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image 2 *</label>
          <div className="flex items-start gap-3">
            <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
              <span className="text-sm text-gray-400">Image.png</span>
              <Upload className="w-4 h-4 text-gray-500" />
            </div>
            <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
              <img src="/api/placeholder/130/100" alt="Upload" className="w-full h-full object-cover rounded" />
              <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


