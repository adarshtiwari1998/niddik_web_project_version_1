import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Token storage key
export const TOKEN_KEY = 'niddik_auth_token';

// Function to get the stored JWT token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Function to set the JWT token
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Function to remove the JWT token
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Function to add auth headers to requests
const getAuthHeaders = (hasContent: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  if (hasContent) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Legacy API request function (for backwards compatibility)
export const apiRequestLegacy = async (method: string, url: string, data?: any) => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  // Handle response errors
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }

  return response.json();
};

// Modern API request function (compatible with current usage patterns)
export const apiRequest = async (url: string, options?: RequestInit) => {
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(url, config);
  
  // Handle response errors
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }

  return response.json();
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    let url = queryKey[0] as string;
    
    // Check if there are query parameters in the queryKey
    if (queryKey[1] && typeof queryKey[1] === 'object') {
      const params = new URLSearchParams();
      const queryParams = queryKey[1] as Record<string, any>;
      
      // Add each parameter to the URL
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      // Only add parameters if we have any
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false, // Default to false, individual queries can override
      refetchOnWindowFocus: true, // Enable refetch on window focus
      staleTime: 1000 * 30, // 30 seconds - shorter stale time for fresher data
      gcTime: 1000 * 60 * 5, // 5 minutes garbage collection time
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.message?.includes('401') || error?.message?.includes('403')) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});