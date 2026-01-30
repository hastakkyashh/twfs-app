import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import * as fundsService from '../../services/funds';

const FundSearchBar = ({ onAddFund, existingFunds = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundDetails, setFundDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchFunds();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchFunds = async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      const data = await fundsService.searchFunds(searchQuery);
      setSearchResults(data.funds || []);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection or try again later.');
      } else {
        setError(err.message);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchFundDetails = async (symbol) => {
    setIsLoadingDetails(true);
    setError(null);
    
    try {
      const data = await fundsService.getFundDetails(symbol);
      setFundDetails(data.fund);
    } catch (err) {
      console.error('Fund details error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection or try again later.');
      } else {
        setError(err.message);
      }
      setFundDetails(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSelectFund = (fund) => {
    setSelectedFund(fund);
    fetchFundDetails(fund.symbol);
    setShowResults(false);
  };

  const handleAddFund = () => {
    if (fundDetails && onAddFund) {
      onAddFund(fundDetails);
      setSearchQuery('');
      setSelectedFund(null);
      setFundDetails(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedFund(null);
    setFundDetails(null);
    setSearchQuery('');
  };

  const getRiskColor = (risk) => {
    const riskLower = risk?.toLowerCase() || '';
    if (riskLower.includes('low')) return 'text-green-600 bg-green-50';
    if (riskLower.includes('medium')) return 'text-yellow-600 bg-yellow-50';
    if (riskLower.includes('high')) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="mb-6" ref={searchRef}>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mutual funds (e.g., 'HDFC', 'SBI', 'ICICI')..."
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              disabled={!!selectedFund}
            />
            {searchQuery && !selectedFund && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {searchResults.map((fund, index) => (
              <button
                key={`${fund.symbol}-${index}`}
                onClick={() => handleSelectFund(fund)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm">{fund.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Scheme Code: {fund.schemeCode}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-600">No funds found. Try a different search term.</p>
          </div>
        )}
      </div>

      {selectedFund && (
        <div className="mt-4 p-4 bg-white border-2 border-blue-300 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg">{selectedFund.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{selectedFund.symbol}</p>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading fund details...</span>
            </div>
          ) : fundDetails ? (
            <>
              {/* Fund Basic Info */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-xs text-gray-600 mb-1">Scheme Name</div>
                <div className="font-bold text-gray-900 text-sm">{fundDetails.schemeName}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {fundDetails.fundHouse} • {fundDetails.schemeCategory}
                </div>
              </div>

              {/* NAV Info */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-xs text-gray-600 mb-1">Current NAV</div>
                <div className="font-bold text-green-700 text-2xl">₹{fundDetails.nav}</div>
                <div className="text-xs text-gray-500 mt-1">As on {fundDetails.navDate}</div>
              </div>

              {/* Absolute Returns (< 1Y) */}
              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-700 mb-2">Absolute Returns</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">3M</div>
                    <div className={`font-bold text-sm ${fundDetails.return3M !== null && fundDetails.return3M >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.return3M !== null ? `${fundDetails.return3M}%` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">6M</div>
                    <div className={`font-bold text-sm ${fundDetails.return6M !== null && fundDetails.return6M >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.return6M !== null ? `${fundDetails.return6M}%` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">1Y</div>
                    <div className={`font-bold text-sm ${fundDetails.return1Y !== null && fundDetails.return1Y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.return1Y !== null ? `${fundDetails.return1Y}%` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* CAGR Returns (>= 1Y) */}
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">CAGR Returns</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">3Y CAGR</div>
                    <div className={`font-bold text-sm ${fundDetails.return3Y !== null && fundDetails.return3Y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.return3Y !== null ? (
                        <span className="flex items-center gap-1">
                          {fundDetails.return3Y >= 0 && <TrendingUp className="w-3 h-3" />}
                          {fundDetails.return3Y}%
                        </span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">5Y CAGR</div>
                    <div className={`font-bold text-sm ${fundDetails.return5Y !== null && fundDetails.return5Y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.return5Y !== null ? (
                        <span className="flex items-center gap-1">
                          {fundDetails.return5Y >= 0 && <TrendingUp className="w-3 h-3" />}
                          {fundDetails.return5Y}%
                        </span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">10Y CAGR</div>
                    <div className={`font-bold text-sm ${fundDetails.return10Y !== null && fundDetails.return10Y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.return10Y !== null ? (
                        <span className="flex items-center gap-1">
                          {fundDetails.return10Y >= 0 && <TrendingUp className="w-3 h-3" />}
                          {fundDetails.return10Y}%
                        </span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Since Inception</div>
                    <div className={`font-bold text-sm ${fundDetails.returnSinceInception !== null && fundDetails.returnSinceInception >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fundDetails.returnSinceInception !== null ? (
                        <span className="flex items-center gap-1">
                          {fundDetails.returnSinceInception >= 0 && <TrendingUp className="w-3 h-3" />}
                          {fundDetails.returnSinceInception}%
                        </span>
                      ) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddFund}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Portfolio
              </button>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Failed to load fund details
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FundSearchBar;
