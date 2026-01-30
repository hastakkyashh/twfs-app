import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  MessageSquare,
  Sparkles,
  Send,
  RefreshCw,
  PieChart,
  CheckCircle,
  Lock,
  AlertCircle,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  SectionTitle,
  Button,
  SimpleMarkdown,
  FounderCard,
} from "../components/ui";
import { callGemini } from "../services/geminiApi";
import { useAuth } from "../contexts/AuthContext";

const AIAssistantPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      text: "Namaste! I am Kubera, your AI assistant. Ask me anything about investment and insurance!",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [goalData, setGoalData] = useState({
    name: "",
    amount: "",
    years: "",
    risk: "Moderate",
  });
  const [goalPlan, setGoalPlan] = useState(null);
  const [isGoalLoading, setIsGoalLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      // Scroll the container to the bottom
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsChatLoading(true);

    const systemPrompt = `You are Kubera AI, a helpful and polite virtual assistant for TrueWise FinSure (an AMFI registered Mutual Fund Distributor in India). 
    Your goal is to educate users about Mutual Funds, SIPs, and Compounding in simple English.
    Keep your answers concise (under 200 words), encouraging, and beginner-friendly.
    If the user asks for specific stock tips or guaranteed returns, politely refuse and explain that mutual funds are subject to market risks.
    IMPORTANT: End every single response with this exact disclaimer in a new paragraph: "(Note: This is an AI-generated response for educational purposes only. Please consult TrueWise FinSure for personalized advice.)"`;

    const aiResponse = await callGemini(userMsg, systemPrompt);

    setChatHistory((prev) => [...prev, { role: "ai", text: aiResponse }]);
    setIsChatLoading(false);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!goalData.name || !goalData.amount || !goalData.years) return;

    setIsGoalLoading(true);
    setGoalPlan(null);

    // --- STEP 1: INTERNAL MATH (Crucial for Accuracy) ---
    // We calculate the SIP here so the AI doesn't have to guess.
    const getRate = (risk) => {
      switch (risk) {
        case "Very Conservative":
          return 0.065;
        case "Conservative":
          return 0.085;
        case "Moderate":
          return 0.095;
        case "Aggressive":
          return 0.115;
        case "Very Aggressive":
          return 0.135;
        default:
          return 0.095;
      }
    };

    const target = parseFloat(goalData.amount);
    const years = parseFloat(goalData.years);
    const annualRate = getRate(goalData.risk);

    const r = annualRate / 12;
    const n = years * 12;
    // Calculate raw SIP
    const rawSip = (target * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
    // Round to nearest 500
    const recommendedSIP = Math.round(rawSip / 500) * 500;
    const formattedSIP = recommendedSIP.toLocaleString("en-IN");
    const formattedAmount = target.toLocaleString("en-IN");

    // --- STEP 2: CONSTRUCT THE PROMPTS ---
    const userPrompt = `
      CLIENT PROFILE:
      - Goal Name: "${goalData.name}"
      - Target Amount: ₹${formattedAmount}
      - Time Horizon: ${goalData.years} Years
      - Asset Allocation Strategy: ${goalData.risk}
      
      CALCULATED METRICS (Use these facts, do not recalculate):
      - Assumed Return Rate: ${(annualRate * 100).toFixed(1)}%
      - Required Monthly SIP: ₹${formattedSIP}
    `;

    const systemPrompt = `
      **ROLE:** You are Kubera AI, an expert Senior Portfolio Manager for TrueWise FinSure. 
      Your job is to draft a professional, encouraging, and realistic "Investment Policy Strategy" (IPS) based on the client's goal.

      **STRATEGY GUIDELINES (Based on Asset Allocation Strategy):**
      - **Very Conservative (6-7%):** Focus on Capital Protection (Liquid/Ultra-Short Debt Funds).
      - **Conservative (8-9%):** Focus on Stability (Hybrid Debt-Oriented Funds).
      - **Moderate (9-10%):** Balanced Growth (Balanced Advantage or Hybrid Equity Funds).
      - **Aggressive (11-12%):** Long-term Wealth Creation (Flexi Cap or Large & Mid Cap Funds).
      - **Very Aggressive (13-14%):** High Growth Potential (Pure Equity, Mid & Small Cap Funds).

      **INSTRUCTIONS:**
      1. **Tone:** Professional, Insightful, and Encouraging. Act as a partner, not a robot.
      2. **The Reality Check:** - Acknowledge the goal.
         - **Crucial:** Mention inflation. Warn that due to ~6% inflation, the purchasing power of Rs. ${formattedAmount} will be significantly less in ${goalData.years} years.
      3. **The Solution:** State the Required SIP clearly.
      4. **Asset Allocation:** Recommend a split (e.g., 80% Equity / 20% Debt) matching their risk profile.

      **FORMATTING RULES (CRITICAL FOR PDF GENERATION):**
      - **NO MARKDOWN TABLES:** Do not use pipes (|) or table structures. They break the PDF layout.
      - **NO SYMBOLS:** Do not use the Rupee symbol (₹). **ALWAYS use "Rs." or "INR"**.
      - **Structure:** Use clear "## Headers" and bullet points ("-").
      - **Lists over Grids:** Present data as key-value pairs in a list (e.g., "- **Metric:** Value").
      - **Length:** Keep it concise (under 250 words).

      **OUTPUT STRUCTURE:**
      ## Goal Blueprint: [Create a Catchy Title]

      ### 1. The Reality Check
      [Inflation note & SIP Requirement]

      ### 2. Your Portfolio Strategy
      [Brief Strategy Description]

      **Asset Allocation:**
      - Equity Class (X%): [One sentence rationale]
      - Debt Class (Y%): [One sentence rationale]

      **Recommended Funds:**
      - [Fund Type A]
      - [Fund Type B]
      (Why: [Brief justification])

      ### 3. Manager's Note
      [Brief closing advice on discipline]

      ### 4. Approximate Returns
      - Required Monthly SIP: Rs. [Value]
      - Total Investment: Rs. [Value] (over ${goalData.years} years)
      - Estimated Target Corpus: Rs. [Value] (@ ${(annualRate * 100).toFixed(1)}%)
      - Wealth Created: Rs. [Value] (Interest earned)

      (Note: Returns are market-linked and not guaranteed. Consult TrueWise FinSure before investing.)
    `;

    // --- STEP 3: CALL API ---
    const plan = await callGemini(userPrompt, systemPrompt);
    setGoalPlan(plan);
    setIsGoalLoading(false);
  };

  const handleDownloadPdf = async () => {
    if (!goalPlan) return;

    setIsDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // 1. ADD LOGO (Top Left)
      const logoImg = new Image();
      logoImg.src = "/LogoTrueWise.png";
      // Wait for logo to load
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });

      const logoWidth = 40;
      const logoAspectRatio = logoImg.width / logoImg.height;
      const logoHeight = logoWidth / logoAspectRatio;

      pdf.addImage(logoImg, "PNG", margin, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 10;

      // Helper function to add text with automatic page breaks
      const addText = (text, fontSize, isBold = false, isItalic = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont(
          "helvetica",
          isBold ? "bold" : isItalic ? "italic" : "normal",
        );

        const lines = pdf.splitTextToSize(text, maxWidth);
        lines.forEach((line) => {
          if (yPosition + fontSize / 2 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize / 2 + 2;
        });
      };

      // Add title
      addText("Kubera AI - Investment Plan", 18, true);
      yPosition += 5;

      // Parse and format the markdown content
      const lines = goalPlan.split("\n");
      lines.forEach((line) => {
        if (line.trim() === "") {
          yPosition += 3;
          return;
        }

        // Handle headers
        if (line.startsWith("## ")) {
          yPosition += 3;
          addText(line.replace("## ", ""), 14, true);
        } else if (line.startsWith("### ")) {
          yPosition += 2;
          addText(line.replace("### ", ""), 12, true);
        } else if (line.startsWith("#### ")) {
          addText(line.replace("#### ", ""), 11, true);
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          // Handle bullet points
          const bulletText = "• " + line.substring(2);
          addText(bulletText, 10);
        } else {
          // Regular text - handle bold markers
          let processedLine = line.replace(/\*\*(.*?)\*\*/g, "$1");
          addText(processedLine, 10);
        }
      });

      // Add disclaimer
      yPosition += 8;
      if (yPosition + 20 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFillColor(255, 248, 240);
      pdf.rect(margin, yPosition - 3, maxWidth, 25, "F");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Disclaimer:", margin + 3, yPosition + 2);
      pdf.setFont("helvetica", "normal");
      const disclaimerText =
        "This plan is generated by Kubera AI for educational purposes. It is not a financial advice. Please consult with TrueWise FinSure for personalized advice.";
      const disclaimerLines = pdf.splitTextToSize(disclaimerText, maxWidth - 6);
      yPosition += 7;
      disclaimerLines.forEach((line) => {
        pdf.text(line, margin + 3, yPosition);
        yPosition += 4;
      });

      // 2. ADD FOUNDER CARD
      const cardElement = document.getElementById("pdf-founder-card");
      if (cardElement) {
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");

        // Calculate proportional dimensions for the card
        const imgProps = pdf.getImageProperties(imgData);
        const cardPdfWidth = pageWidth - margin * 2;
        const cardPdfHeight = (imgProps.height * cardPdfWidth) / imgProps.width;

        // --- SMART SPACE CHECK ---
        // If remaining space is less than card height + a small buffer (10mm)
        if (yPosition + cardPdfHeight + 10 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        } else {
          yPosition += 10; // Add some breathing room before the card
        }

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          yPosition,
          cardPdfWidth,
          cardPdfHeight,
        );
      }

      pdf.save("Kubera_Investment_Plan.pdf");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto animate-fade-in min-h-[80vh]">
      <SectionTitle
        title="Kubera AI"
        subtitle="Ask all about investment and insurance!"
      />

      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-lg flex gap-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${activeTab === "chat" ? "bg-white text-dark-green shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <MessageSquare size={18} /> Ask Kubera AI
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab("planner")}
              className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${activeTab === "planner" ? "bg-white text-dark-green shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Sparkles size={18} /> Smart Goal Drafter
            </button>
          )}
        </div>
      </div>

      {activeTab === "chat" && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-[600px] flex flex-col">
          <div className="bg-dark-green p-4 text-white flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold">Kubera AI</h3>
              <p className="text-xs text-light-cream">
                Always available to answer your queries
              </p>
            </div>
          </div>

          <div
            ref={chatEndRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
          >
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-green text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i} className="mb-1 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleChatSubmit}
            className="p-4 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask your query here..."
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="bg-dark-green text-white p-3 rounded-lg hover:bg-primary-green disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {activeTab === "planner" && isAuthenticated && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="text-brand-orange" /> Define Your Goal
            </h3>
            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daughter's Education, Dream Home"
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-green outline-none"
                  value={goalData.name}
                  onChange={(e) =>
                    setGoalData({ ...goalData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-green outline-none"
                  value={goalData.amount}
                  onChange={(e) =>
                    setGoalData({ ...goalData, amount: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Years to Goal
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-green outline-none"
                    value={goalData.years}
                    onChange={(e) =>
                      setGoalData({ ...goalData, years: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Asset Allocation Strategy
                  </label>
                  <select
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-green outline-none"
                    value={goalData.risk}
                    onChange={(e) =>
                      setGoalData({ ...goalData, risk: e.target.value })
                    }
                  >
                    <option>Very Conservative</option>
                    <option>Conservative</option>
                    <option>Moderate</option>
                    <option>Aggressive</option>
                    <option>Very Aggressive</option>
                  </select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isGoalLoading}
              >
                {isGoalLoading ? "Analyzing..." : "Generate Plan Draft"}
              </Button>
            </form>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 min-h-[400px]">
            {!goalPlan && !isGoalLoading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <PieChart size={64} className="mb-4 opacity-20" />
                <p>
                  Fill in your goal details to generate a Kubera AI-powered
                  investment roadmap.
                </p>
              </div>
            )}

            {isGoalLoading && (
              <div className="h-full flex flex-col items-center justify-center text-dark-green">
                <RefreshCw className="animate-spin mb-4" size={32} />
                <p>Consulting Kubera AI...</p>
              </div>
            )}

            {goalPlan && !isGoalLoading && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} /> Goal Plan
                </h3>
                <div>
                  <SimpleMarkdown content={goalPlan} />
                  <div className="mt-6 p-3 bg-light-cream rounded-md text-xs text-dark-green">
                    <strong>Disclaimer:</strong> This plan is generated by
                    Kubera AI for educational purposes. It is not a financial
                    advice. Please consult with TrueWise FinSure before
                    investing.
                  </div>
                </div>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="mt-6 w-full bg-dark-green text-white py-3 px-4 rounded-lg hover:bg-primary-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: "0",
          width: "800px",
        }}
      >
        <FounderCard id="pdf-founder-card" pdfSafe={true} />
      </div>
    </section>
  );
};

export default AIAssistantPage;
