"use client"

import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { useToast } from '@/hooks/use-toast';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';
interface Props { section: { id: number; name?: string; pageId?: number } }

export default function QuickInstallationForm({ section }: Props) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [cards, setCards] = useState<{ id: number; title: string; description: string; image?: string }[]>([]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.title !== undefined) setTitle(content.title || '');
        if (content.subTitle !== undefined) setSubTitle(content.subTitle || '');
        if (Array.isArray(content.cards)) {
          setCards(content.cards.map((c: any, idx: number) => ({ id: idx + 1, title: c?.title || '', description: c?.description || '', image: c?.image })));
        }
      }
    } catch {}
  }, [sectionResp]);

  const addNewCard = () => {
    const newCard = { id: cards.length + 1, title: '', description: '', image: '' };
    setCards(prev => [...prev, newCard]);
  };

  const removeCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = { ...baseContent, title, subTitle, cards: cards.map(c => ({ title: c.title, description: c.description, image: c.image })) };
    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ locale: 'en', content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Quick Installation updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Section Header */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            placeholder="Enter section title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Title *</label>
          <input
            type="text"
            placeholder="Enter section subtitle"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Installation Steps</h3>
          <button 
            onClick={addNewCard}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Step
          </button>
        </div>

        {cards.map((card) => (
          <div key={card.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Title *</label>
                <input
                  type="text"
                  placeholder="Enter card title"
                  value={card.title}
                  onChange={(e) => setCards(prev => prev.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  placeholder="Enter description"
                  value={card.description}
                  onChange={(e) => setCards(prev => prev.map(c => c.id === card.id ? { ...c, description: e.target.value } : c))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
                <div className="flex items-start gap-3">
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-1">
                    <span className="text-sm text-gray-400">{card.image || 'Image.png'}</span>
                    <Upload className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative w-32 h-24 border border-gray-300 rounded flex-shrink-0">
                    <img src={card.image || '/api/placeholder/130/100'} alt="Step" className="w-full h-full object-cover rounded" />
                    <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button 
                onClick={() => removeCard(card.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={handleSave} disabled={isPending} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
