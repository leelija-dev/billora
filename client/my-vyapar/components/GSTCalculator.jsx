"use client";

import React, { useState, useEffect } from 'react';

const GSTCalculator = () => {
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [gstType, setGstType] = useState('exclusive');
  const [results, setResults] = useState({
    gstAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    total: 0,
    taxableValue: 0
  });

  const gstRates = [
    { value: '0', label: 'Exempted', fullLabel: '0% (Exempted)', color: '#94a3b8', icon: '🆓' },
    { value: '0.25', label: 'Diamonds', fullLabel: '0.25% (Diamonds)', color: '#3b82f6', icon: '💎' },
    { value: '3', label: 'Gold', fullLabel: '3% (Gold)', color: '#f59e0b', icon: '🏆' },
    { value: '5', label: 'Essentials', fullLabel: '5% (Essentials)', color: '#10b981', icon: '🛒' },
    { value: '12', label: 'Standard', fullLabel: '12% (Standard)', color: '#8b5cf6', icon: '📦' },
    { value: '18', label: 'Most Goods', fullLabel: '18% (Most Goods)', color: '#ec4899', icon: '🛍️' },
    { value: '28', label: 'Luxury', fullLabel: '28% (Luxury)', color: '#ef4444', icon: '✨' }
  ];

  useEffect(() => {
    calculateGST();
  }, [amount, gstRate, gstType]);

  const calculateGST = () => {
    const numAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;
    
    let gstAmount = 0;
    let taxableValue = 0;
    let total = 0;

    if (gstType === 'exclusive') {
      taxableValue = numAmount;
      gstAmount = (numAmount * rate) / 100;
      total = numAmount + gstAmount;
    } else {
      total = numAmount;
      gstAmount = (numAmount * rate) / (100 + rate);
      taxableValue = numAmount - gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const igst = gstAmount;

    setResults({
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      igst: parseFloat(igst.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      taxableValue: parseFloat(taxableValue.toFixed(2))
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePresetClick = (value) => {
    setAmount(value.toString());
  };

  const resetCalculator = () => {
    setAmount('');
    setGstRate('18');
    setGstType('exclusive');
  };

  return (
    <div className="p-[30px] bg-gradient-to-r from-[#667eea] to-[#764ba2] min-h-[calc(100vh-80px)] font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] max-md:p-5">
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto mb-[30px] flex justify-between items-center bg-white/10 backdrop-blur-md rounded-[30px] p-[25px_35px] border border-white/20 max-lg:flex-col max-lg:gap-5 max-lg:text-center">
        <div className="flex-1">
          <h1 className="text-[42px] font-extrabold m-0 mb-2.5 flex items-center gap-4 text-white max-lg:justify-center max-md:text-3xl max-sm:text-2xl">
            <span className="text-5xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]">🧮</span>
            GST Calculator
          </h1>
          <p className="text-base text-white/90 m-0">
            Calculate Goods & Services Tax instantly with our smart calculator
          </p>
        </div>
        <div className="flex gap-[30px] bg-white/15 p-[15px_30px] rounded-[50px] max-lg:hidden">
          {[
            { value: '7', label: 'GST Rates' },
            { value: '2', label: 'Modes' },
            { value: '24/7', label: 'Free Access' }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/80 uppercase tracking-[0.5px]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-[1.2fr_0.8fr] gap-[30px] max-lg:grid-cols-1">
        {/* Left Panel - Input */}
        <div className="bg-white rounded-[40px] p-[35px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 max-md:p-6">
          <div className="flex justify-between items-center mb-[30px]">
            <h2 className="text-[28px] font-bold text-[#1e293b] m-0 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[50px] after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2] after:rounded-sm max-md:text-2xl">
              Enter Details
            </h2>
            <button 
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] border-none rounded-[30px] text-white font-semibold text-sm cursor-pointer transition-all duration-300 shadow-[0_5px_15px_rgba(102,126,234,0.3)] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(102,126,234,0.5)] group"
              onClick={resetCalculator}
            >
              <span className="text-base transition-transform duration-500 group-hover:rotate-360">↻</span>
              Reset
            </button>
          </div>

          {/* Amount Card */}
          <div className="bg-[#f8fafc] rounded-[25px] p-6 mb-6 transition-all duration-300 border-2 border-transparent hover:border-[#667eea] hover:bg-white hover:shadow-[0_10px_30px_rgba(102,126,234,0.1)]">
            <label className="flex items-center gap-2.5 font-semibold text-[#1e293b] mb-5 text-lg">
              <span className="text-2xl">💰</span>
              Amount
            </label>
            <div className="flex items-center gap-4 mb-5 max-sm:flex-col">
              <span className="px-5 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold rounded-[15px] text-base shadow-[0_5px_15px_rgba(102,126,234,0.3)] max-sm:w-full max-sm:text-center">
                INR
              </span>
              <input
                type="text"
                className="flex-1 p-4 border-2 border-[#e2e8f0] rounded-[15px] text-xl font-semibold text-[#1e293b] outline-none transition-all duration-300 focus:border-[#667eea] focus:shadow-[0_0_0_4px_rgba(102,126,234,0.1)] max-sm:w-full"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {[1000, 5000, 10000, 50000].map((preset) => (
                <button
                  key={preset}
                  className="px-5 py-2.5 bg-white border-2 border-[#e2e8f0] rounded-[30px] font-semibold text-[#475569] cursor-pointer transition-all duration-300 text-sm hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:border-transparent hover:text-white hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)]"
                  onClick={() => handlePresetClick(preset)}
                >
                  ₹{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Selection */}
          <div className="bg-[#f8fafc] rounded-[25px] p-6 mb-6 transition-all duration-300 border-2 border-transparent hover:border-[#667eea] hover:bg-white hover:shadow-[0_10px_30px_rgba(102,126,234,0.1)]">
            <label className="flex items-center gap-2.5 font-semibold text-[#1e293b] mb-5 text-lg">
              <span className="text-2xl">📊</span>
              GST Rate
            </label>
            <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
              {gstRates.map((rate) => (
                <button
                  key={rate.value}
                  className={`p-4 border-2 rounded-[20px] cursor-pointer transition-all duration-300 flex flex-col items-center gap-2 bg-white hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] ${
                    gstRate === rate.value 
                      ? 'text-white' 
                      : ''
                  }`}
                  style={{
                    borderColor: rate.color,
                    background: gstRate === rate.value ? rate.color : 'white'
                  }}
                  onClick={() => setGstRate(rate.value)}
                >
                  <span className="text-2xl">{rate.icon}</span>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`font-bold text-base ${gstRate === rate.value ? 'text-white' : 'text-[#1e293b]'}`}>
                      {rate.value}%
                    </span>
                    <span className={`text-[11px] text-center ${gstRate === rate.value ? 'text-white/90' : 'text-[#64748b]'}`}>
                      {rate.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Type */}
          <div className="bg-[#f8fafc] rounded-[25px] p-6 transition-all duration-300 border-2 border-transparent hover:border-[#667eea] hover:bg-white hover:shadow-[0_10px_30px_rgba(102,126,234,0.1)]">
            <label className="flex items-center gap-2.5 font-semibold text-[#1e293b] mb-5 text-lg">
              <span className="text-2xl">🔄</span>
              Calculation Type
            </label>
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              {[
                { type: 'exclusive', icon: '➕', title: 'Exclusive', desc: 'GST added to amount' },
                { type: 'inclusive', icon: '✅', title: 'Inclusive', desc: 'GST included in amount' }
              ].map((item) => (
                <button
                  key={item.type}
                  className={`p-5 border-2 rounded-[20px] cursor-pointer transition-all duration-300 flex items-center gap-4 bg-white text-left hover:border-[#667eea] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(102,126,234,0.1)] ${
                    gstType === item.type 
                      ? 'border-[#667eea] bg-gradient-to-r from-[#f0f4ff] to-[#f5f0ff]' 
                      : 'border-[#e2e8f0]'
                  }`}
                  onClick={() => setGstType(item.type)}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-base text-[#1e293b]">{item.title}</span>
                    <span className="text-xs text-[#64748b]">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[40px] p-[35px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 max-md:p-6">
          <h2 className="text-[28px] font-bold text-white m-0 mb-[30px] relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[50px] after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2] after:rounded-sm max-md:text-2xl">
            Results
          </h2>

          {/* Main Results */}
          <div className="grid grid-cols-1 gap-4 mb-[30px]">
            {[
              { label: 'Taxable Value', value: results.taxableValue, icon: '📋', gradient: 'from-[#667eea] to-[#764ba2]' },
              { label: 'GST Amount', value: results.gstAmount, icon: '💰', gradient: 'from-[#667eea] to-[#764ba2]' },
              { label: 'Total Amount', value: results.total, icon: '💵', gradient: 'from-[#10b981] to-[#34d399]' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-5 p-5 bg-white/10 rounded-[20px] border border-white/10 transition-all duration-300 backdrop-blur-[5px] hover:bg-white/15 hover:translate-x-1 hover:border-white/30"
              >
                <span className="text-3xl drop-shadow-[0_5px_10px_rgba(0,0,0,0.3)]">{item.icon}</span>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-base text-white/80 font-medium">{item.label}</span>
                  <span className={`text-[28px] font-extrabold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent max-md:text-2xl`}>
                    ₹{item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tax Split */}
          <div className="bg-white/5 rounded-[25px] p-6 mb-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-5">Tax Breakdown</h3>
            <div className="flex flex-col gap-5">
              {[
                { label: 'CGST', percentage: '50%', value: results.cgst, gradient: 'from-[#3b82f6] to-[#8b5cf6]' },
                { label: 'SGST', percentage: '50%', value: results.sgst, gradient: 'from-[#ec4899] to-[#f43f5e]' },
                { label: 'IGST', percentage: '100%', value: results.igst, gradient: 'from-[#f59e0b] to-[#f97316]' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm text-white/80">
                    <span>{item.label}</span>
                    <span className="text-[#667eea] font-semibold">{item.percentage}</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-[10px] overflow-hidden">
                    <div 
                      className={`h-full rounded-[10px] transition-all duration-500 bg-gradient-to-r ${item.gradient}`}
                      style={{ width: item.percentage }}
                    ></div>
                  </div>
                  <span className="text-base font-semibold text-white text-right">₹{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-[30px] text-sm text-white/90 border border-white/10">
              <span>📌</span>
              <span>{gstType === 'exclusive' ? 'GST will be added' : 'GST is included'}</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-[30px] text-sm text-white/90 border border-white/10">
              <span>⚡</span>
              <span>Rate: {gstRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="max-w-[1400px] mx-auto mt-[30px] bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-[30px] p-[25px_35px] flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/20 max-md:flex-col max-md:gap-4 max-md:text-center">
        <div className="flex items-center gap-4">
          <span className="text-3xl">✨</span>
          <span className="text-white text-lg font-medium">Try Vyapar's full-featured GST billing software for free</span>
        </div>
        <button className="px-9 py-3 bg-white border-none rounded-[30px] font-bold text-base text-[#667eea] cursor-pointer transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default GSTCalculator;