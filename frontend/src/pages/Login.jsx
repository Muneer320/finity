import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Replace with actual API call
    // For now, simulate login
    localStorage.setItem("token", "dummy-token");
    setIsAuthenticated(true);

    // Check if questionnaire is completed
    const questionnaireCompleted = localStorage.getItem(
      "questionnaireCompleted"
    );
    if (!questionnaireCompleted) {
      navigate("/questionnaire");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      {/* Mobile Warning */}
      <div className="lg:hidden fixed inset-0 bg-dark-950 flex items-center justify-center p-8 z-50">
        <div className="text-center">
          <img
            src="/finityLogo.png"
            alt="Finity"
            className="w-32 h-32 mx-auto mb-4"
          />
          <p className="text-gray-400 mb-4">
            Please view this application from a larger screen for the best
            experience.
          </p>
          <p className="text-sm text-gray-500">Minimum screen width: 1024px</p>
        </div>
      </div>

      {/* Desktop Login */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/finityLogoText.png"
              alt="Finity"
              className="h-20 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400">Learn. Trade. Grow.</p>
          </div>

          {/* Login Card */}
          <div className="card">
            <h2 className="text-2xl font-display font-semibold mb-6">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    required
                    className="input-field pl-11"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    required
                    className="input-field pl-11"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary-500 hover:text-primary-400 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            By continuing, you agree to Finity's Terms of Service and Privacy
            Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
