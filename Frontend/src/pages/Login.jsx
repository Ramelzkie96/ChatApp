import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login
    if (username === "demo" && password === "1234") {
      // ✅ no toast here, just send state to Dashboard
      navigate("/dashboard", { state: { showSuccess: true } });
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-600">ChatApp</h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Simple. Fast. Secure. Start messaging instantly.
        </p>

        <h2 className="text-2xl font-bold text-center text-gray-800 mt-6">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mt-1">Please login to continue</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}  // ✅ navigate to /register
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
