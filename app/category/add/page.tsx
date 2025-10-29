"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SelectWrapper } from '@/components/ui/Select'

const categoryForOptions = [
  { value: 'video', label: 'Video' },
  { value: 'product', label: 'Product' }
]

export default function AddCategoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    for: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    for: ''
  })
  const [isLoading, setIsLoading] = useState(false)

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
      // await createCategory(formData)

      // Add new category to localStorage to keep data in sync
      const categoryForLabel = categoryForOptions.find(r => r.value === formData.for)?.label || formData.for
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name,
        for: categoryForLabel,
        lastLogin: 'Never'
      }
      
      if (typeof window !== 'undefined') {
        try {
          const existingCategories = localStorage.getItem('categories_list')
          const categories = existingCategories ? JSON.parse(existingCategories) : []
          categories.push(newCategory)
          localStorage.setItem('categories_list', JSON.stringify(categories))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }

      // Redirect back to categories list
      router.push('/category')
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-semibold text-gray-800">Add Category</h1>
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
