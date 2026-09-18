import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { auth } from "../firebase/firebase.config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-5">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <ShieldCheck
              size={32}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Source X
          </h1>

          <p className="text-slate-400 mt-2">
            Sourcing & Access Platform
          </p>

        </div>

        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl">

          <div className="mb-7">

            <h2 className="text-xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Sign in to your admin workspace.
            </p>

          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="text-sm font-medium text-slate-700">
                Email address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="admin@sourcex.com"
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            <div>

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative mt-2">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >

              {loading
                ? "Signing in..."
                : "Sign in"}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>

        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Internal administration system · Source X
        </p>

      </div>

    </main>
  );
}

export default Login;