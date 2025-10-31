"use client"

import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { useToast } from '@/hooks/use-toast';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';

interface Props { section: { id: number; name?: string; pageId?: number } }

export default function FutureReadyInstallationsForm({ section }: Props) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [featured, setFeatured] = useState<{ title: string; image?: string }[]>([{ title: '', image: '' }, { title: '', image: '' }]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.title !== undefined) setTitle(content.title || '');
        if (Array.isArray(content.images)) setImages([0,1,2,3].map((i) => content.images[i] || ''));
        if (Array.isArray(content.featured)) setFeatured([0,1].map((i) => ({ title: content.featured[i]?.title || '', image: content.featured[i]?.image || '' })));
      }
    } catch {}
  }, [sectionResp]);

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = { ...baseContent, title, images, featured };
    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ locale: 'en', content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Future Ready Installations updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Section Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input
          type="text"
          placeholder="Enter section title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
                  <span className="text-sm text-gray-400">{images[num - 1] || `Image${num}.png`}</span>
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src={images[num - 1] || '/api/placeholder/130/100'} alt={`Installation ${num}`} className="w-full h-full object-cover rounded" />
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
                  value={featured[num - 1]?.title}
                  onChange={(e) => setFeatured(prev => prev.map((f, i) => i === (num - 1) ? { ...f, title: e.target.value } : f))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image {num} *</label>
                <div className="flex items-start gap-3">
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                    <span className="text-sm text-gray-400">{featured[num - 1]?.image || `Featured${num}.png`}</span>
                  </div>
                  <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                    <img src={featured[num - 1]?.image || '/api/placeholder/130/100'} alt={`Featured ${num}`} className="w-full h-full object-cover rounded" />
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
      <div className="flex justify-end mt-6">
        <button onClick={handleSave} disabled={isPending} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
