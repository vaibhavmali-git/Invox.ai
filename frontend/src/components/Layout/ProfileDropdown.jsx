import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout }
) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        {avatar ? (
          <img src={avatar} alt="Avatar" className="h-9 w-9 rounded-lg object-cover" />
        ) : (
          <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-md shadow-gray-100">
            <span className="text-gray-900 text-md">{companyName.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-gray-900 text-sm font-medium">{companyName}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl shadow-gray-200 z-50 border  border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate("/profile")}>
            View Profile
          </a>

          <div className="border-t border-gray-100 ">
            <a href="#" onClick={onLogout} className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer">
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
