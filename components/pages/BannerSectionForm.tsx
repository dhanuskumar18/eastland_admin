"use client"

import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUpdateSection } from '@/hooks/useSectionsApi';
import { useSection } from '@/hooks/useSectionsApi';

interface BannerSectionFormProps {
  section: { id: number; name?: string; pageId?: number };
}

export default function BannerSectionForm({ section }: BannerSectionFormProps) {
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { data: sectionResp } = useSection(section.id, true);

  // Minimal representative fields for a banner hero
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');

  // Prefill from GET /sections/:id
  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.title !== undefined) setTitle(content.title || '');
        if (content.subtitle !== undefined) setSubtitle(content.subtitle || '');
        if (content.description !== undefined) setDescription(content.description || '');
        if (content.buttonText !== undefined) setButtonText(content.buttonText || '');
      }
    } catch {}
  }, [sectionResp]);

  const handleSave = () => {
    const content = {
      title,
      subtitle,
      description,
      buttonText,
    } as any;

    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ "locale": 'en', "content": content }] } });
  };

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Sub Tittle *</label>
              <input
                type="text" 
                placeholder="Efficiency starts at the Layout."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Name *</label>
              <input
                type="text" 
                placeholder="Explore Our Projects."
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
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
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}


