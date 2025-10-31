"use client"

import { Upload, X, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';
import { useToast } from '@/hooks/use-toast';

type TeamMember = { id: number; name: string; profession: string; about: string; image?: string };
interface Props { section: { id: number; name?: string; pageId?: number } }

export default function TeamForm({ section }: Props) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (Array.isArray(content.members)) {
        setMembers(content.members.map((m: any, idx: number) => ({ id: idx + 1, name: m?.name || '', profession: m?.profession || '', about: m?.about || '', image: m?.image })));
      }
    } catch {}
  }, [sectionResp]);

  const handleChange = (idx: number, field: keyof TeamMember, value: string) => {
    setMembers(prev => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)) as TeamMember[]);
  };

  const addMember = () => {
    setMembers(prev => [...prev, { id: prev.length + 1, name: '', profession: '', about: '', image: '' }]);
  };

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = { ...baseContent, members: members.map(m => ({ name: m.name, profession: m.profession, about: m.about, image: m.image })) };
    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ "locale": 'en', "content": content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Team updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <button onClick={addMember} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {members.map((member, index) => (
        <div key={member.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession *</label>
              <input
                type="text"
                value={member.profession}
                onChange={(e) => handleChange(index, 'profession', e.target.value)}
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
                  <img src="/api/placeholder/130/100" alt={member.name || 'Member'} className="w-full h-full object-cover rounded" />
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
              value={member.about}
              onChange={(e) => handleChange(index, 'about', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={isPending} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}


