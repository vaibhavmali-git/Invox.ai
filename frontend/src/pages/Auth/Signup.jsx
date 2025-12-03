import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/helper";
import signupImg from "../../assets/heroimg-signup.jpg"

const Signup = () => {
  /* ============ HOOKS ============ */
  const { login } = useAuth();
  const navigate = useNavigate();

  /* ============ STATE MANAGEMENT ============ */
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

  /* ============ VALIDATION HELPERS ============ */
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

  /* ============ HANDLERS ============ */
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
      if (name === "email") {
        newFieldErrors.email = validateEmail(value);
      }
      if (name === "password") {
        newFieldErrors.password = validatePassword(value);
        if (touched.confirmPassword) {
          newFieldErrors.confirmPassword = validateConfirmPassword(
            formData.confirmPassword,
            value
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

        /* Login the user immediately */
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT SIDE - IMAGE */}
      <div className="hidden bg-white lg:flex w-1/2 h-screen p-10 items-center justify-center overflow-hidden">
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-gray-200 shadow-lg shadow-gray-100">
          <img
            src={signupImg}
            alt="Invox.ai Dashboard"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 border-l border-gray-200">
        <div className="w-full max-w-xs mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-medium text-gray-900 mb-3">Sign up</h1>
            <p className="text-gray-600">
              Create your account to start managing your invoices.
            </p>
          </div>

          <div className="space-y-5 border border-gray-200 p-6 rounded-lg bg-white shadow-lg shadow-gray-100">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm
                  ${
                    fieldErrors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }
                `}
                placeholder="Enter your full name"
              />
              {fieldErrors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm
                  ${
                    fieldErrors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }
                `}
                placeholder="Enter your email"
              />
              {fieldErrors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm
                    ${
                      fieldErrors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }
                  `}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm
                    ${
                      fieldErrors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }
                  `}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Sign up Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-90 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-amber-700 hover:text-red-700 underline-offset-2 hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;