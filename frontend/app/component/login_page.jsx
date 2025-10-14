import axios from "axios";
import { useState, useEffect } from "react";
import feather from "feather-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../root_context";

export default function Login() {
  const { setState, setTokenC } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.get("path");
  const idRequired = queryParams.get("idRequired");
  const navigate = useNavigate();

  useEffect(() => {
    feather.replace();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.userId);
      setTokenC(data.token);
      console.log("token Login", data.token);
      console.log("Login successful!", data.token);
      setState();
      if (path) {
        navigate(`/map`);
      } else if (path && !idRequired) {
        navigate(`/map`);
      } else {
        navigate("/map");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message || "Invalid username or password");
      } else if (err.request) {
        setError("No response from server. Try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Please login to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <a
                href="/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
