// services/authService.ts
// Handles all authentication API calls using localStorage + Bearer tokens

const API_URL = 'https://api.demo.arin-africa.org';

/**
 * Store token in localStorage
 */
function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('arin_access_token', token);
  }
}

/**
 * Store refresh token in localStorage
 */
function setRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('arin_refresh_token', token);
  }
}

/**
 * Get access token from localStorage
 */
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('arin_access_token');
  }
  return null;
}

/**
 * Get refresh token from localStorage
 */
function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('arin_refresh_token');
  }
  return null;
}

/**
 * Clear all auth tokens
 */
function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('arin_access_token');
    localStorage.removeItem('arin_refresh_token');
  }
}

/**
 * Make API request with Authorization header
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  
  console.log('🔐 fetchWithAuth called');
  console.log('   URL:', url);
  console.log('   Token found:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('   ✅ Authorization header added');
  } else {
    console.log('   ❌ NO TOKEN - Authorization header NOT added');
  }
  
  const fetchOptions = {
    ...options,
    headers,
  };
  
  console.log('   Headers:', Object.keys(headers));
  
  return fetch(url, fetchOptions);
}

/**
 * Login with email and password
 */

export async function login(email: string, password: string) {
  console.log('🔐 Login attempted for:', email);
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  console.log('   Response status:', res.status);

  if (!res.ok) {
    const data = await res.json();
    console.log('   ❌ Login failed:', data.message);
    throw new Error(data.message || 'Login failed');
  }

  const data = await res.json();
  
  console.log('   ✅ Login response received');
  console.log('   Response keys:', Object.keys(data));
  console.log('   Has access_token:', !!data.access_token);
  console.log('   Has refresh_token:', !!data.refresh_token);
  
  // Store tokens in localStorage
  if (data.access_token) {
    setToken(data.access_token);
    console.log('   ✅ Access token stored in localStorage');
  } else {
    console.log('   ❌ No access_token in response!');
  }
  
  if (data.refresh_token) {
    setRefreshToken(data.refresh_token);
    console.log('   ✅ Refresh token stored in localStorage');
  } else {
    console.log('   ❌ No refresh_token in response!');
  }
  
  // Verify tokens are stored
  const storedToken = getToken();
  console.log('   Verification - Token in localStorage:', storedToken ? 'YES' : 'NO');
  
  return data;
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
  try {
    console.log('👤 getCurrentUser called');
    const res = await fetchWithAuth(`${API_URL}/auth/me`, {
      method: 'GET',
    });

    console.log('   Response status:', res.status);

    // If unauthorized, try refreshing the token
    if (res.status === 401) {
      console.log('   ❌ Got 401 - attempting token refresh');
      const refreshed = await refreshTokens();
      if (refreshed) {
        console.log('   ✅ Token refreshed - retrying request');
        // Retry with new token
        const retryRes = await fetchWithAuth(`${API_URL}/auth/me`, {
          method: 'GET',
        });
        if (retryRes.ok) {
          const userData = await retryRes.json();
          console.log('   ✅ Retry successful');
          return userData;
        }
      }
      console.log('   ❌ Refresh failed or retry failed');
      return null;
    }

    if (!res.ok) {
      console.log('   ❌ Request failed with status:', res.status);
      return null;
    }

    const userData = await res.json();
    console.log('   ✅ Got user data');
    return userData;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      console.error('Token refresh failed');
      clearTokens();
      return false;
    }

    const data = await res.json();
    
    // Store new tokens
    setToken(data.access_token);
    setRefreshToken(data.refresh_token);
    
    console.log('✅ Tokens refreshed successfully');
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    return false;
  }
}

/**
 * Logout - clear tokens
 */
export async function logout() {
  try {
    const res = await fetchWithAuth(`${API_URL}/auth/logout`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Logout failed');
    }

    clearTokens();
    console.log('✅ Logged out successfully');
    
    return await res.json();
  } catch (error) {
    // Clear tokens anyway
    clearTokens();
    throw error;
  }
}

/**
 * Export for use in API calls
 */
export { fetchWithAuth, getToken, getRefreshToken, clearTokens }
