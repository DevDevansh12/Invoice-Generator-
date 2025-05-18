import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight,
  UserPlus,
  FilePlus,
  MoreVertical,
} from "lucide-react";
import { cn } from "../utils/cn";
import Button from "./ui/Button";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleActionMenu = () => setIsActionMenuOpen(!isActionMenuOpen);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="p-2 m-2 text-gray-500 rounded-md lg:hidden focus:outline-none focus:ring focus:ring-blue-300"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">
            SHREE JALA TRAVELS
          </h1>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-md lg:hidden focus:outline-none focus:ring focus:ring-blue-300"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive && "bg-blue-50 text-blue-600"
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home size={20} className="mr-3" />
                <span>Dashboard</span>
                <ChevronRight size={16} className="ml-auto" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive && "bg-blue-50 text-blue-600"
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users size={20} className="mr-3" />
                <span>Customers</span>
                <ChevronRight size={16} className="ml-auto" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/invoices"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive && "bg-blue-50 text-blue-600"
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <FileText size={20} className="mr-3" />
                <span>Invoices</span>
                <ChevronRight size={16} className="ml-auto" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive && "bg-blue-50 text-blue-600"
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <Settings size={20} className="mr-3" />
                <span>Settings</span>
                <ChevronRight size={16} className="ml-auto" />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Action Bar */}
        {!isRootPath && (
          <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800 hidden sm:block">
              {location.pathname.includes("customers")
                ? "Customers"
                : location.pathname.includes("invoices")
                ? "Invoices"
                : location.pathname.includes("settings")
                ? "Settings"
                : ""}
            </h2>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => (window.location.href = "/customers/add")}
                icon={<UserPlus size={16} />}
              >
                Add Customer
              </Button>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/invoices/create")}
                icon={<FilePlus size={16} />}
              >
                Create Invoice
              </Button>
            </div>

            {/* Mobile Actions Menu */}
            <div className="relative sm:hidden">
              <button
                onClick={toggleActionMenu}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <MoreVertical size={20} />
              </button>

              {isActionMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsActionMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                    <button
                      onClick={() => {
                        window.location.href = "/customers/add";
                        setIsActionMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <UserPlus size={16} className="mr-2" />
                      Add Customer
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = "/invoices/create";
                        setIsActionMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FilePlus size={16} className="mr-2" />
                      Create Invoice
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
