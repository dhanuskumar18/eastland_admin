import { useState, useCallback } from 'react';
import { 
  getUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  UsersQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  SingleUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  User
} from '../services/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0
  });
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0
  });
  const [roleCounts, setRoleCounts] = useState({
    admin: 0,
    superadmin: 0
  });

  const calculateCounts = useCallback((userList: User[]) => {
    const statusCounts = {
      all: userList.length,
      active: userList.filter(user => user.status === 'ACTIVE').length,
      inactive: userList.filter(user => user.status === 'INACTIVE').length
    };
    
    return { statusCounts };
  }, []);

  const fetchUsers = useCallback(async (params?: UsersQueryParams, updateCounts: boolean = false) => {
    console.log('📡 fetchUsers called with params:', params, 'updateCounts:', updateCounts);
    setLoading(true);
    setError(null);
    try {
      const response: UsersListResponse = await getUsers(params);
      setUsers(response.data.items);
      setPagination({
        page: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total
      });
      
      // Only update counts if explicitly requested
      if (updateCounts) {
        // Use API statusBreakdown if available, otherwise calculate from items
        if (response.data.statusBreakdown) {
          const newStatusCounts = {
            all: response.data.total,
            active: response.data.statusBreakdown.ACTIVE?.count || 0,
            inactive: response.data.statusBreakdown.INACTIVE?.count || 0
          };
          setStatusCounts(newStatusCounts);
        } else {
          const { statusCounts: newStatusCounts } = calculateCounts(response.data.items);
          setStatusCounts(newStatusCounts);
        }
        
        // Use API roleBreakdown if available
        if (response.data.roleBreakdown) {
          const newRoleCounts = {
            admin: response.data.roleBreakdown.ADMIN?.count || 0,
            superadmin: response.data.roleBreakdown.SUPERADMIN?.count || 0
          };
          setRoleCounts(newRoleCounts);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((updateCounts: boolean = false) => {
    fetchUsers(undefined, updateCounts);
  }, []);

  // Separate function to load counts only
  const loadCounts = useCallback(async () => {
    console.log('📊 loadCounts called');
    try {
      const response: UsersListResponse = await getUsers({ page: '1', pageSize: '1' });
      if (response.data.items.length > 0) {
        // Use API statusBreakdown if available, otherwise calculate from items
        if (response.data.statusBreakdown) {
          const newStatusCounts = {
            all: response.data.total,
            active: response.data.statusBreakdown.ACTIVE?.count || 0,
            inactive: response.data.statusBreakdown.INACTIVE?.count || 0
          };
          setStatusCounts(newStatusCounts);
        } else {
          const { statusCounts: newStatusCounts } = calculateCounts(response.data.items);
          setStatusCounts(newStatusCounts);
        }
        
        // Use API roleBreakdown if available
        if (response.data.roleBreakdown) {
          const newRoleCounts = {
            admin: response.data.roleBreakdown.ADMIN?.count || 0,
            superadmin: response.data.roleBreakdown.SUPERADMIN?.count || 0
          };
          setRoleCounts(newRoleCounts);
        }
      }
    } catch (err) {
      console.error('Error loading counts:', err);
    }
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    statusCounts,
    roleCounts,
    fetchUsers,
    refetch,
    loadCounts
  };
};

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserMutation = useCallback(async (userData: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: CreateUserResponse = await createUser(userData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser: createUserMutation,
    loading,
    error
  };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserMutation = useCallback(async (userId: string, userData: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: UpdateUserResponse = await updateUser(userId, userData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateUser: updateUserMutation,
    loading,
    error
  };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUserMutation = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: DeleteUserResponse = await deleteUser(userId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteUser: deleteUserMutation,
    loading,
    error
  };
};
