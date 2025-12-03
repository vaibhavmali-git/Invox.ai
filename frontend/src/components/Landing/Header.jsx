import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "../Layout/ProfileDropdown";
import Button from "../Ui/Button";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto border-x border-gray-200 bg-white/50 h-20 px-6 sm:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              InvoAIce.
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {isAuthenticated ? (
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
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 font-medium text-sm hover:text-gray-700 transition-colors px-5 py-2.5 rounded-lg border border-gray-200"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto border-x border-gray-200 px-6 py-4 space-y-4">
            <div className="border-t border-gray-100 pt-4">
              {isAuthenticated ? (
                <Button
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to dashboard
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="text-center py-2 text-gray-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center bg-gray-900 text-white py-3 rounded-lg font-medium"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
