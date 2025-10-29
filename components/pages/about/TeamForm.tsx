"use client"

import { Upload, X, Plus } from 'lucide-react';

type TeamMember = {
  id: number;
  name: string;
  profession: string;
  about: string;
  image?: string;
};

export default function TeamForm() {
  const initial: TeamMember[] = [
    { id: 1, name: 'Person 1', profession: 'Designer', about: 'Experienced UI/UX designer.' },
    { id: 2, name: 'Person 2', profession: 'Developer', about: 'Full-stack developer.' },
    { id: 3, name: 'Person 3', profession: 'Marketer', about: 'Growth marketing specialist.' }
  ];

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-end">
        <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {initial.map((member) => (
        <div key={member.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                defaultValue={member.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession *</label>
              <input
                type="text"
                defaultValue={member.profession}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">{member.image || 'Image.png'}</span>
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src="/api/placeholder/130/100" alt={member.name} className="w-full h-full object-cover rounded" />
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">About Me *</label>
            <textarea
              rows={3}
              defaultValue={member.about}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}


