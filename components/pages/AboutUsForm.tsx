"use client"

import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { useToast } from '@/hooks/use-toast';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';

interface AboutUsFormProps {
  section: { id: number; name?: string; pageId?: number };
}

export default function AboutUsForm({ section }: AboutUsFormProps) {
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();
  const { data: sectionResp } = useSection(section.id, true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subTitle1, setSubTitle1] = useState('');
  const [subTitle2, setSubTitle2] = useState('');
  const [descSubTitle, setDescSubTitle] = useState('');
  const [description1, setDescription1] = useState('');
  const [description2, setDescription2] = useState('');

  // Prefill from existing translation content if available
  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.title !== undefined) setTitle(content.title || '');
        if (content.subTitle1 !== undefined) setSubTitle1(content.subTitle1 || '');
        if (content.subTitle2 !== undefined) setSubTitle2(content.subTitle2 || '');
        if (content.descSubTitle !== undefined) setDescSubTitle(content.descSubTitle || '');
        if (content.description1 !== undefined) setDescription1(content.description1 || '');
        if (content.description2 !== undefined) setDescription2(content.description2 || '');
      }
    } catch {}
  }, [sectionResp]);

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(null);
    // Start with existing content from server (so required fields remain present)
    const translations: any[] | undefined = (sectionResp as any)?.data?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;

    // Only include fields the user actually filled (non-empty) to avoid backend validations
    const partial: Record<string, any> = {};
    if (title.trim() !== '') partial.title = title.trim();
    if (subTitle1.trim() !== '') partial.subTitle1 = subTitle1.trim();
    if (subTitle2.trim() !== '') partial.subTitle2 = subTitle2.trim();
    if (descSubTitle.trim() !== '') partial.descSubTitle = descSubTitle.trim();
    if (description1.trim() !== '') partial.description1 = description1.trim();
    if (description2.trim() !== '') partial.description2 = description2.trim();

    let content: Record<string, any> = { ...baseContent, ...partial };
    if (!content || Object.keys(content).length === 0) {
      // Ensure a non-empty JSON object so Prisma JSON column is not undefined/null
      content = { __updated: true };
    }

    await fetchAuthenticatedCsrfToken();
    updateSection(
      { id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ "locale": 'en', "content": content }] } },
      {
        onSuccess: () => {
          showToast({ type: 'success', title: 'Saved', message: 'About Us updated successfully.' });
          setSaveSuccess('Saved successfully');
        },
        onError: (err: any) => {
          const apiMsg = err?.response?.data?.message || err?.message;
          showToast({ type: 'destructive', title: 'Save failed', message: apiMsg || 'Please try again.' });
          setSaveError(apiMsg || 'Save failed');
          console.error('AboutUs save error:', err?.response?.data || err);
        },
      }
    );
  };

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Tittle 1 *</label>
            <input
              type="text" 
              placeholder="Smart Setup."
              value={subTitle1}
              onChange={(e) => setSubTitle1(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Tittle 2 *</label>
            <input
              type="text" 
              placeholder="Smart Setup."
              value={subTitle2}
              onChange={(e) => setSubTitle2(e.target.value)}
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
              value={descSubTitle}
              onChange={(e) => setDescSubTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input
              type="text" 
              placeholder="Explore Our Projects."
              value={description1}
              onChange={(e) => setDescription1(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input
              type="text" 
              placeholder="Explore Our Projects."
              value={description2}
              onChange={(e) => setDescription2(e.target.value)}
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
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {(saveError || saveSuccess) && (
        <div className="mt-3 text-sm">
          {saveError && <div className="text-red-600">{saveError}</div>}
          {saveSuccess && <div className="text-green-600">{saveSuccess}</div>}
        </div>
      )}
    </div>
  );
}


