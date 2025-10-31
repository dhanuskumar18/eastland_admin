"use client"

import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';
import { useToast } from '@/hooks/use-toast';

interface WhyChooseUsFormProps {
  section: { id: number; name?: string; pageId?: number };
}

export default function WhyChooseUsForm({ section }: WhyChooseUsFormProps) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [descSubTitle, setDescSubTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.title !== undefined) setTitle(content.title || '');
        if (content.descSubTitle !== undefined) setDescSubTitle(content.descSubTitle || '');
        if (content.description !== undefined) setDescription(content.description || '');
      }
    } catch {}
  }, [sectionResp]);

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const partial: Record<string, any> = {};
    if (title.trim() !== '') partial.title = title.trim();
    if (descSubTitle.trim() !== '') partial.descSubTitle = descSubTitle.trim();
    if (description.trim() !== '') partial.description = description.trim();
    const content = { ...baseContent, ...partial };

    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ "locale": 'en', "content": content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Why Choose Us updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      {/* Title and Description Fields */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tittle *</label>
          <input
            type="text" 
            placeholder="Smart Setup."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description Sub Tittle *</label>
          <input
            type="text" 
            placeholder="Efficiency starts at the Layout."
            value={descSubTitle}
            onChange={(e) => setDescSubTitle(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
        />
      </div>

      {/* Image Upload Fields - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-6">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image 3 *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image 4 *</label>
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


