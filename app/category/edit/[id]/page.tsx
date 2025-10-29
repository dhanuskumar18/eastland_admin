"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SelectWrapper } from '@/components/ui/Select'

const categoryForOptions = [
  { value: 'video', label: 'Video' },
  { value: 'product', label: 'Product' }
]

// Dummy data - replace with actual API call
// This should match the data in the main category page
const dummyCategories: any[] = [
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

// Helper function to get categories from localStorage or fallback to dummy data
const getCategories = () => {
  if (typeof window === 'undefined') return dummyCategories
  
  try {
    const stored = localStorage.getItem('categories_list')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
  }
  
  return dummyCategories
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  
  const [formData, setFormData] = useState({
    name: '',
    for: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    for: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    // Simulate loading category data
    const loadCategoryData = async () => {
      setIsLoadingData(true)
      
      try {
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // TODO: Replace with actual API call
        // const category = await getCategoryById(categoryId)
        
        // Try to get from localStorage first (for data consistency with main page)
        // Then fallback to dummy data
        const categories = getCategories()
        const category = categories.find((c: any) => c.id === categoryId)
        
        if (category) {
          setFormData({
            name: category.name,
            for: category.for === 'Video' ? 'video' : 'product'
          })
        } else {
          // Category not found, redirect back
          router.push('/category')
        }
      } catch (error) {
        console.error('Error loading category:', error)
        router.push('/category')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (categoryId) {
      loadCategoryData()
    }
  }, [categoryId, router])

  const validateForm = () => {
    const errors = { name: '', for: '' }
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'Category Name is required'
      isValid = false
    }

    if (!formData.for) {
      errors.for = 'Category For is required'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // await updateCategory(categoryId, formData)

      // Update localStorage to keep data in sync
      const categories = getCategories()
      const categoryForLabel = categoryForOptions.find(r => r.value === formData.for)?.label || formData.for
      const updatedCategories = categories.map((c: any) => 
        c.id === categoryId
          ? { ...c, name: formData.name, for: categoryForLabel }
          : c
      )
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('categories_list', JSON.stringify(updatedCategories))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }

      // Redirect back to categories list
      router.push('/category')
    } catch (error) {
      console.error('Error updating category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading category data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header with Back Button and Title */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Category</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Category Name*"
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' })
                }}
                error={formErrors.name}
                required
              />
            </div>
            <div>
              <SelectWrapper
                label="Category For*"
                value={formData.for}
                onChange={(value) => {
                  setFormData({ ...formData, for: value })
                  if (formErrors.for) setFormErrors({ ...formErrors, for: '' })
                }}
                options={categoryForOptions}
                placeholder="Select Video or Product"
              />
              {formErrors.for && (
                <p className="text-sm text-red-500 mt-1">{formErrors.for}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
