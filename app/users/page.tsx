"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

// Dummy data for users
interface User {
  id: string
  name: string
  email: string
  role: string
  lastLogin: string
}

const dummyUsers: User[] = [
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

export default function UsersPage() {
  const router = useRouter()
  
  // Initialize users from localStorage or dummy data
  const initializeUsers = (): User[] => {
    if (typeof window === 'undefined') return dummyUsers
    
    try {
      const stored = localStorage.getItem('users_list')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
    
    // Store initial dummy data
    if (typeof window !== 'undefined') {
      localStorage.setItem('users_list', JSON.stringify(dummyUsers))
    }
    
    return dummyUsers
  }
  
  const [users, setUsers] = useState<User[]>(() => initializeUsers())
  
  // Sync users to localStorage whenever they change
  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('users_list', JSON.stringify(newUsers))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  const handleAddNew = () => {
    router.push('/users/add')
  }

  const handleEdit = (user: User) => {
    router.push(`/users/edit/${user.id}`)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // await deleteUser(userToDelete.id)

      const updatedUsers = users.filter(user => user.id !== userToDelete.id)
      updateUsers(updatedUsers)
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error('Error deleting user:', error)
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
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">NAME</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ROLE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">LAST LOGIN</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(startIndex + index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
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
          setUserToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  )
}