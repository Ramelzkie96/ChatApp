import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7085/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password, // plain password (backend hashes internally)
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // ✅ Save token + user info
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login successful!");

        // ✅ Redirect after login
        navigate("/dashboard", { state: { showSuccess: true } });
      } else {
        const error = await response.json();
        toast.error(error.message || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    // If already logged in → redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

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
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
