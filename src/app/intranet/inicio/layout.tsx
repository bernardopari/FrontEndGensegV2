"use client"
import { AppSidebar } from "./components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ReactNode } from 'react';
import { usePathname } from "next/navigation";
import { Fragment } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  // Mapeo de nombres para las rutas
  const pathLabels: { [key: string]: string } = {
    '/inicio': 'Principal',
    '/inicio/proyectos': 'Proyectos',
    '/inicio/proyectos/actividades': 'Actividades',
    '/inicio/formularios': 'formularios',
  };

  // Generar los items del breadcrumb
  const generateBreadcrumbs = () => {
    const paths = pathname?.split('/intranet').filter(Boolean) || [];
    let accumulatedPath = '';
    
    return paths.map((path, index) => {
      accumulatedPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      return {
        href: accumulatedPath,
        label: pathLabels[accumulatedPath] || formatPathName(path),
        isLast,
      };
    });
  };

  // Formatear nombres de ruta
  const formatPathName = (path: string) => {
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = generateBreadcrumbs();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <Fragment key={crumb.href}>
                    <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                      {!crumb.isLast ? (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {!crumb.isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;

