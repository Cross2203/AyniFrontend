interface TokenResponse {
    access: string;
    refresh: string;
  }
  
  interface User {
    email: string;
    username: string;
    // Añade aquí cualquier otra propiedad que tu usuario pueda tener
  }
  
  export async function loginUser(email: string, password: string): Promise<TokenResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data = await response.json();
    return data;
  }
  
  export async function fetchUserData(): Promise<User> {
    const response = await fetchWithTokenRefresh('/user');
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data.user;
  }

export async function refreshToken(): Promise<string> {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refresh_token }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  return data.access;
}

export async function fetchWithTokenRefresh(url: string, options: RequestInit = {}): Promise<Response> {
  const fetchWithToken = async (token: string): Promise<Response> => {
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, newOptions);
  };

  try {
    let token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token available');
    }

    let response = await fetchWithToken(token);

    if (response.status === 401) {
      // Token might be expired, try to refresh
      token = await refreshToken();
      localStorage.setItem('access_token', token);
      response = await fetchWithToken(token);
    }

    return response;
  } catch (error) {
    console.error('Error in fetchWithTokenRefresh:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    await fetchWithTokenRefresh('/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh: refresh_token }),
    });
  } finally {
    // Limpiar tokens incluso si la solicitud falla
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}