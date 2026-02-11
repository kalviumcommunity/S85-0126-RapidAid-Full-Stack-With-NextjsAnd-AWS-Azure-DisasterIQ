// Authenticated fetch helper that automatically includes cookies
export interface AuthFetchOptions extends RequestInit {
  // Allow any additional fetch options
}

export async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
  // Prepare headers
  const headers = new Headers(options.headers);
  
  // Add Content-Type if not already set and we have a body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Make fetch request with credentials to include cookies
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
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
