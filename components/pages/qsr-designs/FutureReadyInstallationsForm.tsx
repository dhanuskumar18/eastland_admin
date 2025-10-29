"use client"

import { Upload, X } from 'lucide-react';

export default function FutureReadyInstallationsForm() {
  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Section Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input
          type="text"
          placeholder="Enter section title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
        />
      </div>

      {/* 4 Upload Images */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Installation Images</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image {num} *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">Image{num}.png</span>
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src="/api/placeholder/130/100" alt={`Installation ${num}`} className="w-full h-full object-cover rounded" />
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Upload Images with Titles */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Featured Installations</h3>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2].map((num) => (
            <div key={num} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title {num} *</label>
                <input
                  type="text"
                  placeholder={`Enter title ${num}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image {num} *</label>
                <div className="flex items-start gap-3">
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                    <span className="text-sm text-gray-400">Featured{num}.png</span>
                    <Upload className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                    <img src="/api/placeholder/130/100" alt={`Featured ${num}`} className="w-full h-full object-cover rounded" />
                    <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
