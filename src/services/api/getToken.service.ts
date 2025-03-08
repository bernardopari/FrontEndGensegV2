
export const getToken = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/token');
        if (response.ok) {
          const { token } = await response.json();
          return token.value;
        }
        return null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };