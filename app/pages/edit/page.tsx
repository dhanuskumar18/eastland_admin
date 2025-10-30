    "use client"

import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSections, useCreateSection, useUpdateSection, useDeleteSection } from '@/hooks/useSectionsApi';
import { usePages } from '@/hooks/usePagesApi';
import AboutUsForm from '@/components/pages/AboutUsForm';
import BannerSectionForm from '@/components/pages/BannerSectionForm';
import FeaturedVideosForm from '@/components/pages/FeaturedVideosForm';
import ProductsForm from '@/components/pages/ProductsForm';
import WhyChooseUsForm from '@/components/pages/WhyChooseUsForm';
import OurGalleryForm from '@/components/pages/OurGalleryForm';
import ClientTestimonialForm from '@/components/pages/ClientTestimonialForm';

export default function EditPagesPage() {
  const { data: pagesResp } = usePages();
  const pages = useMemo(() => (Array.isArray(pagesResp?.data) ? pagesResp?.data : []), [pagesResp]);
  const [selectedPageId, setSelectedPageId] = useState<number | ''>('');

  const { data: sectionsResp, isLoading: loadingSections } = useSections(selectedPageId ? Number(selectedPageId) : undefined);
  const { mutate: createSection, isPending: creating } = useCreateSection();
  const { mutate: renameSection } = useUpdateSection();
  const { mutate: removeSection, isPending: deleting, error: deleteError } = useDeleteSection();

  const sections = useMemo(() => (Array.isArray(sectionsResp?.data) ? sectionsResp?.data : []), [sectionsResp]);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPageId, setNewPageId] = useState<number | ''>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const renderFormForSection = (section: any) => {
    const key = (section?.name || '').toLowerCase();
    if (key.includes('banner')) return <BannerSectionForm section={section} />;
    if (key.includes('about')) return <AboutUsForm section={section} />;
    if (key.includes('video')) return <FeaturedVideosForm />;
    if (key.includes('product')) return <ProductsForm />;
    if (key.includes('why choose')) return <WhyChooseUsForm />;
    if (key.includes('gallery')) return <OurGalleryForm />;
    if (key.includes('testimonial')) return <ClientTestimonialForm />;
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">Sections</h1>
          <select
            value={selectedPageId as any}
            onChange={(e) => setSelectedPageId(e.target.value ? Number(e.target.value) : '')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
          >
            <option value="">Select page</option>
            {pages.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} ({p.slug})</option>
            ))}
          </select>
        </div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          onClick={() => setShowAdd(v => !v)}
        >
          {showAdd ? 'Close' : 'Add Section'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Section Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="hero"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Page</label>
              <select
                value={newPageId as any}
                onChange={(e) => setNewPageId(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
              >
                <option value="">Select page</option>
                {pages.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.slug})</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                onClick={() => {
                  if (!newName.trim() || !newPageId) return;
                  createSection({ name: newName.trim(), pageId: Number(newPageId) }, {
                    onSuccess: () => {
                      setNewName('');
                      setNewPageId('');
                      setShowAdd(false);
                    }
                  });
                }}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loadingSections ? (
          <div className="p-4 text-sm text-gray-600">Loading...</div>
        ) : sections.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No sections found.</div>
        ) : (
          sections.map((section: any) => (
            <div key={section.id} className="border-b border-gray-200">
              <div
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${editId === section.id ? 'bg-cyan-50' : 'hover:bg-gray-50'}`}
                onClick={() => {
                  setEditId(prev => (prev === section.id ? null : section.id));
                  setEditName(section.name || '');
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-medium">{section.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {editId !== section.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditId(section.id); setEditName(section.name || ''); }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    onClick={(e) => { e.stopPropagation(); removeSection(Number(section.id)); }}
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {editId === section.id && (
                <div className="p-4 border-t border-gray-100">
                  {renderFormForSection(section) || (
                    <div className="text-sm text-gray-600">No form mapped for this section.</div>
                  )}
                  {deleteError && (
                    <div className="mt-2 text-sm text-red-600">Failed to delete: {(deleteError as any)?.message || 'Unknown error'}</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
