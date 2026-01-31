import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { BRAND } from "../../constants/brand";
import { formatCurrency, calculateCAGR } from "../ProposalWizard/utils/calculations";
import { LOGO_BASE64, FOUNDER_BASE64 } from "./imageAssets";

const PRIMARY_COLOR = "#73b030";
const DARK_GREEN = "#337b1c";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    position: "absolute",
    top: 15,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    fontSize: 8,
    color: "#666666",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 40,
    right: 40,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    fontSize: 7,
    color: "#666666",
    textAlign: "center",
  },
  titlePage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  logo: {
    width: 180,
    height: 90,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY_COLOR,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    color: "#666666",
    textAlign: "center",
    marginBottom: 6,
  },
  proposalInfo: {
    marginTop: 20,
    fontSize: 9,
    color: "#666666",
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY_COLOR,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  col2: {
    width: "50%",
    paddingRight: 8,
  },
  col3: {
    width: "33.33%",
    paddingRight: 8,
  },
  label: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#555555",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#333333",
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
  },
  warningBox: {
    backgroundColor: "#fefce8",
    borderLeftWidth: 3,
    borderLeftColor: "#facc15",
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 8,
    color: "#333333",
    fontFamily: "Helvetica-Bold",
  },
  disclaimerBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    padding: 10,
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#7f1d1d",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#991b1b",
  },
  table: {
    marginTop: 8,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderAlt: {
    flexDirection: "row",
    backgroundColor: "#ecf4e4",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  tableHeaderCellAlt: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
  tableCell: {
    fontSize: 8,
    color: "#333333",
  },
  tableCellBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  tableFooter: {
    flexDirection: "row",
    backgroundColor: "#ecf4e4",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 4,
  },
  summaryBoxBlue: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#60a5fa",
  },
  summaryBoxGreen: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  summaryLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  summarySubtext: {
    fontSize: 7,
    marginTop: 2,
  },
  founderCard: {
    backgroundColor: DARK_GREEN,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  founderContent: {
    flexDirection: "row",
  },
  founderInfo: {
    width: "65%",
    padding: 16,
  },
  founderName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  founderTitle: {
    fontSize: 10,
    color: "#ffffff",
    marginBottom: 10,
  },
  founderQuote: {
    fontSize: 9,
    color: "#e2e8f0",
    fontStyle: "italic",
    marginBottom: 8,
  },
  founderText: {
    fontSize: 9,
    color: "#e2e8f0",
    marginBottom: 10,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
    color: "#4ade80",
  },
  checkText: {
    fontSize: 9,
    color: "#ffffff",
  },
  founderImageContainer: {
    width: "35%",
  },
  founderImage: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },
  servicesSection: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  servicesTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 8,
    color: "#e2e8f0",
  },
  infoBox: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    marginVertical: 8,
    textAlign: "center",
  },
  infoText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  legalSection: {
    marginTop: 12,
  },
  legalItem: {
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 3,
    borderLeftColor: "#9ca3af",
    padding: 8,
    marginBottom: 8,
  },
  legalTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
    marginBottom: 2,
  },
  legalText: {
    fontSize: 8,
    color: "#555555",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
  },
  signatureBlock: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: 8,
    color: "#666666",
  },
  signatureValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  greenText: {
    color: PRIMARY_COLOR,
  },
  purpleText: {
    color: "#7c3aed",
  },
  centerText: {
    textAlign: "center",
  },
  rightText: {
    textAlign: "right",
  },
  pageBreak: {
    marginTop: 0,
  },
});

const Header = ({ date }) => (
  <View style={styles.header} fixed>
    <Text>{date}</Text>
    <Text style={{ fontFamily: "Helvetica-Bold" }}>TrueWise FinSure</Text>
    <Text></Text>
  </View>
);

const Footer = () => (
  <View style={styles.footer} fixed>
    <Text>
      *Mutual fund investments carry market risks with no guaranteed returns, you may lose your original investment. The projections shown are illustrative only and actual returns may vary significantly based on market conditions. This is for informational purposes only and not investment advice - consult TrueWise FinSure before investing.
    </Text>
  </View>
);

const CheckMark = () => (
  <Text style={{ color: "#4ade80", fontSize: 10, marginRight: 4 }}>✓</Text>
);

const ProposalPDFDocument = ({
  formData,
  portfolioFunds,
  strategyDetails,
  selectedProjection,
  proposalId,
  proposalDate,
  riskAppetite,
  totalAllocation,
}) => {
  const getFormattedPrintDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const printDate = getFormattedPrintDate();

  const InvestSvc = [
    "Mutual Funds",
    "Pre-IPO & NFO",
    "Bonds & Debentures",
    "GIFT City Products",
    "Loan Against Mutual Funds",
    "Alternative Investment Funds",
    "Portfolio Management Services",
    "Life Insurance",
    "Health Insurance",
    "Travel Insurance",
    "Two & Four Wheeler Insurance",
    "Commercial Vehicle Insurance",
    "Pension & Guaranteed Income Plans",
  ];

  return (
    <Document>
      {/* Title Page */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        <View style={styles.titlePage}>
          <Image style={styles.logo} src={LOGO_BASE64} />
          <Text style={styles.mainTitle}>
            Mutual Fund Illustrative Investment Proposal
          </Text>
          <Text style={styles.subtitle}>
            Prepared by an AMFI Registered Mutual Fund Distributor.
          </Text>
          <Text style={styles.subtitle}>
            This document is for informational & distribution purposes
          </Text>
          <Text style={styles.subtitle}>
            only & does not constitute investment advice.
          </Text>
          <Text style={styles.proposalInfo}>
            Proposal ID: {proposalId} • {proposalDate}
          </Text>
        </View>
        <Footer />
      </Page>

      {/* Client Information & Investment Details */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        
        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Client Name</Text>
              <Text style={styles.value}>{formData?.clientName || "N/A"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{formData?.clientAge || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{formData?.clientMobile || "N/A"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Time Horizon (Years)</Text>
              <Text style={styles.value}>{formData?.horizon || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Asset Allocation Strategy</Text>
              <Text style={styles.value}>{riskAppetite || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Asset Allocation Strategy is based on client self-assessment and is indicative in nature.
            </Text>
          </View>
        </View>

        {/* Investment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Details</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Lumpsum Amount (₹)</Text>
              <Text style={styles.value}>{formatCurrency(formData?.lumpsum || 0)}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Monthly SIP (₹)</Text>
              <Text style={styles.value}>{formatCurrency(formData?.monthlySIP || 0)}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Step-up (%)</Text>
              <Text style={styles.value}>{formData?.stepUpPercentage || 0}%</Text>
            </View>
          </View>
        </View>

        {/* Asset Allocation Strategy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asset Allocation Strategy</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Equity (%)</Text>
              <Text style={styles.value}>{strategyDetails?.equity || 0}%</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Debt/Arbitrage (%)</Text>
              <Text style={styles.value}>{strategyDetails?.debt || 0}%</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Illustrative Assumed Return</Text>
              <Text style={styles.value}>{strategyDetails?.return || 0}%</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Risk Profile</Text>
              <Text style={styles.value}>{strategyDetails?.riskProfile || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              The above allocation is indicative and may change based on market conditions and investor preference. Illustrative assumed return used only for calculation purposes.
            </Text>
          </View>
        </View>

        <Footer />
      </Page>

      {/* Portfolio Composition */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Composition</Text>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Total Allocation: {totalAllocation?.toFixed(2) || 0}%
              {totalAllocation !== 100 && " (Should be 100%)"}
            </Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Fund Name</Text>
              <Text style={[styles.tableHeaderCell, { width: "25%", textAlign: "center" }]}>Category</Text>
              <Text style={[styles.tableHeaderCell, { width: "15%", textAlign: "center" }]}>Weight (%)</Text>
              <Text style={[styles.tableHeaderCell, { width: "20%", textAlign: "right" }]}>Amount (₹)</Text>
            </View>
            {portfolioFunds?.map((fund, index) => (
              <View 
                key={fund.id} 
                style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={[styles.tableCell, { width: "40%" }]}>{fund.fundName || "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "25%", textAlign: "center" }]}>{fund.category || "N/A"}</Text>
                <Text style={[styles.tableCellBold, { width: "15%", textAlign: "center" }]}>{fund.allocationPercentage || 0}</Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "right" }]}>{formatCurrency(fund.amount || 0)}</Text>
              </View>
            ))}
            {portfolioFunds?.length > 0 && (
              <View style={styles.tableFooter}>
                <Text style={[styles.tableCellBold, { width: "65%" }]}>Total Portfolio</Text>
                <Text style={[styles.tableCellBold, { width: "15%", textAlign: "center" }]}>{totalAllocation?.toFixed(2) || 0}%</Text>
                <Text style={[styles.tableCellBold, { width: "20%", textAlign: "right" }]}>
                  {formatCurrency(portfolioFunds?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Fund Performance - NAV */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fund Performance & Metrics</Text>
          <Text style={[styles.label, { marginBottom: 6 }]}>Current NAV</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderAlt}>
              <Text style={[styles.tableHeaderCellAlt, { width: "50%" }]}>Fund Name</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "25%", textAlign: "center" }]}>NAV (₹)</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "25%", textAlign: "center" }]}>NAV Date</Text>
            </View>
            {portfolioFunds?.map((fund, index) => (
              <View 
                key={fund.id} 
                style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={[styles.tableCell, { width: "50%" }]}>{fund.fundName || "N/A"}</Text>
                <Text style={[styles.tableCellBold, styles.greenText, { width: "25%", textAlign: "center" }]}>{fund.nav || 0}</Text>
                <Text style={[styles.tableCell, { width: "25%", textAlign: "center" }]}>{fund.navDate || "N/A"}</Text>
              </View>
            ))}
          </View>
        </View>

        <Footer />
      </Page>

      {/* Returns Tables */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        
        {/* Absolute Returns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Absolute/CAGR Returns (Past Performance)</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderAlt}>
              <Text style={[styles.tableHeaderCellAlt, { width: "40%" }]}>Fund Name</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "20%", textAlign: "center" }]}>3M (%)</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "20%", textAlign: "center" }]}>6M (%)</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "20%", textAlign: "center" }]}>1Y (%)</Text>
            </View>
            {portfolioFunds?.map((fund, index) => (
              <View 
                key={fund.id} 
                style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={[styles.tableCell, { width: "40%" }]}>{fund.fundName || "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "center" }]}>{fund.metrics?.return3M || 0}</Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "center" }]}>{fund.metrics?.return6M || 0}</Text>
                <Text style={[styles.tableCell, { width: "20%", textAlign: "center" }]}>{fund.metrics?.return1Y || 0}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CAGR Returns */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableHeaderAlt}>
              <Text style={[styles.tableHeaderCellAlt, { width: "30%" }]}>Fund Name</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "17.5%", textAlign: "center" }]}>3Y CAGR (%)</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "17.5%", textAlign: "center" }]}>5Y CAGR (%)</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "17.5%", textAlign: "center" }]}>10Y CAGR (%)</Text>
              <Text style={[styles.tableHeaderCellAlt, { width: "17.5%", textAlign: "center" }]}>Since Inception (%)</Text>
            </View>
            {portfolioFunds?.map((fund, index) => (
              <View 
                key={fund.id} 
                style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={[styles.tableCell, { width: "30%" }]}>{fund.fundName || "N/A"}</Text>
                <Text style={[styles.tableCell, { width: "17.5%", textAlign: "center" }]}>{fund.metrics?.return3Y || 0}</Text>
                <Text style={[styles.tableCell, { width: "17.5%", textAlign: "center" }]}>{fund.metrics?.return5Y || 0}</Text>
                <Text style={[styles.tableCell, { width: "17.5%", textAlign: "center" }]}>{fund.metrics?.return10Y || 0}</Text>
                <Text style={[styles.tableCellBold, styles.greenText, { width: "17.5%", textAlign: "center" }]}>{fund.metrics?.returnSinceInception || 0}</Text>
              </View>
            ))}
          </View>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Past performance may or may not be sustained in future.
            </Text>
          </View>
        </View>

        <Footer />
      </Page>

      {/* Financial Projections */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
          <Text style={styles.disclaimerText}>
            This illustration is based on assumed rates of return and does not represent expected, probable, or guaranteed outcomes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Illustrative Scenario (Assumed, Non-Guaranteed)</Text>
          
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "15%", textAlign: "center" }]}>Year</Text>
              <Text style={[styles.tableHeaderCell, { width: "22%", textAlign: "right" }]}>Total Investment</Text>
              <Text style={[styles.tableHeaderCell, { width: "22%", textAlign: "right" }]}>Probable Value</Text>
              <Text style={[styles.tableHeaderCell, { width: "26%", textAlign: "right" }]}>Wealth Gain</Text>
              <Text style={[styles.tableHeaderCell, { width: "15%", textAlign: "right" }]}>CAGR</Text>
            </View>
            {selectedProjection?.projections?.map((proj, index) => {
              const gains = proj.probableAmount - proj.totalInvestment;
              const gainPercentage = ((gains / proj.totalInvestment) * 100).toFixed(2);
              const cagr = calculateCAGR(proj.totalInvestment, proj.probableAmount, proj.year);
              return (
                <View 
                  key={proj.year} 
                  style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
                >
                  <Text style={[styles.tableCellBold, { width: "15%", textAlign: "center" }]}>{proj.year} Years</Text>
                  <Text style={[styles.tableCell, { width: "22%", textAlign: "right" }]}>{formatCurrency(proj.totalInvestment)}</Text>
                  <Text style={[styles.tableCellBold, styles.greenText, { width: "22%", textAlign: "right" }]}>{formatCurrency(proj.probableAmount)}</Text>
                  <Text style={[styles.tableCell, { width: "26%", textAlign: "right" }]}>+{formatCurrency(gains)} ({gainPercentage}%)</Text>
                  <Text style={[styles.tableCellBold, styles.purpleText, { width: "15%", textAlign: "right" }]}>{cagr.toFixed(2)}%</Text>
                </View>
              );
            })}
          </View>

          {/* Summary Boxes */}
          {selectedProjection?.projections?.length > 0 && (() => {
            const horizonProjection = selectedProjection.projections.find(
              (p) => p.year === formData?.horizon
            ) || selectedProjection.projections[selectedProjection.projections.length - 1];
            const totalGain = horizonProjection.probableAmount - horizonProjection.totalInvestment;
            const totalGainPercentage = ((totalGain / horizonProjection.totalInvestment) * 100).toFixed(2);
            return (
              <View style={styles.summaryGrid}>
                <View style={[styles.summaryBox, styles.summaryBoxBlue]}>
                  <Text style={[styles.summaryLabel, { color: "#1e40af" }]}>
                    Total Investment at {formData?.horizon} Years
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#1e3a8a" }]}>
                    {formatCurrency(horizonProjection.totalInvestment)}
                  </Text>
                  <Text style={[styles.summarySubtext, { color: "#1d4ed8" }]}>
                    Lumpsum + SIP contributions
                  </Text>
                </View>
                <View style={[styles.summaryBox, styles.summaryBoxGreen, { marginRight: 0 }]}>
                  <Text style={[styles.summaryLabel, { color: "#166534" }]}>
                    Probable Value at {formData?.horizon} Years
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#14532d" }]}>
                    {formatCurrency(horizonProjection.probableAmount)}
                  </Text>
                  <Text style={[styles.summarySubtext, { color: "#15803d" }]}>
                    Wealth Gain: +{formatCurrency(totalGain)} ({totalGainPercentage}%)
                  </Text>
                </View>
              </View>
            );
          })()}

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              The above amount represents only the total contributions made by the investor over the period. No future value or return is projected or assured.
            </Text>
          </View>
        </View>

        <Footer />
      </Page>

      {/* Distributor Information */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distributor Information</Text>
          <View style={styles.row}>
            <View style={styles.col3}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{formData?.advisorName || "N/A"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{formData?.advisorEmail || "N/A"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>{formData?.advisorMobile || "N/A"}</Text>
            </View>
          </View>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Mutual fund services are offered in the capacity of distributor and not as an investment adviser.
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{BRAND.amfi_status}</Text>
          </View>
        </View>

        {/* Founder Card */}
        <View style={styles.founderCard}>
          <View style={styles.founderContent}>
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>{BRAND.founder}</Text>
              <Text style={styles.founderTitle}>Founder</Text>
              <Text style={styles.founderQuote}>
                "Investment and insurance should be personal, not complicated."
              </Text>
              <Text style={styles.founderText}>
                I founded this firm to be the transparent partner I always wished I had.
              </Text>
              <View>
                {["Client-First Approach", "Transparency & Ethics", "Long-term Focus"].map((text) => (
                  <View key={text} style={styles.checkItem}>
                    <CheckMark />
                    <Text style={styles.checkText}>{text}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.founderImageContainer}>
              <Image style={styles.founderImage} src={FOUNDER_BASE64} />
            </View>
          </View>
          <View style={styles.servicesSection}>
            <Text style={styles.servicesTitle}>Our Services</Text>
            <View style={styles.servicesGrid}>
              {InvestSvc.map((service) => (
                <View key={service} style={styles.serviceItem}>
                  <CheckMark />
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Availability of products and services is subject to regulatory approvals and eligibility.
          </Text>
        </View>
        <View style={[styles.infoBox, { backgroundColor: "transparent" }]}>
          <Text style={[styles.infoText, styles.greenText]}>
            TrueWise FinSure is a proprietorship concern of Yash Anil Hastak
          </Text>
        </View>

        <Footer />
      </Page>

      {/* Legal Disclaimer */}
      <Page size="A4" style={styles.page}>
        <Header date={printDate} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Disclaimer</Text>
          
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerTitle}>Standard Warning</Text>
            <Text style={styles.disclaimerText}>
              Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.
            </Text>
            <Text style={[styles.disclaimerText, { marginTop: 4, fontFamily: "Helvetica", fontSize: 8 }]}>
              Past performance is not indicative of future results. The value of investments and the income from them can go down as well as up, and you may not get back the amount originally invested.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <View style={styles.legalItem}>
              <Text style={styles.legalTitle}>No Guarantee of Returns</Text>
              <Text style={styles.legalText}>
                The projections and illustrations shown in this proposal are based on assumed rates of return and are for illustrative purposes only. These projections do not constitute guaranteed returns. Actual returns may vary significantly based on market conditions.
              </Text>
            </View>

            <View style={styles.legalItem}>
              <Text style={styles.legalTitle}>Market Risk</Text>
              <Text style={styles.legalText}>
                All mutual fund investments are subject to market risks including the possible loss of principal. The value of your investment will fluctuate over time, and you may gain or lose money.
              </Text>
            </View>

            <View style={styles.legalItem}>
              <Text style={styles.legalTitle}>Professional Advice</Text>
              <Text style={styles.legalText}>
                This proposal is generated for informational purposes and does not constitute investment advice. Before making any investment decision, you should consult with a qualified financial advisor.
              </Text>
            </View>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>Proposal Generated By</Text>
              <Text style={styles.signatureValue}>{formData?.advisorName || "N/A"}</Text>
              <Text style={[styles.signatureLabel, { marginTop: 4 }]}>{proposalDate}</Text>
            </View>
            <View style={[styles.signatureBlock, { textAlign: "right" }]}>
              <Text style={[styles.signatureLabel, styles.rightText]}>Proposal ID</Text>
              <Text style={[styles.signatureValue, styles.rightText]}>{proposalId}</Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

export default ProposalPDFDocument;
