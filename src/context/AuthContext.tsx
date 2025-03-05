import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NextRequest, NextResponse } from "next/server";

interface Subunidad {
  id_subuni: number;
  n_subuni: string;
}

interface Rol {
  id_rol: number;
  n_rol: string;
}

interface Usuario {
  iduser: number;
  estado: boolean;
  subunidad: Subunidad;
  roles: Rol;
}

interface DataUser {
  dni: string;
  email: string;
  nombre: string;
  APaterno: string;
  AMaterno: string;
  idpe: number | null;
  prgest: number | null;
}

export interface UserData {
  usuario: Usuario;
  dataUser: DataUser;
  access: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Crear el contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {}
  
});

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  

      const fetchUserData = async (token: string) => {
        try {
          const response = await fetch(`${API_URL}/api/auth/authenticate`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (response.ok) {
            const userData: UserData = await response.json();
            if (userData.access) {
              setUser(userData);
            }
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      };

  const logout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(() => {
      setUser(null);
      window.location.href = '/intranet';
    })
    .catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
  };

  useEffect(() => {
    // Obtener el token desde la API route
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const { token } = await response.json();
          if (token) {
            await fetchUserData(token.value);
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};