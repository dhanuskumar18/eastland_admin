"use client"

import { useState } from 'react';
import { ChevronDown, Upload, X } from 'lucide-react';

export default function ProductsForm() {
  const [products, setProducts] = useState([
    { id: 1, category: '', description: 'Efficiency starts at the Layout.', tags: '', title: 'Smart Setup.', image: 'Image.jpg' },
    { id: 2, category: '', description: 'Efficiency starts at the Layout.', tags: '', title: 'Smart Setup.', image: 'Image.jpg' },
    { id: 3, category: '', description: '', tags: '', title: '', image: '' }
  ]);

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      {/* Section Title and Sub Section Title Fields */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Section Tittle *</label>
          <input 
            type="text" 
            placeholder="Smart Setup."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Section Tittle *</label>
          <input 
            type="text" 
            placeholder="Smart Setup."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Product Entries */}
      {products.map((product, index) => (
        <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Product {index + 1}:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <div className="relative">
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white">
                  <option value="">Select Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <input 
                type="text" 
                placeholder="Efficiency starts at the Layout."
                defaultValue={product.description}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags *</label>
              <div className="relative">
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white">
                  <option value="">Select Tags</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Tittle *</label>
              <input 
                type="text" 
                placeholder="Smart Setup."
                defaultValue={product.title}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">{product.image || 'Image.jpg'}</span>
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src="/api/placeholder/130/100" alt="Product" className="w-full h-full object-cover rounded" />
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


