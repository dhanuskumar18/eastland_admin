"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SelectWrapper } from '@/components/ui/Select'

const tagForOptions = [
  { value: 'video', label: 'Video' },
  { value: 'product', label: 'Product' }
]

// Dummy data and localStorage getter
const dummyTags: any[] = [
  { id: '1', name: 'Kitchen', for: 'Video', lastLogin: '2025/10/07 at 12:11 pm' },
  { id: '2', name: 'Kitchen', for: 'Video', lastLogin: '2025/10/07 at 12:11 pm' },
  { id: '3', name: 'Kitchen', for: 'Video', lastLogin: '2025/10/07 at 12:11 pm' },
  { id: '4', name: 'Kitchen', for: 'Product', lastLogin: '2025/10/07 at 12:11 pm' },
  { id: '5', name: 'Kitchen', for: 'Video', lastLogin: '2025/10/07 at 12:11 pm' }
]

const getTags = () => {
  if (typeof window === 'undefined') return dummyTags
  try {
    const stored = localStorage.getItem('tags_list')
    if (stored) return JSON.parse(stored)
  } catch {}
  return dummyTags
}

export default function EditTagPage() {
  const router = useRouter()
  const params = useParams()
  const tagId = params.id as string

  const [formData, setFormData] = useState({ name: '', for: '' })
  const [formErrors, setFormErrors] = useState({ name: '', for: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoadingData(true)
      try {
        await new Promise(r => setTimeout(r, 400))
        const tags = getTags()
        const tag = tags.find((t: any) => t.id === tagId)
        if (tag) {
          setFormData({ name: tag.name, for: tag.for === 'Video' ? 'video' : 'product' })
        } else {
          router.push('/tags')
        }
      } finally {
        setIsLoadingData(false)
      }
    }
    if (tagId) load()
  }, [tagId, router])

  const validate = () => {
    const errors = { name: '', for: '' }
    let ok = true
    if (!formData.name.trim()) { errors.name = 'Tag Name is required'; ok = false }
    if (!formData.for) { errors.for = 'Tag For is required'; ok = false }
    setFormErrors(errors)
    return ok
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))
      const tags = getTags()
      const forLabel = tagForOptions.find(o => o.value === formData.for)?.label || formData.for
      const updated = tags.map((t: any) => t.id === tagId ? { ...t, name: formData.name, for: forLabel } : t)
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('tags_list', JSON.stringify(updated)) } catch {}
      }
      router.push('/tags')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading tag...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-3 p-1 hover:bg-gray-100 rounded transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Tags</h1>
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


