"use client"

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Dummy data for pages
const dummyPages = [
  {
    id: 1,
    title: "Homepage Update",
    url: "www.eastland.com/home",
    date: "2025/10/07 at 12:11 pm"
  },
  {
    id: 2,
    title: "About Us Page",
    url: "www.eastland.com/about-us",
    date: "2025/10/06 at 09:30 am"
  },
  {
    id: 3,
    title: "Our Products Page",
    url: "www.eastland.com/our-products",
    date: "2025/10/05 at 03:45 pm"
  },
  {
    id: 4,
    title: "QSR Designs Page",
    url: "www.eastland.com/qsr-designs",
    date: "2025/10/04 at 11:20 am"
  },
  {
    id: 5,
    title: "Our ServicesPage",
    url: "www.eastland.com/our-services",
    date: "2025/10/03 at 02:15 pm"
  }
];

export default function PagesPage() {
  return (
    <div className="min-h-screen">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pages</h1>
        <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
          Add New
        </button>
      </div>

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
              {dummyPages.map((page, index) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {page.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {page.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <Link href={
                        page.url.includes('/about') ? '/pages/edit/about-us' : 
                        page.url.includes('/our-products') ? '/pages/edit/our-products' : 
                        page.url.includes('/qsr-designs') ? '/pages/edit/qsr-designs' : 
                        '/pages/edit'
                      }>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
