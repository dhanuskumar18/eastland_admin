"use client"

import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCreateSection, useUpdateSection, useDeleteSection } from '@/hooks/useSectionsApi';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/axios';
import AboutUsForm from '@/components/pages/AboutUsForm';
import BannerSectionForm from '@/components/pages/BannerSectionForm';
import FeaturedVideosForm from '@/components/pages/FeaturedVideosForm';
import ProductsForm from '@/components/pages/ProductsForm';
import WhyChooseUsForm from '@/components/pages/WhyChooseUsForm';
import OurGalleryForm from '@/components/pages/OurGalleryForm';
import ClientTestimonialForm from '@/components/pages/ClientTestimonialForm';
import AboutBannerForm from '@/components/pages/about/BannerForm';
import MissionForm from '@/components/pages/about/MissionForm';
import VisionForm from '@/components/pages/about/VisionForm';
import TeamForm from '@/components/pages/about/TeamForm';
import CompanyBackgroundForm from '@/components/pages/about/CompanyBackgroundForm';

export default function EditPagesPage() {
  const params = useParams();
  const idRaw = (params as any)?.id as string | undefined;
  const pageId = idRaw ? Number(idRaw) : undefined;
  const qc = useQueryClient();

  // Fetch page details with embedded sections
  const { data: pageDetailResp, isLoading: loadingPage } = useQuery({
    queryKey: ['page-detail', pageId],
    queryFn: async () => {
      const res = await apiClient.get(`/pages/${pageId}`);
      return res.data;
    },
    enabled: !!pageId,
  });
  const { mutate: createSection, isPending: creating } = useCreateSection();
  const { mutate: renameSection } = useUpdateSection();
  const { mutate: removeSection, isPending: deleting, error: deleteError } = useDeleteSection();

  const sections = useMemo(() => {
    const raw = pageDetailResp;
    const fromDetail = raw?.sections || raw?.data?.sections;
    return Array.isArray(fromDetail) ? fromDetail : [];
  }, [pageDetailResp]);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const renderFormForSection = (section: any) => {
    const key = (section?.name || '').toLowerCase();
    // About-specific forms first to avoid generic matches
    if (key.includes('about') && key.includes('banner')) return <AboutBannerForm section={section} />;
    if (key.includes('mission')) return <MissionForm section={section} />;
    if (key.includes('vision')) return <VisionForm section={section} />;
    if (key.includes('team')) return <TeamForm section={section} />;
    if (key.includes('company') || key.includes('background')) return <CompanyBackgroundForm section={section} />;
    
    
    if (key.includes('banner')) return <BannerSectionForm section={section} />;
    if (key.includes('about')) return <AboutUsForm section={section} />;
    if (key.includes('video')) return <FeaturedVideosForm section={section} />;
    if (key.includes('product')) return <ProductsForm />;
    if (key.includes('why choose')) return <WhyChooseUsForm section={section} />;
    if (key.includes('gallery')) return <OurGalleryForm section={section} />;
    if (key.includes('testimonial')) return <ClientTestimonialForm section={section} />;
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">Sections</h1>
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
            {/* Page is determined by pid; page selector removed */}
            <div className="flex items-end">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                onClick={() => {
                  if (!newName.trim() || !pageId) return;
                  createSection({ name: newName.trim(), pageId: Number(pageId) }, {
                    onSuccess: () => {
                      setNewName('');
                      setShowAdd(false);
                      if (pageId) {
                        qc.invalidateQueries({ queryKey: ['page-detail', pageId] });
                      }
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
        {loadingPage ? (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(Number(section.id), {
                        onSuccess: () => {
                          if (pageId) {
                            qc.invalidateQueries({ queryKey: ['page-detail', pageId] });
                          }
                        }
                      });
                    }}
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
