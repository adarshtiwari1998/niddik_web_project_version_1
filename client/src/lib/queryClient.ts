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

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`Making ${method} request to ${url}`, data ? { data } : '');
  
  const res = await fetch(url, {
    method,
    headers: {
            "Content-Type": "application/json",
            ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
            'Cache-Control': 'no-cache',
        },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    console.error(`Request failed: ${method} ${url}`, {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
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