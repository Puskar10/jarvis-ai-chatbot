import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }

      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#15151a] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {isLogin ? "Login to Jarvis" : "Create Jarvis Account"}
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Save your chats and AI memory securely
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f0f12] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0f0f12] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0f0f12] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          />

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl py-3 font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-sm text-gray-400 mt-5 hover:text-white"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}