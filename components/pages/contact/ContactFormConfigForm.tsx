"use client"

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Subject = { id: number; label: string };

export default function ContactFormConfigForm() {
  const [enableFirstName, setEnableFirstName] = useState(true);
  const [enableLastName, setEnableLastName] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [enablePhone, setEnablePhone] = useState(true);
  const [messagePlaceholder, setMessagePlaceholder] = useState("Write your message..");
  const [buttonLabel, setButtonLabel] = useState("Send Message");
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, label: "General Inquiry" },
    { id: 2, label: "Support" }
  ]);

  const addSubject = () => setSubjects([...subjects, { id: Date.now(), label: "New Subject" }]);
  const updateSubject = (id: number, value: string) => setSubjects(subjects.map(s => s.id === id ? { ...s, label: value } : s));
  const removeSubject = (id: number) => setSubjects(subjects.filter(s => s.id !== id));

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
      </div>
    </div>
  );
}


