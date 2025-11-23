import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User,
  Loader,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/helper";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldsErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  /* validate functions */
  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /* realtime validation */
    if (touched[name]) {
      const newFieldErrors = { ...fieldErrors };
      if (name === "name") {
        newFieldErrors.name = validateName(value);
      }
      if (name === "password") {
        newFieldErrors.password = validatePassword(value);

        /* also revalidate confirm password if its been touched */
        if (touched.confirmPassword) {
          newFieldErrors.confirmPassword = validateConfirmPassword(
            value,
            formData.password
          );
        }
      } else if (name === "confirmPassword") {
        newFieldErrors.confirmPassword = validateConfirmPassword(
          value,
          formData.password
        );
      }
      setFieldsErrors(newFieldErrors);
    }
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    /* validate on blur */
    const newFieldErrors = { ...fieldErrors };

    if (name === "name") {
      newFieldErrors.name = validateName(formData.name);
    } else if (name === "email") {
      newFieldErrors.email = validateEmail(formData.email);
    } else if (name === "password") {
      newFieldErrors.password = validatePassword(formData.password);
    } else if (name === "confirmPassword") {
      newFieldErrors.confirmPassword = validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      );
    }

    setFieldsErrors(newFieldErrors);
  };

  const isFormValid = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  const handleSubmit = async () => {
    /* Validate all fields before submission */
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setFieldsErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });

      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });

      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;
      const { token } = data;

      if (response.status === 201) {
        setSuccess("Account created successfully");

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });

        /* Login the user immediately after successful registration */
        login(data, token);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        {/* HEADER  */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600 text-sm">Join invoice generator today</p>
        </div>

        {/* FORM  */}
        <div className="space-y-4">
          {/* name  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all 
              ${
                fieldErrors.name && touched.name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
                placeholder="Enter your full name"
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* email  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all 
              ${
                fieldErrors.email && touched.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
                placeholder="Enter your email"
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* password  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all 
              ${
                fieldErrors.password && touched.password
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
                placeholder="Create a password"
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {fieldErrors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* confirm password  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all 
              ${
                fieldErrors.confirmPassword && touched.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
                placeholder="Confirm your password"
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
                onClick={() => setConfirmShowPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* error/success messages  */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* terms & conditions  */}
          <div className="flex items-start pt-2">
            <input
              type="checkBox"
              id="terms"
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-1"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <button className="text-black hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-black hover:underline">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* signup button  */}
          <button
            className="group w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* FOOTER  */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-black font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign in{" "}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
