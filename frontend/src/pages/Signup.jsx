import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: Replace with actual API call
    // For now, simulate signup
    localStorage.setItem("token", "dummy-token");
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      {/* Mobile Warning */}
      <div className="lg:hidden fixed inset-0 bg-dark-950 flex items-center justify-center p-8 z-50">
        <div className="text-center">
          <img
            src="/finityLogo.png"
            alt="Finity"
            className="w-16 h-16 mx-auto mb-4"
          />
          <img
            src="/finityLogoText.png"
            alt="Finity"
            className="h-8 mx-auto mb-4"
          />
          <p className="text-gray-400 mb-4">
            Please view this application from a larger screen for the best
            experience.
          </p>
          <p className="text-sm text-gray-500">Minimum screen width: 1024px</p>
        </div>
      </div>

      {/* Desktop Signup */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/finityLogo.png" alt="Finity" className="w-16 h-16" />
              <img src="/finityLogoText.png" alt="Finity" className="h-10" />
            </div>
            <p className="text-gray-400">Start your financial journey</p>
          </div>

          {/* Signup Card */}
          <div className="card">
            <h2 className="text-2xl font-display font-semibold mb-6">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    required
                    className="input-field pl-11"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    required
                    className="input-field pl-11"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-500 hover:text-primary-400 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            By creating an account, you agree to Finity's Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
