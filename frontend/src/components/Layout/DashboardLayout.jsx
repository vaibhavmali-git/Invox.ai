import React, { useState, useEffect } from "react";
import { Briefcase, LogOut, Menu, X, Search } from "lucide-react"; // Imported Search
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { NAVIGATION_MENU } from "../../utils/data";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm mt-2 rounded-lg transition-all duration-200 group
    ${
      isActive
        ? "border border-red-200 text-gray-900 shadow-sm shadow-red-100"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-gray-900" : "text-gray-500"
        }`}
      />
      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  );
};

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* hide responsive behavior */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1122;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* close dropdowns when clicking outside */
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarSearch = (e) => {
    const term = e.target.value;
    navigate(`/invoices?search=${term}`);
    setActiveNavItem("invoices");
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50 p-4 pb-0">
      {/* SIDEBAR  */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform
    ${
      isMobile
        ? sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
        : "translate-x-0"
    } ${sidebarCollapsed ? "w-16" : "w-68"}`}
      >
        <div className="h-full py-4 px-4">
          <div className="h-full bg-white rounded-lg shadow-md shadow-gray-100 border border-gray-200 flex flex-col">
            {/* logo */}
            <div className="flex items-center h-16 px-6 pt-2 border-b border-gray-200">
              <Link className="flex items-center space-x-3" to="/dashboard">
                {!sidebarCollapsed && (
                  <span className="text-gray-900 text-xl font-medium">
                    InvoAIce.
                  </span>
                )}
              </Link>
            </div>

            {/* navigation */}
            <nav className="p-4 space-y-2 flex-1">
              {!sidebarCollapsed && (
                <div className="mb-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all"
                    onChange={handleSidebarSearch}
                    onClick={() => {
                      navigate("/invoices");
                      setActiveNavItem("invoices");
                    }}
                  />
                </div>
              )}

              <span className="uppercase pl-3 text-xs text-gray-500">menu</span>
              {NAVIGATION_MENU.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isActive={activeNavItem === item.id}
                  onClick={handleNavigation}
                  isCollapsed={sidebarCollapsed}
                />
              ))}
            </nav>

            {/* logout */}
            <div className="p-4 pb-6">
              <button
                className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-red-700  transition-all duration-200 border border-gray-200 hover:bg-red-50 hover:border-red-200 text-sm"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 shrink-0 text-red-700" />
                {!sidebarCollapsed && <span className="ml-3">Signout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile overlay  */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-25 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* MAIN CONTENT  */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* top navbar  */}
        <header className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg h-16 flex items-center justify-between px-5 sticky top-0 z-30 shadow-md shadow-gray-100">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}

            <div>
              <h1 className="text-sm text-gray-900">
                Welcome back, {user.name} 👋🏻
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* profile dropdown  */}
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>

        {/* Main content area  */}
        <main className="flex-1 overflow-auto p-3 pt-5">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
