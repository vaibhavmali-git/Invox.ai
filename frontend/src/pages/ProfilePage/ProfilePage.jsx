import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, User, Mail, Building, Phone, MapPin } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import InputField from "../../components/Ui/InputField";
import TextareaField from "../../components/Ui/TextareaField";

const ProfilePage = () => {
  const { user, loading, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );
      updateUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto ">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1 text-light">
            Manage your account information and business details
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
          <div className="py-4 px-4 sm:py-7 sm:px-8 space-y-6 sm:space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full h-11 pl-3 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                  disabled
                />
              </div>
            </div>

            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />

            <div className="pt-6 sm:pt-7 border-t border-gray-100">
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl text-gray-900">
                  Business Information
                </h4>
                <p className="text-sm text-gray-500 mt-1.5 text-light">
                  This will be to prefill the "Bill From" section of your
                  invoices.
                </p>
              </div>
              <div className="space-y-5 sm:space-y-6">
                <InputField
                  label="Business Name"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your Company LLC"
                />
                <TextareaField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, Anytown, India"
                />
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 h-11 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto"
            >
              {isUpdating ? (
                <Loader2 className="w-[18px] h-[18px] mr-2 animate-spin" />
              ) : null}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
