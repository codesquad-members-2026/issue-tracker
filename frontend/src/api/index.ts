const BASE_URL = import.meta.env.VITE_API_URL || '';

interface RequestOptions extends RequestInit {
    params?: URLSearchParams | Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;
    
    let url = `${BASE_URL}${path}`;
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
    }

    const response = await fetch(url, init);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

export const api = {
    get: <T>(path: string, params?: RequestOptions['params']) => 
        request<T>(path, { method: 'GET', params }),
    
    post: <T>(path: string, body?: unknown, options: RequestOptions = {}) => 
        request<T>(path, { 
            method: 'POST', 
            body: body instanceof FormData ? body : JSON.stringify(body),
            headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
            ...options 
        }),
    
    patch: <T>(path: string, body?: unknown) => 
        request<T>(path, { 
            method: 'PATCH', 
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }),
    
    delete: <T>(path: string) => 
        request<T>(path, { method: 'DELETE' }),
};
