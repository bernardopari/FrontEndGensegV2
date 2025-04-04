export const getToken = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/auth/token', {
      cache: 'no-store'
    });
    console.log(response, "response");
    if (!response.ok) throw new Error('Token request failed');
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format');
    }
    const { token } = await response.json();
    console.log(token, "token");
    return typeof token === 'string' ? token : null;
    
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};