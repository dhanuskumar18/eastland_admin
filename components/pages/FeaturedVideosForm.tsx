"use client"

import { useEffect, useState } from 'react';
import { ChevronDown, Upload, X } from 'lucide-react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';
import { useToast } from '@/hooks/use-toast';

interface FeaturedVideosFormProps {
  section: { id: number; name?: string; pageId?: number };
}

type VideoItem = { id: number; category: string; tags: string; title: string; description: string; video: string };

export default function FeaturedVideosForm({ section }: FeaturedVideosFormProps) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subTitle1, setSubTitle1] = useState('');
  const [subTitle2, setSubTitle2] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([
    { id: 1, category: '', tags: '', title: '', description: '', video: '' },
    { id: 2, category: '', tags: '', title: '', description: '', video: '' }
  ]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.title !== undefined) setTitle(content.title || '');
        if (content.description !== undefined) setDescription(content.description || '');
        if (content.subTitle1 !== undefined) setSubTitle1(content.subTitle1 || '');
        if (content.subTitle2 !== undefined) setSubTitle2(content.subTitle2 || '');
        if (Array.isArray(content.videos)) {
          const parsed: VideoItem[] = content.videos.map((v: any, idx: number) => ({
            id: idx + 1,
            category: v?.category || '',
            tags: v?.tags || '',
            title: v?.title || '',
            description: v?.description || '',
            video: v?.video || '',
          }));
          if (parsed.length > 0) setVideos(parsed);
        }
      }
    } catch {}
  }, [sectionResp]);

  const handleVideoChange = (idx: number, field: keyof VideoItem, value: string) => {
    setVideos(prev => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)) as VideoItem[]);
  };

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = {
      ...baseContent,
      title,
      description,
      subTitle1,
      subTitle2,
      videos: videos.map(v => ({ category: v.category, tags: v.tags, title: v.title, description: v.description, video: v.video })),
    };

    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ "locale": 'en', "content": content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Featured Videos updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      {/* Title, Description, Sub Title 1, Sub Title 2 Fields */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text" 
            placeholder="Smart Setup."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Title 1 *</label>
          <input
            type="text" 
            placeholder="Smart Setup."
            value={subTitle1}
            onChange={(e) => setSubTitle1(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Title 2 *</label>
          <input
            type="text" 
            placeholder="Smart Setup."
            value={subTitle2}
            onChange={(e) => setSubTitle2(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Video Entries */}
      {videos.map((video, index) => (
        <div key={video.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Video {index + 1}:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                  value={video.category}
                  onChange={(e) => handleVideoChange(index, 'category', e.target.value)}
                >
                  <option value="">Select Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags *</label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                  value={video.tags}
                  onChange={(e) => handleVideoChange(index, 'tags', e.target.value)}
                >
                  <option value="">Select Tags</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Tittle *</label>
              <input
                type="text" 
                placeholder="Smart Setup."
                value={video.title}
                onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <input
                type="text" 
                placeholder="Efficiency starts at the Layout."
                value={video.description}
                onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">{video.video || 'Video.mp4'}</span>
                  <Upload className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                  <img src="/api/placeholder/130/100" alt="Video" className="w-full h-full object-cover rounded" />
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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


