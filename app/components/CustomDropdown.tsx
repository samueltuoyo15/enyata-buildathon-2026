"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomDropdownProps<T> {
 label: string;
 options: T[];
 selected: T;
 onChange: (option: T) => void;
 renderItem: (option: T) => React.ReactNode;
 renderSelected: (option: T) => React.ReactNode;
 keyExtractor: (option: T) => string | number;
 disabled?: boolean;
}

export default function CustomDropdown<T>({
 label,
 options,
 selected,
 onChange,
 renderItem,
 renderSelected,
 keyExtractor,
 disabled = false
}: CustomDropdownProps<T>) {
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
   if (
    dropdownRef.current &&
    !dropdownRef.current.contains(event.target as Node)
   ) {
    setIsOpen(false);
   }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 return (
  <div className="relative w-full" ref={dropdownRef}>
   <label className="block mb-2 font-bold text-xs uppercase tracking-wider text-text-main">
    {label}
   </label>

   {/* Trigger */}
   <button
    type="button"
    disabled={disabled}
    onClick={() => setIsOpen(!isOpen)}
    className={`brutal-input flex items-center justify-between min-h-[52px] transition-all bg-surface
          ${isOpen ? "shadow-brutal-sm translate-x-[2px] translate-y-[2px] border-primary-dark" : ""} 
          ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:border-primary-dark"}
        `}
   >
    <div className="font-bold text-sm truncate mr-2">
     {renderSelected(selected)}
    </div>
    <ChevronDown
     size={20}
     className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
   </button>

   {/* Popover List */}
   {isOpen && !disabled && (
    <div className="absolute z-[100] w-full mt-2 bg-white border-brutal border-black rounded-brutal shadow-brutal max-h-[250px] overflow-y-auto">
     {options.map(option => {
      const isSelected = keyExtractor(option) === keyExtractor(selected);
      return (
       <div
        key={keyExtractor(option)}
        onClick={() => {
         onChange(option);
         setIsOpen(false);
        }}
        className={`flex items-center justify-between px-4 py-4 cursor-pointer font-bold border-b-2 border-black last:border-b-0 transition-all ${isSelected ? "bg-primary" : "hover:bg-secondary"}
                `}
       >
        <div className="flex-1">{renderItem(option)}</div>
        {isSelected && <Check size={18} strokeWidth={4} className="ml-2" />}
       </div>
      );
     })}
    </div>
   )}
  </div>
 );
}
