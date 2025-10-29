"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SelectWrapper } from '@/components/ui/Select'

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' }
]

export default function AddUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    role: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const errors = { name: '', email: '', role: '' }
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'User Name is required'
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = 'Email ID is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!formData.role) {
      errors.role = 'Role is required'
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
      // await createUser(formData)

      // Add new user to localStorage to keep data in sync
      const roleLabel = roleOptions.find(r => r.value === formData.role)?.label || formData.role
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: roleLabel,
        lastLogin: 'Never'
      }
      
      if (typeof window !== 'undefined') {
        try {
          const existingUsers = localStorage.getItem('users_list')
          const users = existingUsers ? JSON.parse(existingUsers) : []
          users.push(newUser)
          localStorage.setItem('users_list', JSON.stringify(users))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }

      // Redirect back to users list
      router.push('/users')
    } catch (error) {
      console.error('Error saving user:', error)
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
        <h1 className="text-2xl font-semibold text-gray-800">Add User</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="User Name*"
                type="text"
                placeholder="Enter Name"
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
              <Input
                label="Email ID*"
                type="email"
                placeholder="Enter Email Id"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' })
                }}
                error={formErrors.email}
                required
              />
            </div>
            <div>
              <SelectWrapper
                label="Role*"
                value={formData.role}
                onChange={(value) => {
                  setFormData({ ...formData, role: value })
                  if (formErrors.role) setFormErrors({ ...formErrors, role: '' })
                }}
                options={roleOptions}
                placeholder="Select Role"
              />
              {formErrors.role && (
                <p className="text-sm text-red-500 mt-1">{formErrors.role}</p>
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
