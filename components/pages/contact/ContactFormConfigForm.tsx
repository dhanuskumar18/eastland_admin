"use client"

import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSection, useUpdateSection } from '@/hooks/useSectionsApi';
import { useToast } from '@/hooks/use-toast';
import { fetchAuthenticatedCsrfToken } from '@/services/axios';

type Subject = { id: number; label: string };

interface Props { section: { id: number; name?: string; pageId?: number } }

export default function ContactFormConfigForm({ section }: Props) {
  const { data: sectionResp } = useSection(section.id, true);
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { showToast } = useToast();

  const [enableFirstName, setEnableFirstName] = useState(true);
  const [enableLastName, setEnableLastName] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [enablePhone, setEnablePhone] = useState(true);
  const [messagePlaceholder, setMessagePlaceholder] = useState("Write your message..");
  const [buttonLabel, setButtonLabel] = useState("Send Message");
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    try {
      const root: any = (sectionResp as any)?.data ?? sectionResp;
      const translations: any[] | undefined = root?.translations;
      const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
      const content = en?.content || {};
      if (content) {
        if (content.enableFirstName !== undefined) setEnableFirstName(!!content.enableFirstName);
        if (content.enableLastName !== undefined) setEnableLastName(!!content.enableLastName);
        if (content.enableEmail !== undefined) setEnableEmail(!!content.enableEmail);
        if (content.enablePhone !== undefined) setEnablePhone(!!content.enablePhone);
        if (content.messagePlaceholder !== undefined) setMessagePlaceholder(content.messagePlaceholder || '');
        if (content.buttonLabel !== undefined) setButtonLabel(content.buttonLabel || '');
        if (Array.isArray(content.subjects)) setSubjects(content.subjects.map((s: any, idx: number) => ({ id: idx + 1, label: s?.label || '' })));
      }
    } catch {}
  }, [sectionResp]);

  const addSubject = () => setSubjects([...subjects, { id: Date.now(), label: "New Subject" }]);
  const updateSubject = (id: number, value: string) => setSubjects(subjects.map(s => s.id === id ? { ...s, label: value } : s));
  const removeSubject = (id: number) => setSubjects(subjects.filter(s => s.id !== id));

  const handleSave = async () => {
    const root: any = (sectionResp as any)?.data ?? sectionResp;
    const translations: any[] | undefined = root?.translations;
    const en = translations?.find((t) => t?.locale?.toLowerCase().startsWith('en')) || translations?.[0];
    const baseContent = (en?.content || {}) as Record<string, any>;
    const content = {
      ...baseContent,
      enableFirstName,
      enableLastName,
      enableEmail,
      enablePhone,
      messagePlaceholder,
      buttonLabel,
      subjects: subjects.map(s => ({ label: s.label }))
    };
    await fetchAuthenticatedCsrfToken();
    updateSection({ id: section.id, data: { name: section.name, pageId: section.pageId, translations: [{ locale: 'en', content }] } }, {
      onSuccess: () => showToast({ type: 'success', title: 'Saved', message: 'Contact form config updated.' }),
      onError: (err: any) => showToast({ type: 'destructive', title: 'Save failed', message: err?.response?.data?.message || err?.message || 'Please try again.' })
    });
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-800">Form Fields</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableFirstName} onChange={(e) => setEnableFirstName(e.target.checked)} /> First Name
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableLastName} onChange={(e) => setEnableLastName(e.target.checked)} /> Last Name
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableEmail} onChange={(e) => setEnableEmail(e.target.checked)} /> Email
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enablePhone} onChange={(e) => setEnablePhone(e.target.checked)} /> Phone
            </label>
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Subjects</label>
            <button onClick={addSubject} className="px-2 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
          </div>
          <div className="space-y-2">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => updateSubject(s.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
                <button onClick={() => removeSubject(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message Placeholder</label>
          <input
            type="text"
            value={messagePlaceholder}
            onChange={(e) => setMessagePlaceholder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Label</label>
          <input
            type="text"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div className="col-span-2 flex justify-end">
          <button onClick={handleSave} disabled={isPending} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{isPending ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}


