"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SelectWrapper } from '@/components/ui/Select'

const tagForOptions = [
  { value: 'video', label: 'Video' },
  { value: 'product', label: 'Product' }
]

export default function AddTagPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', for: '' })
  const [formErrors, setFormErrors] = useState({ name: '', for: '' })
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const errors = { name: '', for: '' }
    let isValid = true
    if (!formData.name.trim()) { errors.name = 'Tag Name is required'; isValid = false }
    if (!formData.for) { errors.for = 'Tag For is required'; isValid = false }
    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))
      const forLabel = tagForOptions.find(o => o.value === formData.for)?.label || formData.for
      const newTag = { id: Date.now().toString(), name: formData.name, for: forLabel, lastLogin: 'Never' }
      if (typeof window !== 'undefined') {
        try {
          const existing = localStorage.getItem('tags_list')
          const tags = existing ? JSON.parse(existing) : []
          tags.push(newTag)
          localStorage.setItem('tags_list', JSON.stringify(tags))
        } catch {}
      }
      router.push('/tags')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Add Tags</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Tag Name*"
                type="text"
                placeholder="Enter Tag Name"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: '' }) }}
                error={formErrors.name}
                required
              />
            </div>
            <div>
              <SelectWrapper
                label="Tag For*"
                value={formData.for}
                onChange={(value) => { setFormData({ ...formData, for: value }); if (formErrors.for) setFormErrors({ ...formErrors, for: '' }) }}
                options={tagForOptions}
                placeholder="Select Video or Product"
              />
              {formErrors.for && (<p className="text-sm text-red-500 mt-1">{formErrors.for}</p>)}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={() => router.back()} disabled={isLoading} className="px-6 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50">
              {isLoading ? (<><span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Saving...</>) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


