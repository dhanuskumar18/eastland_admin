import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

export const useAuthWithToast = () => {
  const auth = useAuth();
  const { showToast } = useToast();

  const loginWithToast = (token: string, user: User) => {
    auth.login(token, user);
    showToast({
      type: 'success',
      title: 'Login successful',
      message: `Welcome back, ${user.email}!`,
    });
  };

  const logoutWithToast = async () => {
    await auth.logout();
    showToast({
      type: 'success',
      title: 'Logged out',
      message: 'You have been successfully logged out',
    });
  };

  return {
    ...auth,
    loginWithToast,
    logoutWithToast,
    showToast,
  };
}; 