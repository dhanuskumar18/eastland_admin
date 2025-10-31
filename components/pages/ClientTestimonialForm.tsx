"use client"

import { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';
import { useToast } from '@/hooks/use-toast';

interface ClientTestimonialFormProps {
  section: { id: number; name?: string; pageId?: number };
}

type ReviewItem = { id: number; name: string; profession: string; review: string; image: string };

export default function ClientTestimonialForm({ section }: ClientTestimonialFormProps) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<ReviewItem[]>([
    { id: 1, name: '', profession: '', review: '', image: '' },
    { id: 2, name: '', profession: '', review: '', image: '' },
    { id: 3, name: '', profession: '', review: '', image: '' },
  ]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (Array.isArray(content.reviews)) {
        const parsed: ReviewItem[] = content.reviews.map((r: any, idx: number) => ({
          id: idx + 1,
          name: r?.name || '',
          profession: r?.profession || '',
          review: r?.review || '',
          image: r?.image || '',
        }));
        if (parsed.length > 0) setReviews(parsed);
      }
    } catch {}
  }, [sectionResp]);

  const handleReviewChange = (idx: number, field: keyof ReviewItem, value: string) => {
    setReviews(prev => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)) as ReviewItem[]);
  };

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = {
      ...baseContent,
      reviews: reviews.map(r => ({ name: r.name, profession: r.profession, review: r.review, image: r.image })),
    };

    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ "locale": 'en', "content": content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Client Testimonial updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-8">
      {reviews.map((item, index) => (
        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Review {index + 1}:</h4>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
              <input
                type="text"
                placeholder="Thomas Raj"
                value={item.name}
                onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession *</label>
              <input
                type="text"
                placeholder="Cafe Owner"
                value={item.profession}
                onChange={(e) => handleReviewChange(index, 'profession', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
              <input
                type="text"
                placeholder="Good"
                value={item.review}
                onChange={(e) => handleReviewChange(index, 'review', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Image *</label>
              <div className="flex items-start gap-3">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                  <span className="text-sm text-gray-400">{item.image || 'Image.png'}</span>
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


