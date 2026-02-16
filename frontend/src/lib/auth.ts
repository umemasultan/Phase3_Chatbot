import { useRouter } from 'next/navigation';

// Store router instance for redirects
let routerInstance: any = null;

export const setRouter = (router: any) => {
  routerInstance = router;
};

// Get JWT token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Set JWT token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove JWT token from localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Check if token exists
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Handle 401 unauthorized errors
export const handleUnauthorized = (): void => {
  removeToken();

  if (routerInstance) {
    routerInstance.push('/auth/login');
  } else {
    // Fallback to window.location if router is not available
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
};

// Decode JWT token to get user info
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Get user info from token
export const getCurrentUserFromToken = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  const decoded = decodeToken(token);
  return {
    email: decoded?.sub,
    userId: decoded?.user_id,
    exp: decoded?.exp,
    iat: decoded?.iat
  };
};

// Get current user ID from token (if available in payload)
export const getCurrentUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  const decoded = decodeToken(token);
  return decoded?.user_id || null;
};