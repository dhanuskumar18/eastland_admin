    "use client"

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AboutUsForm from '@/components/pages/AboutUsForm';
import BannerSectionForm from '@/components/pages/BannerSectionForm';
import FeaturedVideosForm from '@/components/pages/FeaturedVideosForm';
import ProductsForm from '@/components/pages/ProductsForm';
import WhyChooseUsForm from '@/components/pages/WhyChooseUsForm';
import OurGalleryForm from '@/components/pages/OurGalleryForm';
import ClientTestimonialForm from '@/components/pages/ClientTestimonialForm';

// Dummy data for home page sections
const homePageSections = [
  { id: 1, name: "Banner Section" },
  { id: 2, name: "About Us" },
  { id: 3, name: "Featured Videos", hasNewButton: true, newButtonLabel: "New Video" },
  { id: 4, name: "Products", hasNewButton: true, newButtonLabel: "New Product" },
  { id: 5, name: "Why Choose Us" },
  { id: 6, name: "Our Gallery" },
  { id: 7, name: "Client Testimonial", hasNewButton: true, newButtonLabel: "Add New" }
];

export default function EditPagesPage() {
  const [editingSection, setEditingSection] = useState<string | null>(null);

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
        <h1 className="text-2xl font-semibold text-gray-800">Home Page Sections</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Save
        </button>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {homePageSections.map((section, index) => (
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
            
            {/* Show Edit Form when this section is being edited */}
            {editingSection === section.name && (
              <>
                {section.name === "Banner Section" && <BannerSectionForm />}
                {section.name === "About Us" && <AboutUsForm />}
                {section.name === "Featured Videos" && <FeaturedVideosForm />}
                {section.name === "Products" && <ProductsForm />}
                {section.name === "Why Choose Us" && <WhyChooseUsForm />}
                {section.name === "Our Gallery" && <OurGalleryForm />}
                {section.name === "Client Testimonial" && <ClientTestimonialForm />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
