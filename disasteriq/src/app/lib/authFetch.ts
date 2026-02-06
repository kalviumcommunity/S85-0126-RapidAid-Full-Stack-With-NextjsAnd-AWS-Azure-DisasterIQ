// Authenticated fetch helper that automatically includes JWT token
export interface AuthFetchOptions extends RequestInit {
  // Allow any additional fetch options
}

export async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Prepare headers
  const headers = new Headers(options.headers);
  
  // Add Authorization header if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Add Content-Type if not already set and we have a body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Make the fetch request with auth headers
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Handle 401 Unauthorized - clear token and redirect to login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/pages/login';
    }
  }
  
  return response;
}

// Helper methods for common HTTP operations
export const authApi = {
  get: (url: string, options?: AuthFetchOptions) => authFetch(url, { ...options, method: 'GET' }),
  post: (url: string, data?: any, options?: AuthFetchOptions) => 
    authFetch(url, { 
      ...options, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  put: (url: string, data?: any, options?: AuthFetchOptions) => 
    authFetch(url, { 
      ...options, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  patch: (url: string, data?: any, options?: AuthFetchOptions) => 
    authFetch(url, { 
      ...options, 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  delete: (url: string, options?: AuthFetchOptions) => authFetch(url, { ...options, method: 'DELETE' }),
  
  // For multipart/form-data (like file uploads)
  postFormData: (url: string, formData: FormData, options?: AuthFetchOptions) => 
    authFetch(url, { 
      ...options, 
      method: 'POST', 
      body: formData 
    }),
};
