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
  const validateName = (name) => {};

  const validateConfirmPassword = (confirmPassword, password) => {};

  const handleInputChange = (e) => {};

  const handleBlur = (e) => {};

  const isFormValid = () => {};

  const handleSubmit = async () => {};

  return (
    <div className="">
      <div className="">
        {/* HEADER  */}
        <div className="">
          <div className="">
            <FileText className="" />
          </div>
          <h1 className="">Create account</h1>
          <p className="">Join invoice generator today</p>
        </div>

        {/* FORM  */}
        <div className="">
          {/* name  */}
          <div>
            <label className="">Full Name</label>
            <div className="">
              <User className="" />
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
              <p className="">{fieldErrors.name}</p>
            )}
          </div>

          {/* email  */}
          <div>
            <label className="">Email</label>
            <div className="">
              <Mail className="" />
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
              <p className="">{fieldErrors.email}</p>
            )}
          </div>

          {/* password  */}
          <div>
            <label className="">Password</label>
            <div className="">
              <Lock className="" />
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
                className=""
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="" /> : <Eye className="" />}
              </button>
            </div>

            {fieldErrors.password && touched.password && (
              <p className="">{fieldErrors.password}</p>
            )}
          </div>

          {/* confirm password  */}
          <div>
            <label className="">Confirm password</label>
            <div className="">
              <Lock className="" />
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
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
                className=""
                type="button"
                onClick={() => setConfirmShowPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="" />
                ) : (
                  <Eye className="" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* error/success messages  */}
          {error && (
            <div className="">
              <p className="">{error}</p>
            </div>
          )}
          {success && (
            <div className="">
              <p className="">{success}</p>
            </div>
          )}

          {/* terms & conditions  */}
          <div className="">
            <input type="checkBox" id="terms" className="" required />
            <label htmlFor="terms" className="">
              I agree to the <button className="">Terms of Service</button> and{" "}
              <button className="">Privacy Policy</button>
            </label>
          </div>

          {/* signup button  */}
          <button
            className=""
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="" />
              </>
            )}
          </button>
        </div>

        {/* FOOTER  */}
        <div className="">
          <p className="">
            Already have an account?{" "}
            <button className="" onClick={() => navigate("/login")}>
              Sign in{" "}
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Signup;
