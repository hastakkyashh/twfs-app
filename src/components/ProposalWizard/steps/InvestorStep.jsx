// STEP 2
// Investor Step

import React from "react";
import { User, ArrowRight, ArrowLeft } from "lucide-react";

const InvestorStep = ({ formData, updateFormData, onNext, onPrev }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.clientName.trim() && formData.advisorName.trim()) {
      onNext();
    }
  };

  // Reusable helper to handle mobile number logic
  const handleMobileChange = (field, value) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-digits
    if (numericValue.length <= 10) {
      updateFormData(field, numericValue);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "#ecf4e4" }}
          >
            <User className="w-8 h-8" style={{ color: "#73b030" }} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Client & Advisor Information
          </h2>
          <p className="text-gray-600">
            Let's start with some basic information about the investor and
            advisor.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CLIENT DETAILS SECTION */}
          <div className="mb-6">
            <h3
              className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2"
              style={{ borderColor: "#73b030" }}
            >
              Client Details
            </h3>
            <div className="space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => updateFormData("clientName", e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>

              {/* Client Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Age
                </label>
                <input
                  type="number"
                  value={formData.clientAge}
                  onChange={(e) => updateFormData("clientAge", e.target.value)}
                  placeholder="Enter age"
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>

              {/* Client Mobile - GUARDRAIL APPLIED */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Mobile No.
                </label>
                <input
                  type="tel"
                  value={formData.clientMobile}
                  maxLength={10}
                  onChange={(e) => handleMobileChange("clientMobile", e.target.value)}
                  placeholder="Enter 10 digit number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>

              {/* Client Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    updateFormData("clientEmail", e.target.value)
                  }
                  placeholder="client@gmail.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* ADVISOR DETAILS SECTION */}
          <div className="mb-8">
            <h3
              className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2"
              style={{ borderColor: "#73b030" }}
            >
              Advisor Details
            </h3>
            <div className="space-y-4">
              {/* Advisor Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Advisor Name *
                </label>
                <input
                  type="text"
                  value={formData.advisorName}
                  onChange={(e) =>
                    updateFormData("advisorName", e.target.value)
                  }
                  placeholder="Enter advisor name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>

              {/* Advisor Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Advisor Email
                </label>
                <input
                  type="email"
                  value={formData.advisorEmail}
                  onChange={(e) =>
                    updateFormData("advisorEmail", e.target.value)
                  }
                  placeholder="advisor@gmail.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>

              {/* Advisor Mobile - GUARDRAIL APPLIED */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Advisor Mobile No.
                </label>
                <input
                  type="tel"
                  value={formData.advisorMobile}
                  maxLength={10}
                  onChange={(e) => handleMobileChange("advisorMobile", e.target.value)}
                  placeholder="Enter 10 digit number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#73b030")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: "#73b030" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#337b1c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#73b030")
              }
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestorStep;