import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/helper";

const Login = () => {
  /* ============ HOOKS ============ */
  const { login } = useAuth();
  const navigate = useNavigate();

  /* ============ STATE MANAGEMENT ============ */
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    /* realtime validation */
    if (touched[name]) {
      const newFieldErrors = { ...fieldErrors };
      if (name === "email") newFieldErrors.email = validateEmail(value);
      if (name === "password")
        newFieldErrors.password = validatePassword(value);
      setFieldErrors(newFieldErrors);
    }
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    /* validate on blur */
    const newFieldErrors = { ...fieldErrors };
    if (name === "email") newFieldErrors.email = validateEmail(formData.email);
    if (name === "password")
      newFieldErrors.password = validatePassword(formData.password);
    setFieldErrors(newFieldErrors);
  };

  const isFormValid = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    return !emailError && !passwordError && formData.email && formData.password;
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setFieldErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          setSuccess("Login Successful");
          login(response.data, token);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        }
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex ">
      {/*  LOGIN FORM*/}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 border-l">
        <div className="w-full max-w-xs mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-medium text-gray-900 mb-3">Log in</h1>
            <p className="text-gray-600">
              Welcome back! Enter your credentials to access your dashboard.
            </p>
          </div>

          <div className="space-y-5 border border-gray-200 p-6 rounded-lg bg-white shadow-lg shadow-gray-100">
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
                  placeholder="Enter your password"
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

            {/* Sign in Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-90 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold text-amber-700 hover:text-red-700 underline-offset-2 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden bg-white lg:flex w-1/2 h-screen p-10 items-center justify-center overflow-hidden border-l border-gray-200">
        <div className="w-full h-full rounded-xl overflow-hidden relative border border-gray-200 shadow-lg shadow-gray-100">
          <img
            src="/src/assets/heroimg-login.jpg"
            alt="Invox.ai Dashboard"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
