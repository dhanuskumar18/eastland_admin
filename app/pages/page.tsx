"use client"

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCreatePage, useDeletePage, usePages } from '@/hooks/usePagesApi';

export default function PagesPage() {
  const { data, isLoading } = usePages();
  const { mutate: removePage, isPending: isDeleting } = useDeletePage();
  const { mutate: createPage, isPending: isCreating } = useCreatePage();
  const pages = useMemo(() => (Array.isArray(data?.data) ? data?.data : []), [data]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pages</h1>
        <button
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Close' : 'Add New'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Page Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Home"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Page Link (slug)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="home"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
              />
            </div>
            <div className="flex items-end">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                onClick={() => {
                  if (!name.trim() || !slug.trim()) return;
                  createPage({ name: name.trim(), slug: slug.trim() }, {
                    onSuccess: () => {
                      setName('');
                      setSlug('');
                      setShowForm(false);
                    }
                  });
                }}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">PAGE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">DATE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600" colSpan={5}>Loading...</td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600" colSpan={5}>No pages found.</td>
                </tr>
              ) : (
                pages.map((page, index) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {`/${page.slug}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {page.createdAt ? new Date(page.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <Link href={`/pages/edit/${page.id}`}>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          onClick={() => removePage(page.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-start mt-6 space-x-2">
        <button className="w-9 h-9 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="w-9 h-9 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors">1</button>
        <button className="w-9 h-9 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors">2</button>
        <button className="w-9 h-9 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium">...</button>
        <button className="w-9 h-9 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors">9</button>
        <button className="w-9 h-9 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors">10</button>
        <button className="w-9 h-9 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
