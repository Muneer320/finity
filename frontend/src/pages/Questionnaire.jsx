import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { userAPI } from "../utils/api";

function Questionnaire({ setHasCompletedQuestionnaire }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
    income: "",
    monthlyExpenses: "",
    savings: "",
    investments: "",
    loans: "",
    loanAmount: "",
    financialGoals: [],
    riskTolerance: "",
    experience: "",
    financialConfidence: 5, // Default value 1-10
    fixedBudget: "", // Will be calculated or set
  });

  const totalSteps = 4;

  const handleNext = () => {
    // Clear previous errors
    setError("");

    // Validation for each step
    if (step === 1) {
      if (!formData.age || !formData.occupation || !formData.income) {
        setError("Please fill in all required fields in Step 1");
        return;
      }
      if (formData.age < 18 || formData.age > 100) {
        setError("Please enter a valid age (18-100)");
        return;
      }
    }

    if (step === 2) {
      if (!formData.monthlyExpenses || !formData.savings || !formData.loans) {
        setError("Please fill in all required fields in Step 2");
        return;
      }
      if (formData.loans === "yes" && !formData.loanAmount) {
        setError("Please enter your total loan amount");
        return;
      }
    }

    if (step === 3) {
      if (
        !formData.investments ||
        !formData.experience ||
        !formData.riskTolerance
      ) {
        setError("Please fill in all required fields in Step 3");
        return;
      }
    }

    if (step === 4) {
      if (formData.financialGoals.length === 0) {
        setError("Please select at least one financial goal");
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError(""); // Clear errors when going back
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Prepare data for backend API
      const onboardingData = {
        age: parseInt(formData.age),
        occupation: formData.occupation,
        monthly_income: parseFloat(formData.income),
        monthly_expenses: parseFloat(formData.monthlyExpenses),
        current_savings: parseFloat(formData.savings),
        loan_amount:
          formData.loans === "yes" ? parseFloat(formData.loanAmount) : 0,
        current_investment: parseFloat(formData.investments),
        experience_level: formData.experience,
        risk_tolerance: formData.riskTolerance,
        financial_confidence: formData.financialConfidence,
        fixed_budget:
          parseFloat(formData.income) - parseFloat(formData.monthlyExpenses), // Calculate fixed budget
        goals_data: formData.financialGoals, // Send as simple array of strings
      };

      console.log('Submitting onboarding data:', onboardingData);

      // Submit to backend
      const response = await userAPI.onboard(onboardingData);

      // Store locally for offline access
      localStorage.setItem("questionnaireCompleted", "true");
      localStorage.setItem("userProfile", JSON.stringify(response));

      setHasCompletedQuestionnaire(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError(err.message || "Failed to save your profile. Please try again.");
      setLoading(false);
    }
  };

  const toggleGoal = (goal) => {
    if (formData.financialGoals.includes(goal)) {
      setFormData({
        ...formData,
        financialGoals: formData.financialGoals.filter((g) => g !== goal),
      });
    } else {
      setFormData({
        ...formData,
        financialGoals: [...formData.financialGoals, goal],
      });
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

      {/* Desktop Questionnaire */}
      <div className="hidden lg:block p-4">
        <div className="max-w-3xl mx-auto py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-display font-bold">
                Let's Get to Know You
              </h1>
              <span className="text-gray-400">
                Step {step} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="card">
            {/* Error Message Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-500 font-medium">Validation Error</p>
                  <p className="text-red-400 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-semibold">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="100"
                    className="input-field"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                  >
                    <option value="">Select your occupation</option>
                    <option value="student">Student</option>
                    <option value="employed">Employed (Full-time)</option>
                    <option value="part-time">Employed (Part-time)</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="business">Business Owner</option>
                    <option value="unemployed">Currently Unemployed</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Monthly Income (₹) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.income}
                    onChange={(e) =>
                      setFormData({ ...formData, income: e.target.value })
                    }
                  >
                    <option value="">Select income range</option>
                    <option value="0-25000">₹0 - ₹25,000</option>
                    <option value="25000-50000">₹25,000 - ₹50,000</option>
                    <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                    <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                    <option value="200000+">₹2,00,000+</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-semibold">
                  Financial Situation
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Average Monthly Expenses (₹){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="input-field"
                    placeholder="30000"
                    value={formData.monthlyExpenses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyExpenses: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Savings (₹) <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.savings}
                    onChange={(e) =>
                      setFormData({ ...formData, savings: e.target.value })
                    }
                  >
                    <option value="">Select savings range</option>
                    <option value="0-50000">₹0 - ₹50,000</option>
                    <option value="50000-200000">₹50,000 - ₹2,00,000</option>
                    <option value="200000-500000">₹2,00,000 - ₹5,00,000</option>
                    <option value="500000-1000000">
                      ₹5,00,000 - ₹10,00,000
                    </option>
                    <option value="1000000+">₹10,00,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Do you have any active loans?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        formData.loans === "yes"
                          ? "border-primary-600 bg-primary-600/10 text-primary-500"
                          : "border-dark-700 text-gray-400 hover:border-dark-600"
                      }`}
                      onClick={() => setFormData({ ...formData, loans: "yes" })}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        formData.loans === "no"
                          ? "border-primary-600 bg-primary-600/10 text-primary-500"
                          : "border-dark-700 text-gray-400 hover:border-dark-600"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          loans: "no",
                          loanAmount: "",
                        })
                      }
                    >
                      No
                    </button>
                  </div>
                </div>

                {formData.loans === "yes" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Loan Amount (₹){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="input-field"
                      placeholder="500000"
                      value={formData.loanAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, loanAmount: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-semibold">
                  Investment Experience
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Investments <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.investments}
                    onChange={(e) =>
                      setFormData({ ...formData, investments: e.target.value })
                    }
                  >
                    <option value="">Select your investment status</option>
                    <option value="none">No investments yet</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="stocks">Stocks</option>
                    <option value="mixed">Stocks & Mutual Funds</option>
                    <option value="advanced">
                      Stocks, Mutual Funds & Others
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Investment Experience Level{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        value: "beginner",
                        label: "Beginner",
                        desc: "New to investing",
                      },
                      {
                        value: "intermediate",
                        label: "Intermediate",
                        desc: "Some experience",
                      },
                      {
                        value: "advanced",
                        label: "Advanced",
                        desc: "Experienced investor",
                      },
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.experience === level.value
                            ? "border-primary-600 bg-primary-600/10"
                            : "border-dark-700 hover:border-dark-600"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, experience: level.value })
                        }
                      >
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-400">
                          {level.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Tolerance <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        value: "low",
                        label: "Conservative",
                        desc: "Prefer safe, low-risk investments",
                      },
                      {
                        value: "medium",
                        label: "Moderate",
                        desc: "Balanced risk and return",
                      },
                      {
                        value: "high",
                        label: "Aggressive",
                        desc: "Higher risk for higher returns",
                      },
                    ].map((risk) => (
                      <button
                        key={risk.value}
                        type="button"
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.riskTolerance === risk.value
                            ? "border-primary-600 bg-primary-600/10"
                            : "border-dark-700 hover:border-dark-600"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            riskTolerance: risk.value,
                          })
                        }
                      >
                        <div className="font-medium">{risk.label}</div>
                        <div className="text-sm text-gray-400">{risk.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-semibold">
                  Financial Goals & Confidence
                </h2>

                <div>
                  <p className="text-gray-400 mb-3">
                    Select all that apply{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-xs ml-2">
                      (At least one required)
                    </span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Build Emergency Fund",
                      "Save for Retirement",
                      "Buy a Home",
                      "Pay Off Debt",
                      "Start Investing",
                      "Grow Wealth",
                      "Financial Independence",
                      "Education Fund",
                    ].map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.financialGoals.includes(goal)
                            ? "border-primary-600 bg-primary-600/10"
                            : "border-dark-700 hover:border-dark-600"
                        }`}
                        onClick={() => toggleGoal(goal)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{goal}</span>
                          {formData.financialGoals.includes(goal) && (
                            <CheckCircle className="w-5 h-5 text-primary-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Financial Confidence Level
                    <span className="text-xs text-gray-400 ml-2">
                      (1-10, where 10 is most confident)
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    value={formData.financialConfidence}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financialConfidence: parseInt(e.target.value),
                      })
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Not Confident</span>
                    <span className="text-primary-500 font-medium text-base">
                      {formData.financialConfidence}
                    </span>
                    <span>Very Confident</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-dark-800">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className={`btn-secondary flex items-center gap-2 ${
                  step === 1 ? "invisible" : ""
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className={`btn-primary flex items-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {step === totalSteps ? "Complete" : "Next"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
