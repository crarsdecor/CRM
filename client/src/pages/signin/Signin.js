import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useAuth } from "../../context/authContext";
import { motion } from "framer-motion";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Signin = () => {
  const { setUser } = useAuth();
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Login, 2: OTP Verification
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log(role);
    if (role === "admin") {
      navigate("/dashboard-admin");
    } else if (role === "manager") {
      navigate("/dashboard-manager");
    } else if (role === "user") {
      navigate("/dashboard-user");
    } else if (role === "accountant") {
      navigate("/dashboard-accountant");
    }
  }, []);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // Reset error on input change
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
    if (value.length <= 6) setOtp(value); // Limit to 6 digits
    setError("");
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/signin`, {
        uid,
        password,
      });

      // // Save user info in local storage
      localStorage.setItem("uid", data.uid);
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("role", data.role);

      setStep(2); // Move to OTP verification step
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Sign-in failed");
      message.error(err.response?.data?.message);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const uidStored = localStorage.getItem("uid");
      if (!uidStored) {
        setError("User ID not found. Please sign in again.");
        return;
      }

      const { data } = await axios.post(`${apiUrl}/api/auth/verify-otp`, {
        uid: uidStored,
        otp,
      });

      // Decode JWT and save user details
      const decoded = jwtDecode(data.token);
      setUser({ id: decoded.id, role: decoded.role });

      // Update token in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      message.success(data.message);

      // Redirect based on role
      switch (decoded.role) {
        case "admin":
          navigate("/dashboard-admin");
          break;
        case "manager":
          navigate("/dashboard-manager");
          break;
        case "accountant":
          navigate("/dashboard-accountant");
          break;
        case "user":
          navigate("/dashboard-user");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      message.error(err.response?.data?.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      <motion.form
        onSubmit={step === 1 ? handleSignin : handleOtpVerify}
        className="z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1 ? "Sign In" : "Enter OTP"}
        </h2>

        {error && (
          <motion.p className="mt-4 text-sm text-center text-red-500">
            {error}
          </motion.p>
        )}

        {step === 1 ? (
          <>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                UID
              </label>
              <input
                type="text"
                value={uid}
                onChange={handleInputChange(setUid)}
                placeholder="Enter your UID"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div className="mt-4 relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-4 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>
        )}

        <motion.button
          type="submit"
          className="mt-6 w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          {step === 1 ? "Sign In" : "Verify OTP"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Signin;
