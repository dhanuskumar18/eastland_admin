"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SelectWrapper } from '@/components/ui/Select'

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' }
]

// Dummy data - replace with actual API call
// This should match the data in the main users page
const dummyUsers: any[] = [
  {
    id: '1',
    name: 'John Mathew',
    email: 'sample@gmail.com',
    role: 'Super Admin',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '2',
    name: 'John Mathew',
    email: 'sample@gmail.com',
    role: 'Super Admin',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '3',
    name: 'John Mathew',
    email: 'sample@gmail.com',
    role: 'Super Admin',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '4',
    name: 'John Mathew',
    email: 'sample@gmail.com',
    role: 'Super Admin',
    lastLogin: '2025/10/07 at 12:11 pm'
  },
  {
    id: '5',
    name: 'John Mathew',
    email: 'sample@gmail.com',
    role: 'Super Admin',
    lastLogin: '2025/10/07 at 12:11 pm'
  }
]

// Helper function to get users from localStorage or fallback to dummy data
const getUsers = () => {
  if (typeof window === 'undefined') return dummyUsers
  
  try {
    const stored = localStorage.getItem('users_list')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
  }
  
  return dummyUsers
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
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
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoadingData(true)
      
      try {
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // TODO: Replace with actual API call
        // const user = await getUserById(userId)
        
        // Try to get from localStorage first (for data consistency with main page)
        // Then fallback to dummy data
        const users = getUsers()
        const user = users.find((u: any) => u.id === userId)
        
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role === 'Super Admin' ? 'super_admin' : 'admin'
          })
        } else {
          // User not found, redirect back
          router.push('/users')
        }
      } catch (error) {
        console.error('Error loading user:', error)
        router.push('/users')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (userId) {
      loadUserData()
    }
  }, [userId, router])

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
      // await updateUser(userId, formData)

      // Update localStorage to keep data in sync
      const users = getUsers()
      const roleLabel = roleOptions.find(r => r.value === formData.role)?.label || formData.role
      const updatedUsers = users.map((u: any) => 
        u.id === userId
          ? { ...u, name: formData.name, email: formData.email, role: roleLabel }
          : u
      )
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('users_list', JSON.stringify(updatedUsers))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }

      // Redirect back to users list
      router.push('/users')
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
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
        <h1 className="text-2xl font-semibold text-gray-800">Edit User</h1>
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
