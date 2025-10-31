"use client"

import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { useToast } from '@/hooks/use-toast';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';

type SocialLink = { id: number; label: string; url: string };
type Phone = { id: number; value: string };
type Email = { id: number; value: string };

interface Props { section: { id: number; name?: string; pageId?: number } }

export default function ContactInfoForm({ section }: Props) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [intro, setIntro] = useState('');
  const [address, setAddress] = useState('');
  const [phones, setPhones] = useState<Phone[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.intro !== undefined) setIntro(content.intro || '');
        if (content.address !== undefined) setAddress(content.address || '');
        if (Array.isArray(content.phones)) setPhones(content.phones.map((p: any, idx: number) => ({ id: idx + 1, value: p?.value || p || '' })));
        if (Array.isArray(content.emails)) setEmails(content.emails.map((e: any, idx: number) => ({ id: idx + 1, value: e?.value || e || '' })));
        if (Array.isArray(content.socials)) setSocials(content.socials.map((s: any, idx: number) => ({ id: idx + 1, label: s?.label || '', url: s?.url || '' })));
      }
    } catch {}
  }, [sectionResp]);

  const addPhone = () => setPhones([...phones, { id: Date.now(), value: "" }]);
  const removePhone = (id: number) => setPhones(phones.filter(p => p.id !== id));
  const updatePhone = (id: number, value: string) => setPhones(phones.map(p => p.id === id ? { ...p, value } : p));

  const addEmail = () => setEmails([...emails, { id: Date.now(), value: "" }]);
  const removeEmail = (id: number) => setEmails(emails.filter(e => e.id !== id));
  const updateEmail = (id: number, value: string) => setEmails(emails.map(e => e.id === id ? { ...e, value } : e));

  const addSocial = () => setSocials([...socials, { id: Date.now(), label: "", url: "" }]);
  const removeSocial = (id: number) => setSocials(socials.filter(s => s.id !== id));
  const updateSocial = (id: number, field: "label" | "url", value: string) =>
    setSocials(socials.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = {
      ...baseContent,
      intro,
      address,
      phones: phones.map(p => ({ value: p.value })),
      emails: emails.map(e => ({ value: e.value })),
      socials: socials.map(s => ({ label: s.label, url: s.url }))
    };
    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ locale: 'en', content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Contact info updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Intro *</label>
          <textarea
            placeholder="Write a short intro for your contact card"
            rows={3}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
            <button onClick={addPhone} className="px-2 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
          </div>
          <div className="space-y-2">
            {phones.map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter phone"
                  value={p.value}
                  onChange={(e) => updatePhone(p.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
                <button onClick={() => removePhone(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Emails</label>
            <button onClick={addEmail} className="px-2 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
          </div>
          <div className="space-y-2">
            {emails.map(e => (
              <div key={e.id} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={e.value}
                  onChange={(ev) => updateEmail(e.id, ev.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
                <button onClick={() => removeEmail(e.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Social Links</label>
            <button onClick={addSocial} className="px-2 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
          </div>
          <div className="space-y-2">
            {socials.map(s => (
              <div key={s.id} className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g., Twitter)"
                  value={s.label}
                  onChange={(e) => updateSocial(s.id, "label", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={s.url}
                  onChange={(e) => updateSocial(s.id, "url", e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
                <div className="col-span-3 flex justify-end">
                  <button onClick={() => removeSocial(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
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


