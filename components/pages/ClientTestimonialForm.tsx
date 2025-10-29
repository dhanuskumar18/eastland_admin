"use client"

import { Upload, X } from 'lucide-react';

export default function ClientTestimonialForm() {
  const reviews = [1, 2, 3];
  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-8">
      {reviews.map((num) => (
        <div key={num} className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Review {num}:</h4>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
              <input
                type="text"
                placeholder="Thomas Raj"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession *</label>
              <input
                type="text"
                placeholder="Cafe Owner"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
              <input
                type="text"
                placeholder="Good"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Image *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">Image.png</span>
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src="/api/placeholder/130/100" alt="Client" className="w-full h-full object-cover rounded" />
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


