"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const router = useRouter();

  /*const checkUserToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:3006/api/auth/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        router.push('/intranet'); // Redirige al login si el token no es válido
      }
    } catch (error) {
      setIsLoading(true); // Finaliza la carga
      console.error('Error al verificar el token:', error);
      router.push('/intranet'); // Redirige al login si hay un error
    } finally {
        setIsLoading(false); // Finaliza la carga
    }
  };*/

  useEffect(() => {
    if (typeof window !== 'undefined') { // Verifica si estás en el cliente
      //checkUserToken();
    }
  }, []);

  
  
  return <>{children}</>;
};

export default Layout;
