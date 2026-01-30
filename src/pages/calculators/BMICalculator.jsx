import React, { useState } from 'react';
import { SectionTitle } from '../../components/ui';
import { CalculatorLayout, InputField, ResultRow } from '../../components/calculators';
import { calculateBMI } from '../../utils/calculations';

const BMISpeedometer = ({ bmi, needleAngle, category, color }) => {
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const strokeWidth = 30;

  const createArc = (startAngle, endAngle, color) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const zones = [
    { start: 0, end: 52, color: '#3b82f6', label: 'Underweight', range: '<18.5' },
    { start: 52, end: 90, color: '#22c55e', label: 'Healthy', range: '18.5-24.9' },
    { start: 90, end: 120, color: '#f97316', label: 'Overweight', range: '25-29.9' },
    { start: 120, end: 180, color: '#ef4444', label: 'Obese', range: '>30' }
  ];

  const needleLength = radius - 20;
  const needleBase = 8;
  const needleRotation = needleAngle - 180;

  return (
    <div className="flex flex-col items-center mb-6">
      <svg width="300" height="180" viewBox="0 0 300 180" className="overflow-visible">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {zones.map((zone, index) => (
          <path
            key={index}
            d={createArc(zone.start, zone.end, zone.color)}
            fill="none"
            stroke={zone.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            opacity="0.9"
          />
        ))}

        {[10, 15, 18.5, 25, 30, 35, 40].map((value) => {
          const angle = ((value - 10) / 30) * 180;
          const tickStart = polarToCartesian(centerX, centerY, radius - strokeWidth / 2 - 5, angle);
          const tickEnd = polarToCartesian(centerX, centerY, radius - strokeWidth / 2 - 15, angle);
          const labelPos = polarToCartesian(centerX, centerY, radius - strokeWidth / 2 - 25, angle);
          
          return (
            <g key={value}>
              <line
                x1={tickStart.x}
                y1={tickStart.y}
                x2={tickEnd.x}
                y2={tickEnd.y}
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-slate-600"
              >
                {value}
              </text>
            </g>
          );
        })}

        <g
          style={{
            transform: `rotate(${needleRotation}deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={needleBase}
            fill="#1e293b"
            filter="url(#shadow)"
          />
          <polygon
            points={`${centerX},${centerY - needleBase} ${centerX + needleLength},${centerY} ${centerX},${centerY + needleBase}`}
            fill="#1e293b"
            filter="url(#shadow)"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={needleBase - 2}
            fill="#475569"
          />
        </g>

        <circle
          cx={centerX}
          cy={centerY}
          r={4}
          fill="#f1f5f9"
        />
      </svg>

      <div className="mt-4 text-center">
        <div className="text-4xl font-bold mb-1" style={{ color: color }}>
          {bmi}
        </div>
        <div className="text-lg font-semibold text-slate-700">
          {category}
        </div>
      </div>

      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        {zones.map((zone, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: zone.color }}
            />
            <span className="text-xs text-slate-600">
              {zone.label} ({zone.range})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BMICalculator = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const result = calculateBMI(weight, height);

  const inputs = (
    <>
      <InputField label="Weight" value={weight} onChange={setWeight} min={30} max={200} step={1} suffix=" kg" />
      <InputField label="Height" value={height} onChange={setHeight} min={100} max={250} step={1} suffix=" cm" />
    </>
  );

  const results = (
    <>
      <BMISpeedometer 
        bmi={result.bmi}
        needleAngle={result.needleAngle}
        category={result.category}
        color={result.color}
      />
      
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-2">Health Status</h3>
        <p className="text-slate-600 text-sm mb-3">{result.healthStatus}</p>
        <h3 className="font-semibold text-slate-800 mb-2">Recommendation</h3>
        <p className="text-slate-600 text-sm">{result.recommendation}</p>
      </div>
    </>
  );

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto animate-fade-in">
      <SectionTitle title="BMI Calculator" subtitle="Calculate your Body Mass Index and health status" />
      <CalculatorLayout
        inputs={inputs}
        results={results}
        showChart={false}
        disclaimer="BMI is a general indicator and may not account for muscle mass, bone density, and other factors. Consult a healthcare professional for personalized advice."
      />
    </section>
  );
};

export default BMICalculator;
