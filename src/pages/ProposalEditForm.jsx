import React, { useEffect, useState } from "react";
import {
  calculateFutureValue,
  calculateTotalInvestment,
  formatCurrency,
  calculateReturnFromAllocation,
  calculateRiskProfile,
  calculateProbNegative3Y,
  calculateCAGR,
  generateYearMilestones,
} from "../components/ProposalWizard/utils/calculations";
import FundSearchBar from "../components/FundSearch/FundSearchBar";
import { Trash2, Plus, Download } from "lucide-react";
import { FounderCard } from "../components/ui";
import { BRAND } from "../constants/brand";

const ProposalEditForm = () => {
  const [formData, setFormData] = useState(null);
  const [portfolioFunds, setPortfolioFunds] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [editableStrategy, setEditableStrategy] = useState(null);
  const [editableProjections, setEditableProjections] = useState(null);

  // Set document title for print job name
  useEffect(() => {
    document.title = "TrueWise FinSure";
  }, []);

  // Helper to get dd/mm/yyyy
  const getFormattedPrintDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const [proposalId] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `TWFS-${year}${month}-${random}`;
  });

  const [proposalDate] = useState(() => {
    const date = new Date();
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem("proposalFormData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFormData(data);

        if (data.selectedStrategyDetails) {
          setEditableStrategy(data.selectedStrategyDetails);
        }

        if (data.selectedProjectionData) {
          setEditableProjections(data.selectedProjectionData.projections);
        }

        setPortfolioFunds([]);
      } catch (error) {
        console.error("Error parsing form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (formData && portfolioFunds.length > 0) {
      calculatePortfolioProjections();
    }
  }, [
    portfolioFunds,
    formData?.lumpsum,
    formData?.monthlySIP,
    formData?.stepUpPercentage,
    formData?.horizon,
  ]);

  const getRiskAppetite = (horizon) => {
    if (horizon >= 15) return "Very Aggressive";
    if (horizon >= 10) return "Aggressive";
    if (horizon >= 7) return "Moderately Aggressive";
    if (horizon >= 5) return "Moderate";
    return "Conservative";
  };

  const getHistoricalRateForYear = (fund, targetYear) => {
    if (targetYear <= 3) {
      return fund.metrics.return3Y || fund.metrics.returnSinceInception || 0;
    } else if (targetYear > 3 && targetYear <= 5) {
      return fund.metrics.return5Y || fund.metrics.returnSinceInception || 0;
    } else if (targetYear > 5 && targetYear <= 10) {
      return fund.metrics.return10Y || fund.metrics.returnSinceInception || 0;
    } else if (targetYear > 10 && targetYear <= 15) {
      return fund.metrics.return15Y || fund.metrics.returnSinceInception || 0;
    } else if (targetYear > 15 && targetYear <= 20) {
      return fund.metrics.return20Y || fund.metrics.returnSinceInception || 0;
    } else if (targetYear > 20 && targetYear <= 25) {
      return fund.metrics.return25Y || fund.metrics.returnSinceInception || 0;
    } else {
      return fund.metrics.returnSinceInception || 0;
    }
  };

  const calculatePortfolioProjections = () => {
    if (!formData || portfolioFunds.length === 0) {
      return;
    }

    const yearMilestones = generateYearMilestones(formData.horizon || 20);
    const newProjections = yearMilestones.map((year) => {
      let currentYearValue = 0;

      portfolioFunds.forEach((fund) => {
        const rate = getHistoricalRateForYear(fund, year);
        const fundAllocation = fund.allocationPercentage / 100;
        const fundLumpsum = formData.lumpsum * fundAllocation;
        const fundSIP = formData.monthlySIP * fundAllocation;

        const fundFV = calculateFutureValue(
          fundLumpsum,
          fundSIP,
          formData.stepUpPercentage,
          year,
          rate,
        );

        currentYearValue += fundFV;
      });

      const totalInvestment = calculateTotalInvestment(
        formData.lumpsum,
        formData.monthlySIP,
        formData.stepUpPercentage,
        year,
      );

      return {
        year,
        probableAmount: currentYearValue,
        totalInvestment,
      };
    });

    setEditableProjections(newProjections);
  };

  const recalculateProjections = (equity, debt, returnRate) => {
    if (portfolioFunds.length > 0) {
      calculatePortfolioProjections();
    } else {
      const yearMilestones = generateYearMilestones(formData.horizon || 20);
      const newProjections = yearMilestones.map((year) => {
        const probableAmount = calculateFutureValue(
          formData.lumpsum,
          formData.monthlySIP,
          formData.stepUpPercentage,
          year,
          returnRate,
        );

        const totalInvestment = calculateTotalInvestment(
          formData.lumpsum,
          formData.monthlySIP,
          formData.stepUpPercentage,
          year,
        );

        return {
          year,
          probableAmount,
          totalInvestment,
        };
      });

      setEditableProjections(newProjections);
    }
  };

  const handleEquityChange = (value) => {
    const equity = Math.min(100, Math.max(0, parseInt(value) || 0));
    const debt = 100 - equity;
    const newReturn = calculateReturnFromAllocation(equity, debt);
    const newRiskProfile = calculateRiskProfile(equity);
    const newProbNegative3Y = calculateProbNegative3Y(equity);

    setEditableStrategy({
      ...editableStrategy,
      equity,
      debt,
      return: newReturn,
      riskProfile: newRiskProfile,
      probNegative3Y: newProbNegative3Y,
    });

    recalculateProjections(equity, debt, newReturn);
  };

  const handleDebtChange = (value) => {
    const debt = Math.min(100, Math.max(0, parseInt(value) || 0));
    const equity = 100 - debt;
    const newReturn = calculateReturnFromAllocation(equity, debt);
    const newRiskProfile = calculateRiskProfile(equity);
    const newProbNegative3Y = calculateProbNegative3Y(equity);

    setEditableStrategy({
      ...editableStrategy,
      equity,
      debt,
      return: newReturn,
      riskProfile: newRiskProfile,
      probNegative3Y: newProbNegative3Y,
    });

    recalculateProjections(equity, debt, newReturn);
  };

  const handleAddFund = (fundData) => {
    const newFund = {
      id: fundData.symbol || `fund-${Date.now()}`,
      fundName: fundData.schemeName || fundData.name || "",
      category: fundData.schemeCategory || fundData.category || "",
      allocationPercentage: 0,
      amount: 0,
      nav: fundData.nav || 0,
      navDate: fundData.navDate || "",
      metrics: {
        aum: parseFloat(fundData.aum) || 0,
        return3M:
          fundData.return3M !== null ? parseFloat(fundData.return3M) : 0,
        return6M:
          fundData.return6M !== null ? parseFloat(fundData.return6M) : 0,
        return1Y:
          fundData.return1Y !== null ? parseFloat(fundData.return1Y) : 0,
        return3Y:
          fundData.return3Y !== null ? parseFloat(fundData.return3Y) : 0,
        return5Y:
          fundData.return5Y !== null ? parseFloat(fundData.return5Y) : 0,
        return10Y:
          fundData.return10Y !== null ? parseFloat(fundData.return10Y) : 0,
        returnSinceInception:
          fundData.returnSinceInception !== null
            ? parseFloat(fundData.returnSinceInception)
            : 0,
        expenseRatio: parseFloat(fundData.expenseRatio) || 0,
      },
      risk: fundData.risk || "Moderate",
      marketCapSplit: {
        largeCap: parseFloat(fundData.largeCap) || 0,
        midCap: parseFloat(fundData.midCap) || 0,
        smallCap: parseFloat(fundData.smallCap) || 0,
      },
    };
    setPortfolioFunds([...portfolioFunds, newFund]);
  };

  const handleAddEmptyFund = () => {
    const newFund = {
      id: `fund-${Date.now()}`,
      fundName: "",
      category: "",
      allocationPercentage: 0,
      amount: 0,
      nav: 0,
      navDate: "",
      metrics: {
        aum: 0,
        return3M: 0,
        return6M: 0,
        return1Y: 0,
        return3Y: 0,
        return5Y: 0,
        return10Y: 0,
        returnSinceInception: 0,
        expenseRatio: 0,
      },
      risk: "Moderate",
      marketCapSplit: {
        largeCap: 0,
        midCap: 0,
        smallCap: 0,
      },
    };
    setPortfolioFunds([...portfolioFunds, newFund]);
  };

  const handleRemoveFund = (id) => {
    setPortfolioFunds(portfolioFunds.filter((fund) => fund.id !== id));
  };

  const handleFundFieldChange = (id, field, value) => {
    setPortfolioFunds(
      portfolioFunds.map((fund) => {
        if (fund.id === id) {
          if (field.includes(".")) {
            const [parent, child] = field.split(".");
            return {
              ...fund,
              [parent]: {
                ...fund[parent],
                [child]: value,
              },
            };
          }

          if (field === "allocationPercentage") {
            const percentage = parseFloat(value) || 0;
            const amount = (formData.lumpsum * percentage) / 100;
            return { ...fund, allocationPercentage: percentage, amount };
          }

          return { ...fund, [field]: value };
        }
        return fund;
      }),
    );
  };

  const calculateMarketCapExposure = () => {
    const largeCap = portfolioFunds.reduce((sum, fund) => {
      return (
        sum +
        ((fund.marketCapSplit?.largeCap || 0) * fund.allocationPercentage) / 100
      );
    }, 0);

    const midCap = portfolioFunds.reduce((sum, fund) => {
      return (
        sum +
        ((fund.marketCapSplit?.midCap || 0) * fund.allocationPercentage) / 100
      );
    }, 0);

    const smallCap = portfolioFunds.reduce((sum, fund) => {
      return (
        sum +
        ((fund.marketCapSplit?.smallCap || 0) * fund.allocationPercentage) / 100
      );
    }, 0);

    return { largeCap, midCap, smallCap };
  };

  const getTotalAllocation = () => {
    return portfolioFunds.reduce(
      (sum, fund) => sum + (fund.allocationPercentage || 0),
      0,
    );
  };

  const handlePrintPDF = () => {
    if (portfolioFunds.length === 0) {
      alert(
        "Please add at least one fund to the portfolio before generating PDF.",
      );
      return;
    }
    window.print();
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Proposal Data Found
          </h2>
          <p className="text-gray-600">
            Please generate a proposal from the wizard first.
          </p>
        </div>
      </div>
    );
  }

  const riskAppetite = getRiskAppetite(formData.horizon);
  const strategyDetails = editableStrategy || formData.selectedStrategyDetails;
  const selectedProjection = editableProjections
    ? { projections: editableProjections }
    : formData.selectedProjectionData;
  const marketCapExposure = calculateMarketCapExposure();
  const totalAllocation = getTotalAllocation();

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color: #000;
            counter-reset: page;
          }

          /* CUSTOM HEADER THAT APPEARS ON EVERY PAGE */
          .custom-print-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 30px;
            display: grid !important;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            padding: 5px 20px;
            font-size: 10px;
            color: #666;
            background-color: white;
            z-index: 9999;
            border-bottom: 1px solid #eee;
          }
          
          /* CUSTOM FOOTER WITH PAGE NUMBER */
          .custom-print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 30px;
            display: flex !important;
            justify-content: flex-center;
            align-items: center;
            padding: 5px 20px;
            font-size: 10px;
            color: #666;
            background-color: white;
            z-index: 9999;
            border-top: 1px solid #eee;
          }
          
          
          /* Padding for content so it doesn't overlap with fixed header/footer */
          .print-content-padding {
            padding-top: 60px !important; 
            padding-left: 15mm !important;
            padding-right: 15mm !important;
            padding-bottom: 40px !important;
          }
          
          .founder-card-wrapper {
            transform: scale(0.6);          
            transform-origin: top center;
            height: 750px;                  
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow: visible;
            margin-bottom: 20px;
          }

          @media print {
            .founder-card-wrapper {
              transform: scale(0.52) !important; 
              height: 400px !important;          
              margin-bottom: -20px !important;
              overflow: visible !important;
            }
          }

          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .page-break {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          table {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          thead {
            display: table-header-group;
          }
          
          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          section {
            page-break-inside: avoid;
            break-inside: avoid;
            padding-top: 40px !important; 
            margin-top: 0 !important;
            position: relative;
          }
          
          input, select, button {
            border: none !important;
            background: transparent !important;
            -webkit-appearance: none;
            appearance: none;
            box-shadow: none !important;
            padding: 0 !important;
            font-size: inherit !important;
          }
          
          .hide-in-print {
            display: none !important;
          }
          
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .shadow-lg,
          .rounded-lg,
          .rounded-t-lg,
          .rounded-b-lg {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          .max-w-7xl {
            max-width: 100% !important;
            padding: 0 !important;
          }
          
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          
          th, td {
            padding: 8px !important;
            text-align: left;
          }
        }
        
        @media screen {
          .print-only {
            display: none;
          }
          .custom-print-header {
            display: none;
          }
          .custom-print-footer {
            display: none;
          }
        }
      `}</style>

      {/* CUSTOM PRINT HEADER - Fixed to top of every page in print */}
      <div className="custom-print-header">
        <div className="text-left">{getFormattedPrintDate()}</div>
        <div className="text-center font-semibold">TrueWise FinSure</div>
        <div className="text-right">
          {/* Right side placeholder if needed */}
        </div>
      </div>

      {/* CUSTOM PRINT FOOTER - Fixed to bottom of every page in print */}
      <div className="custom-print-footer">
        <p>
          *Mutual fund investments carry market risks with no guaranteed
          returns, you may lose your original investment. The projections shown
          are illustrative only and actual returns may vary significantly based
          on market conditions. This is for informational purposes only and not
          investment advice - consult TrueWise FinSure before investing.
        </p>
      </div>

      <div className="min-h-screen bg-gray-50 py-8 print-content-padding">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          {/* Inline Action Bar */}
          <div className="no-print bg-white rounded-t-lg shadow-lg px-8 py-6 flex justify-between items-center border-b-2 border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Proposal
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ID: {proposalId} • {proposalDate}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                Close
              </button>
              <button
                onClick={handlePrintPDF}
                className="px-6 py-2 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                style={{ backgroundColor: "#73b030" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#337b1c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#73b030")
                }
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>

          {/* Print Title Block */}
          <div className="print-only bg-white p-8 pb-4">
            <div className="text-center mb-8">
              <img
                src="/logoTWFS.png"
                alt="TrueWise FinSure"
                className="h-24 mx-auto mb-6 object-contain"
              />
              <h1
                className="text-[28px] font-bold mb-2"
                style={{ color: "#73b030" }}
              >
                Mutual Fund Illustrative Investment Proposal
              </h1>
              <div className="text-gray-600 text-md">
                <p>
                  Prepared by an AMFI Registered Mutual Fund Distributor.
                </p>
                <p>
                  This document is for informational & distribution purposes{" "}
                  <br />
                  only & does not constitute investment advice.
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <span>Proposal ID: {proposalId}</span> •{" "}
                <span>{proposalDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-lg shadow-lg p-8 space-y-8">
            {/* Section 1: Client Information */}
            <section className="border-b-2 border-gray-200 pb-6 avoid-break">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#73b030" }}
              >
                Client Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.clientAge || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, clientAge: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={formData.clientMobile || ""}
                    maxLength={10}
                    onChange={(e) =>
                      setFormData({ ...formData, clientMobile: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Horizon (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.horizon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horizon: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Asset Allocation Strategy
                    </label>
                    <input
                      type="text"
                      value={riskAppetite}
                      readOnly
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-gray-800">
                      <strong>
                        Asset Allocation Strategy is based on client self-assessment and is
                        indicative in nature.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Investment Details */}
            <section className="border-b-2 border-gray-200 pb-6 avoid-break">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#73b030" }}
              >
                Investment Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lumpsum Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.lumpsum}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lumpsum: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly SIP (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlySIP}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlySIP: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Step-up (%)
                  </label>
                  <input
                    type="number"
                    value={formData.stepUpPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stepUpPercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Asset Allocation Strategy */}
            <section className="border-b-2 border-gray-200 pb-6 avoid-break">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#73b030" }}
              >
                Asset Allocation Strategy
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equity (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={strategyDetails?.equity || 0}
                    onChange={(e) => handleEquityChange(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-blue-400 rounded-lg focus:border-blue-600 focus:outline-none text-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Debt/Arbitrage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={strategyDetails?.debt || 0}
                    onChange={(e) => handleDebtChange(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-green-400 rounded-lg focus:border-green-600 focus:outline-none text-lg font-semibold"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Illustrative Assumed Return
                    </label>
                    <input
                      type="text"
                      value={strategyDetails?.return || 0}
                      readOnly
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-semibold"
                    />
                  </div>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-gray-800">
                      <strong>
                        The above allocation is indicative and may change based
                        on market conditions and investor preference.
                        Illustrative assumed return used only for calculation
                        purposes
                      </strong>
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Risk Profile
                  </label>
                  <input
                    type="text"
                    value={strategyDetails?.riskProfile || ""}
                    readOnly
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-semibold"
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Portfolio Composition - Editable Table */}
            <section className="border-b-2 border-gray-200 pb-6 page-break avoid-break">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#73b030" }}>
                  Portfolio Composition
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSearchBar(!showSearchBar)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    {showSearchBar ? "Hide Search" : "Search Funds"}
                  </button>
                  <button
                    onClick={handleAddEmptyFund}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Row
                  </button>
                </div>
              </div>

              {showSearchBar && (
                <div className="mb-4">
                  <FundSearchBar
                    onAddFund={handleAddFund}
                    existingFunds={portfolioFunds}
                  />
                </div>
              )}

              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-gray-800">
                  <strong>
                    Total Allocation: {totalAllocation.toFixed(2)}%
                  </strong>
                  {totalAllocation !== 100 && (
                    <span className="text-red-600 ml-2">(Should be 100%)</span>
                  )}
                </p>
              </div>

              <div className="overflow-x-auto avoid-break">
                <table className="w-full border-2 border-gray-300 rounded-lg avoid-break">
                  <thead>
                    <tr style={{ backgroundColor: "#73b030", color: "white" }}>
                      <th className="text-left p-3 font-semibold">Fund Name</th>
                      <th className="text-center p-3 font-semibold">
                        Category
                      </th>
                      <th className="text-center p-3 font-semibold">
                        Weight (%)
                      </th>
                      <th className="text-right p-3 font-semibold">
                        Amount (₹)
                      </th>
                      <th className="text-center p-3 font-semibold hide-in-print">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioFunds.map((fund, index) => (
                      <tr
                        key={fund.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-2">
                          <input
                            type="text"
                            value={fund.fundName}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "fundName",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Enter fund name"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={fund.category}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "category",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                            placeholder="Category"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.allocationPercentage}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "allocationPercentage",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center font-semibold"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={formatCurrency(fund.amount)}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50 text-right text-gray-600"
                          />
                        </td>
                        <td className="p-2 text-center hide-in-print">
                          <button
                            onClick={() => handleRemoveFund(fund.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {portfolioFunds.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-gray-500"
                        >
                          No funds added yet. Click "Add Row" or "Search Funds"
                          to add funds to your portfolio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {portfolioFunds.length > 0 && (
                    <tfoot>
                      <tr style={{ backgroundColor: "#ecf4e4" }}>
                        <td className="p-3 font-bold text-gray-900" colSpan="2">
                          Total Portfolio
                        </td>
                        <td className="p-3 text-center font-bold text-gray-900">
                          {totalAllocation.toFixed(2)}%
                        </td>
                        <td className="p-3 text-right font-bold text-gray-900">
                          {formatCurrency(
                            portfolioFunds.reduce(
                              (sum, f) => sum + f.amount,
                              0,
                            ),
                          )}
                        </td>
                        <td className="hide-in-print"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              <h2
                className="text-2xl font-bold mb-4 pt-4"
                style={{ color: "#73b030" }}
              >
                Fund Performance & Metrics
              </h2>

              {/* NAV Table */}
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Current NAV
              </h3>
              <div className="overflow-x-auto avoid-break mb-6">
                <table className="w-full border-2 border-gray-300 rounded-lg text-sm avoid-break">
                  <thead>
                    <tr style={{ backgroundColor: "#ecf4e4" }}>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Fund Name
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        NAV (₹)
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        NAV Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioFunds.map((fund, index) => (
                      <tr
                        key={fund.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-2 text-gray-900 font-medium">
                          {fund.fundName || "N/A"}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.nav || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "nav",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center font-semibold text-green-700"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={fund.navDate || ""}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "navDate",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center text-xs"
                            placeholder="DD-MM-YYYY"
                          />
                        </td>
                      </tr>
                    ))}
                    {portfolioFunds.length === 0 && (
                      <tr>
                        <td
                          colSpan="3"
                          className="p-8 text-center text-gray-500"
                        >
                          No funds to display. Add funds in the Portfolio
                          Composition section above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Absolute Returns Table */}
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Absolute/CAGR Returns (Past Performance)
              </h3>
              <div className="overflow-x-auto avoid-break space-y-2">
                <table className="w-full border-2 border-gray-300 rounded-lg text-sm avoid-break">
                  <thead>
                    <tr style={{ backgroundColor: "#ecf4e4" }}>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Fund Name
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        3M (%)
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        6M (%)
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        1Y (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioFunds.map((fund, index) => (
                      <tr
                        key={fund.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-2 text-gray-900 font-medium">
                          {fund.fundName || "N/A"}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.return3M || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.return3M",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.return6M || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.return6M",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.return1Y || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.return1Y",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                          />
                        </td>
                      </tr>
                    ))}
                    {portfolioFunds.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-8 text-center text-gray-500"
                        >
                          No funds to display. Add funds in the Portfolio
                          Composition section above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* CAGR Returns Table */}

              <div className="overflow-x-auto avoid-break mb-6">
                <table className="w-full border-2 border-gray-300 rounded-lg text-sm avoid-break mb-4">
                  <thead>
                    <tr style={{ backgroundColor: "#ecf4e4" }}>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Fund Name
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        3Y CAGR (%)
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        5Y CAGR (%)
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        10Y CAGR (%)
                      </th>
                      <th className="text-center p-2 font-semibold text-gray-800">
                        Since Inception (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioFunds.map((fund, index) => (
                      <tr
                        key={fund.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-2 text-gray-900 font-medium">
                          {fund.fundName || "N/A"}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.return3Y || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.return3Y",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.return5Y || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.return5Y",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.return10Y || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.return10Y",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={fund.metrics.returnSinceInception || 0}
                            onChange={(e) =>
                              handleFundFieldChange(
                                fund.id,
                                "metrics.returnSinceInception",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center font-semibold text-green-700"
                          />
                        </td>
                      </tr>
                    ))}
                    {portfolioFunds.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-gray-500"
                        >
                          No funds to display. Add funds in the Portfolio
                          Composition section above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-gray-800">
                    <strong>
                      Past performance may or may not be sustained in future.
                    </strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Financial Projections (Read-only) */}
            <section className="border-b-2 border-gray-200 pb-6 avoid-break">
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Disclaimer:
                </h3>
                <p className="text-base font-semibold text-red-800 mb-2">
                  This illustration is based on assumed rates of return and does
                  not represent expected, probable, or guaranteed outcomes.
                </p>
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#73b030" }}
              >
                Illustrative Scenario (Assumed, Non-Guaranteed)
              </h2>
              <div className="overflow-x-auto avoid-break">
                <table className="w-full border-2 border-gray-300 rounded-lg avoid-break mb-4">
                  <thead>
                    <tr style={{ backgroundColor: "#73b030", color: "white" }}>
                      <th className="text-center p-3 font-semibold">Year</th>
                      <th className="text-right p-3 font-semibold">
                        Total Investment
                      </th>
                      <th className="text-right p-3 font-semibold">
                        Probable Value
                      </th>
                      <th className="text-right p-3 font-semibold">
                        Wealth Gain
                      </th>
                      <th className="text-right p-3 font-semibold">CAGR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProjection?.projections.map((proj, index) => {
                      const gains = proj.probableAmount - proj.totalInvestment;
                      const gainPercentage = (
                        (gains / proj.totalInvestment) *
                        100
                      ).toFixed(2);
                      const cagr = calculateCAGR(
                        proj.totalInvestment,
                        proj.probableAmount,
                        proj.year,
                      );
                      return (
                        <tr
                          key={proj.year}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="p-3 text-center font-semibold text-gray-900">
                            {proj.year} Years
                          </td>
                          <td className="p-3 text-right text-gray-700">
                            {formatCurrency(proj.totalInvestment)}
                          </td>
                          <td
                            className="p-3 text-right font-bold"
                            style={{ color: "#73b030" }}
                          >
                            {formatCurrency(proj.probableAmount)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-semibold text-green-600">
                              +{formatCurrency(gains)}
                            </div>
                            <div className="text-xs text-green-700 font-medium">
                              ({gainPercentage}%)
                            </div>
                          </td>
                          <td className="p-3 text-right font-bold text-purple-600">
                            {cagr.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              {selectedProjection?.projections &&
                selectedProjection.projections.length > 0 &&
                (() => {
                  const horizonProjection =
                    selectedProjection.projections.find(
                      (p) => p.year === formData.horizon,
                    ) ||
                    selectedProjection.projections[
                      selectedProjection.projections.length - 1
                    ];
                  const totalGain =
                    horizonProjection.probableAmount -
                    horizonProjection.totalInvestment;
                  const totalGainPercentage = (
                    (totalGain / horizonProjection.totalInvestment) *
                    100
                  ).toFixed(2);
                  return (
                    <div className="mt-6 grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg p-5">
                        <div className="text-sm font-semibold text-blue-800 mb-2">
                          Total Investment at {formData.horizon} Years
                        </div>
                        <div className="text-3xl font-bold text-blue-900">
                          {formatCurrency(horizonProjection.totalInvestment)}
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          Lumpsum + SIP contributions
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-5">
                        <div className="text-sm font-semibold text-green-800 mb-2">
                          Probable Value at {formData.horizon} Years
                        </div>
                        <div className="text-3xl font-bold text-green-900">
                          {formatCurrency(horizonProjection.probableAmount)}
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          Wealth Gain: +{formatCurrency(totalGain)} (
                          {totalGainPercentage}%)
                        </div>
                      </div>
                    </div>
                  );
                })()}
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-gray-800">
                  <strong>
                    The above amount represents only the total contributions
                    made by the investor over the period. No future value or
                    return is projected or assured.
                  </strong>
                </p>
              </div>
            </section>

            {/* Section 6: Advisor Information with Founder Card */}
            <section className="page-break avoid-break">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#73b030" }}
              >
                Distributor Information
              </h2>

              {/* ... Inputs for Name, Email, Mobile ... */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.advisorName}
                    onChange={(e) =>
                      setFormData({ ...formData, advisorName: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.advisorEmail || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, advisorEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.advisorMobile || ""}
                    maxLength={10}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        advisorMobile: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-4">
                <p className="text-sm text-gray-800">
                  <strong>
                    Mutual fund services are offered in the capacity of
                    distributor and not as an investment adviser.
                  </strong>
                </p>
              </div>
              <div className="flex justify-center p-4 bg-green-50 border-green-400 rounded mb-4">
                <p className="text-sm text-gray-800">
                  <strong>{BRAND.amfi_status}</strong>
                </p>
              </div>

                {/* Founder Card */}
                <div className="flex justify-center mb-8">
                  <div className="founder-card-wrapper">
                    <FounderCard id="proposal-founder-card" pdfSafe={true} />
                  </div>
                </div>

                {/* Disclaimer Text */}
                <div className="flex justify-center mb-4">
                  <div className="inline-block px-6 py-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-800 font-bold">
                      Availability of products and services is subject to
                      regulatory approvals and eligibility.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mb-4 text-xl text-green-700 font-semibold">
                  TrueWise FinSure is a proprietorship concern of Yash Anil Hastak
                </div>

            </section>

            {/* Legal Disclaimer - Print Only */}
            <section className="print-only page-break mt-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#73b030" }}
              >
                Legal Disclaimer
              </h2>

              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Standard Warning
                </h3>
                <p className="text-base font-semibold text-red-800 mb-2">
                  Mutual Fund investments are subject to market risks. Please
                  read all scheme-related documents carefully before investing.
                </p>
                <p className="text-sm text-red-700">
                  Past performance is not indicative of future results. The
                  value of investments and the income from them can go down as
                  well as up, and you may not get back the amount originally
                  invested.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    No Guarantee of Returns
                  </h4>
                  <p className="text-sm text-gray-700">
                    The projections and illustrations shown in this proposal are
                    based on assumed rates of return and are for illustrative
                    purposes only. These projections do not constitute
                    guaranteed returns. Actual returns may vary significantly
                    based on market conditions.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Market Risk
                  </h4>
                  <p className="text-sm text-gray-700">
                    All mutual fund investments are subject to market risks
                    including the possible loss of principal. The value of your
                    investment will fluctuate over time, and you may gain or
                    lose money.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Professional Advice
                  </h4>
                  <p className="text-sm text-gray-700">
                    This proposal is generated for informational purposes and
                    does not constitute investment advice. Before making any
                    investment decision, you should consult with a qualified
                    financial advisor.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Proposal Generated By</p>
                  <p className="font-semibold text-gray-900">
                    {formData.advisorName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{proposalDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Proposal ID</p>
                  <p className="font-semibold text-gray-900">{proposalId}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalEditForm;
