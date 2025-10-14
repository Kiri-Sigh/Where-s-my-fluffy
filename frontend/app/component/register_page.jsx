import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../root_context";

const Register = () => {
  const [name, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone_no, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password_user, setPassword] = useState("");
  const { setTokenC } = useAppContext();
  const API_URL = "http://localhost:3000";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.get("path");
  const idRequired = queryParams.get("idRequired");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login/register`, {
        name,
        email,
        phone_no,
        username,
        password_user,
      });

      const data = response.data;
      const response2 = await axios.post(`${API_URL}/login`, {
        username,
        password: password_user,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.userId);
      setTokenC(data.token);
      if (path && idRequired) {
        navigate(`/map`);
      } else if (path && !idRequired) {
        navigate(`/map`);
      } else {
        navigate("/map");
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="form-container bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our community</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={name}
              onChange={(e) => setFullname(e.target.value)}
              className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 text-gray-600 focus:ring-indigo-200 transition-all"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 text-gray-600 focus:ring-indigo-200 transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone_no}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 text-gray-600 focus:ring-indigo-200 transition-all"
              placeholder="+1 (123) 456-7890"
              required
            />
          </div>

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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 text-gray-600 focus:ring-indigo-200 transition-all"
              placeholder="Choose a username"
              required
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
              value={password_user}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 text-gray-600 focus:ring-indigo-200 transition-all"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200 mt-6"
          >
            Register
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
