
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Camera } from 'lucide-react';

interface SmoothFunctionBarProps {
  onFunctionChange: (expr: string) => void;
  isValid: boolean;
  currentValue: string;
  onUploadClick?: () => void;
}

const SmoothFunctionBar: React.FC<SmoothFunctionBarProps> = ({ onFunctionChange, isValid, currentValue, onUploadClick }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(currentValue);
  }, [currentValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onFunctionChange(inputValue);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      <div className={`absolute -inset-1 bg-gradient-to-r from-[#A8C69F] to-[#FFD1DC] rounded-[2.5rem] blur opacity-30 transition duration-1000 ${isFocused ? 'opacity-60' : ''}`}></div>
      
      <div className={`relative flex items-center bg-white/95 border-2 backdrop-blur-sm ${isValid ? (isFocused ? 'border-[#FFD1DC]' : 'border-white') : 'border-rose-400'} rounded-[2rem] shadow-xl transition-all duration-500`}>
        <div className="flex items-center pl-8 pr-3 py-5">
           <span className="text-2xl font-black italic text-[#A8C69F] pr-2">f(x,y) =</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Enter recipe (e.g. x^2 - y^2)..."
          className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-[#4A5A4B] font-black py-5 placeholder-[#A8C69F]/30"
        />

        <div className="flex items-center gap-3 pr-5">
          {onUploadClick && (
            <button 
              onClick={onUploadClick}
              className="p-3 bg-[#FDF2F2] hover:bg-[#FFD1DC] rounded-full text-[#FFB7C5] transition-colors"
              title="Snap recipe"
            >
              <Camera className="w-6 h-6" />
            </button>
          )}
          <button 
            onClick={() => onFunctionChange(inputValue)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all duration-500 transform ${
                isFocused 
                ? 'bg-[#FFD1DC] text-white shadow-lg scale-105' 
                : 'bg-[#A8C69F] text-white'
            }`}
          >
            Brew <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmoothFunctionBar;
