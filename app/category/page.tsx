"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

// Dummy data for categories
interface Category {
  id: string
  name: string
  for: string // 'Video' or 'Product'
  lastLogin: string
}

const dummyCategories: Category[] = [
  {
    id: '1',
    name: 'Kitchen',
    for: 'Video',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '2',
    name: 'Kitchen',
    for: 'Video',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '3',
    name: 'Kitchen',
    for: 'Video',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '4',
    name: 'Kitchen',
    for: 'Product',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '5',
    name: 'Kitchen',
    for: 'Video',
    lastLogin: '2025/10/07 at 12:11 pm'
  }
]

export default function CategoryPage() {
  const router = useRouter()
  
  // Initialize categories from localStorage or dummy data
  const initializeCategories = (): Category[] => {
    if (typeof window === 'undefined') return dummyCategories
    
    try {
      const stored = localStorage.getItem('categories_list')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
    
    // Store initial dummy data
    if (typeof window !== 'undefined') {
      localStorage.setItem('categories_list', JSON.stringify(dummyCategories))
    }
    
    return dummyCategories
  }
  
  const [categories, setCategories] = useState<Category[]>(() => initializeCategories())
  
  // Sync categories to localStorage whenever they change
  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('categories_list', JSON.stringify(newCategories))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const itemsPerPage = 10
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCategories = categories.slice(startIndex, endIndex)

  const handleAddNew = () => {
    router.push('/category/add')
  }

  const handleEdit = (category: Category) => {
    router.push(`/category/edit/${category.id}`)
  }

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // await deleteCategory(categoryToDelete.id)

      const updatedCategories = categories.filter(category => category.id !== categoryToDelete.id)
      updateCategories(updatedCategories)
      setIsDeleteModalOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error('Error deleting category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Category</h1>
        <button 
          onClick={handleAddNew}
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">CATEGORY</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">FOR</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">LAST LOGIN</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                currentCategories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(startIndex + index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {category.for}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {category.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
      {totalPages > 0 && (
        <div className="flex items-center justify-start mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const pageNum = i + 1
            if (totalPages <= 10) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200 hover:border-green-600 hover:text-green-600'
                  }`}
                >
                  {pageNum}
                </button>
              )
            } else {
              // Show first page, last page, current page, and pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200 hover:border-green-600 hover:text-green-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              } else if (pageNum === 2 || pageNum === totalPages - 1) {
                return (
                  <span key={pageNum} className="w-9 h-9 flex items-center justify-center text-gray-500">
                    ...
                  </span>
                )
              }
              return null
            }
          })}
          
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setCategoryToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  )
}