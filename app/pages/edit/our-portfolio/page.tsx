"use client"

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import BannerForm from '@/components/pages/about/BannerForm';
import OurGalleryForm from '@/components/pages/portfolio/OurGalleryForm';

// Portfolio sections
const portfolioSections = [
  { id: 1, name: "Banner" },
  { id: 2, name: "Our Gallery", hasNewButton: true, newButtonLabel: "Add New Image" }
];

export default function EditPortfolioPage() {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sections] = useState(portfolioSections);

  const handleEditClick = (sectionName: string) => {
    if (editingSection === sectionName) {
      setEditingSection(null);
    } else {
      setEditingSection(sectionName);
    }
  };

  return (
    <div>
      {/* Header with Title and Save Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Portfolio Sections</h1>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-white text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
            Add Section
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Save
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {sections.map((section) => (
          <div key={section.id}>
            <div 
              className={`flex items-center justify-between p-4 border-b border-gray-200 transition-colors ${
                editingSection === section.name 
                  ? 'bg-cyan-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center flex-1">
                <span className="text-gray-800 font-medium">{section.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                {section.hasNewButton && (
                  <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                    {section.newButtonLabel}
                  </button>
                )}
                <button 
                  onClick={() => handleEditClick(section.name)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingSection === section.name && (
              <>
                {section.name === 'Banner' && <BannerForm />}
                {section.name === 'Our Gallery' && <OurGalleryForm />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
