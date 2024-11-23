import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Lock,
  Package,
  Tags,
  Settings,
  FileText,
  BarChart3,
  ShoppingCart,
  Bell,
  MessageSquare,
  Store,
  Boxes,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Menu,
  Search,
  LogOut,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: NavItem[];
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Análisis",
    href: "/analytics",
    icon: BarChart3,
    submenu: [
      { title: "Ventas", href: "/analytics/sales", icon: CreditCard },
      { title: "Tráfico", href: "/analytics/traffic", icon: Users },
    ],
  },
  {
    title: "Productos",
    href: "/productos",
    icon: Package,
    submenu: [
      { title: "Catálogo", href: "/productos/catalogo", icon: Store },
      { title: "Categorías", href: "/productos/categorias", icon: Tags },
      { title: "Inventario", href: "/productos/inventario", icon: Boxes },
    ],
  },
  {
    title: "Pedidos",
    href: "/pedidos",
    icon: ShoppingCart,
    badge: 3,
  },
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: Users,
    submenu: [
      { title: "Lista de Usuarios", href: "/usuarios/lista", icon: FileText },
      { title: "Agregar Usuario", href: "/usuarios/agregar", icon: Users },
    ],
  },
  {
    title: "Roles",
    href: "/roles",
    icon: ShieldCheck,
  },
  {
    title: "Permisos",
    href: "/permisos",
    icon: Lock,
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
    submenu: [
      { title: "General", href: "/configuracion/general", icon: Settings },
      {
        title: "Notificaciones",
        href: "/configuracion/notificaciones",
        icon: Bell,
      },
      {
        title: "Integraciones",
        href: "/configuracion/integraciones",
        icon: Package,
      },
    ],
  },
  {
    title: "Soporte",
    href: "/soporte",
    icon: HelpCircle,
    submenu: [
      { title: "Centro de Ayuda", href: "/soporte/ayuda", icon: HelpCircle },
      {
        title: "Mensajes",
        href: "/soporte/mensajes",
        icon: MessageSquare,
        badge: 2,
      },
    ],
  },
];

function NavItem({
  item,
  isNested = false,
  searchTerm = "",
}: {
  item: NavItem;
  isNested?: boolean;
  searchTerm?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive =
    location.pathname === item.href ||
    location.pathname.startsWith(item.href + "/");

  if (
    searchTerm &&
    !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !item.submenu?.some((subItem) =>
      subItem.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) {
    return null;
  }

  return (
    <div className="relative">
      <Link
        to={item.href}
        onClick={(e) => {
          if (item.submenu) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive
            ? "bg-gray-100 text-primary dark:bg-gray-800"
            : "text-gray-500 dark:text-gray-400",
          isNested && "ml-7"
        )}
      >
        {item.icon && (
          <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
        )}
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {item.badge}
          </span>
        )}
        {item.submenu && (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        )}
      </Link>
      {item.submenu && (isOpen || searchTerm) && (
        <div className="mt-1 space-y-1">
          {item.submenu.map((subItem) => (
            <NavItem
              key={subItem.href}
              item={subItem}
              isNested
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input
        placeholder="Buscar..."
        className="pl-8 bg-gray-50 dark:bg-gray-800 border-0"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="@usuario" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Usuario</p>
            <p className="text-xs leading-none text-muted-foreground">
              usuario@ejemplo.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notificaciones</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        window.innerWidth < 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape" && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const foundItem = navItems.find(
        (item) =>
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.submenu?.some((subItem) =>
            subItem.title.toLowerCase().includes(term.toLowerCase())
          )
      );
      if (foundItem) {
        navigate(foundItem.href);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-lg">AdminPanel</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar menú</span>
          </Button>
        </div>

        <div className="p-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} searchTerm={searchTerm} />
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <UserMenu />
            <div>
              <p className="text-sm font-medium">Usuario Demo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrador
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 dark:bg-gray-900">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="ml-auto flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
