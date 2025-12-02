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

  const handleUpdateProfile = async (e) => {};

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <h3 className="">My Profile</h3>
      </div>

      <form onSubmit={handleUpdateProfile}>
        <div className="">
          <div>
            <label className="">Email Address</label>
            <div className="">
              <div className="">
                <Mail className="" />
              </div>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className=""
                disabled
              />
            </div>
          </div>

          <InputField
            label="Full Name"
            name="name"
            icon={User}
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />

          <div className="">
            <h4 className="">Business Information</h4>
            <p className="">
              This will be to prefill the "Bill From" section of your invoices.
            </p>
            <div className="">
              <InputField
                label="Business Name"
                name="businessName"
                icon={Building}
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your Company LLC"
              />
              <TextareaField
                label="Address"
                name="address"
                icon={MapPin}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St, Anytown, India"
              />
              <InputField
                label="Phone"
                name="phone"
                icon={Phone}
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        <div className="">
          <button type="submit" disabled={isUpdating} className="">
            {isUpdating ? <Loader2 className="" /> : null}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
