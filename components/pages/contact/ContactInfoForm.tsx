"use client"

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type SocialLink = { id: number; label: string; url: string };
type Phone = { id: number; value: string };
type Email = { id: number; value: string };

export default function ContactInfoForm() {
  const [phones, setPhones] = useState<Phone[]>([
    { id: 1, value: "876.322.1010" },
    { id: 2, value: "876.886.3000" }
  ]);
  const [emails, setEmails] = useState<Email[]>([
    { id: 1, value: "eastlanddbs@hotmail.com" }
  ]);
  const [socials, setSocials] = useState<SocialLink[]>([
    { id: 1, label: "Twitter", url: "https://twitter.com/" }
  ]);

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

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Intro *</label>
          <textarea
            placeholder="Write a short intro for your contact card"
            rows={3}
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
    </div>
  );
}


