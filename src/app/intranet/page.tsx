"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
//import {API_LOGIN, API_LOGIN_UNIQUE} from "@/config/apiconfig";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import {loginUser} from '@/services/authService'
import Cookies from "js-cookie"; // Importa js-cookie

const API_LOGIN = "http://localhost:3006";

interface Subunidad {
  id_subuni: number;
  n_subuni: string;
}
interface Role {
  id_rol: number;
  n_rol: string;
}
interface User {
  iddatauser: number;
  roles: Role;
  subunidad: Subunidad;
}
interface LoginResponse {
  message: string;
  admin: boolean;
  users: User[];
  token: string;
  error?: string;
}
interface RoleProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}
function RoleCard({ title, subtitle, onClick }: RoleProps) {
  return (
    <Card
      className="w-48 h-48 bg-gray-50 text-black border border-gray-600 flex flex-col items-center justify-between cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <CardContent className="text-center p-4">
        <div className="text-4xl font-bold text-green-500 mb-4">M</div>
        <div className="text-sm">{title}</div>
        <div className="text-blue-400 text-xs mt-1">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

const RoleSelectionPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<User[]>([]);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const router = useRouter();

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Buscar en la API de usuarios normales
      const response = await fetch(`${API_LOGIN}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      
      if (response.ok) {
        const data: LoginResponse = await response.json();
        
        if(data.admin){
            localStorage.setItem("token", data.token);
            setAdmin(true);
            return;
        } else {
          setUserRoles(data.users); // Actualiza roles de usuario normal
        } 
      } else {
        setError("Usuario no encontrado.");
        //console.warn("Usuario no encontrado.");
      }
    } catch (error: any) {
      setError("Error al logearse");
      //console.error("Error al logearse", error);
    }

  };

  const handleRoleSelection = async (user: User) => {
    setError(null); // Limpia errores previos
    try {
      const response = await fetch(`${API_LOGIN}/api/auth/login/unique`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iddatausuario: user.iddatauser,
          idrol: user.roles.id_rol,
          idsubunidad: user.subunidad.id_subuni,
        }),
      });
  
      if (response.ok) {
        const data: LoginResponse = await response.json();
        // Guarda el token en una cookie
        Cookies.set("auth-token", data.token, {
          expires: 1, // Expira en 1 día
          secure: process.env.NODE_ENV === "production", // Solo enviar en HTTPS en producción
          sameSite: "strict", // Protección contra CSRF
        });
        router.push(`/intranet/proyectos`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al seleccionar el rol");
      }
    } catch (error: any) {
      setError("Error al comunicarse con la API");
    }
  };

  useEffect(() => {
    if (admin) {
      router.push(`/intranet/privilegios`);
    }
  }, [admin, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-300">
      {userRoles.length > 0 ? (
        // Mostrar tarjetas de roles normales
        <div className="w-[50%] space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Selecciona un Rol y Subunidad</h2>
          <div className="grid grid-cols-3 gap-4">
            {userRoles.map((user, index) => (
              <RoleCard
                key={`${user.iddatauser}-${index}`}
                title={user.roles.n_rol}
                subtitle={user.subunidad.n_subuni}
                onClick={() => handleRoleSelection(user)}
              />
            ))}
          </div>
        </div>
      ) : (
        // Formulario de inicio de sesión
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <div className="bg-[#1a2942] p-8 text-white flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-6">
            <Image
              src="/resources/images/sinFondoLogo.png"
              alt="Universidad Nacional del Altiplano"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium mb-2">
            Gestor de <span className="text-emerald-400">Proyectos</span>
          </h1>
          <p className="text-sm opacity-90 mb-6">
            Oficina de Dirección de Proyección Social y Extension Cultural
          </p>
          <div className="mt-auto text-emerald-400 text-sm">
            GENSEG
          </div>
          <div className="text-xs opacity-70 mt-2">
            © Universidad Nacional del Altiplano, Puno - Perú, 2025.
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl text-center font-medium text-gray-900 mb-8">
            Iniciar Sesión
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="text"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su correo electrónico"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                onChange={(e) => setPassword(e.target.value)}
                aria-placeholder="••••••••"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Recordar contraseña
              </Label>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
              Ingresar Ahora
            </Button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </form>
          </div>
      </Card>s
    
        </div>
      )}
    </div>
  );
};

export default RoleSelectionPage;

