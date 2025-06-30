import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  buttonDisplayClassName?: string;
  buttonTextClassName?: string;
  dropdownPanelClassName?: string; // Optional: A class string for the dropdown panel. If not provided, a default will be used.
  optionItemClassName?: string;
  choosePlaceholderValue?: string;
  direction?: 'up' | 'down'; // New prop
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  id,
  buttonDisplayClassName = "w-full appearance-none bg-white border border-gray-300 px-2 py-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center",
  buttonTextClassName,
  dropdownPanelClassName: userProvidedPanelClassName, // Capture what user passes
  optionItemClassName = "px-3 py-2 text-[12px] text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer",
  choosePlaceholderValue,
  direction = 'down', // Default direction
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayValue = value || placeholder;
  const isPlaceholderSelected = choosePlaceholderValue && (value === choosePlaceholderValue || !value && placeholder === choosePlaceholderValue);

  const computedButtonTextClassName = `flex-grow truncate text-left ${
    isPlaceholderSelected ? 'text-gray-500' : 'text-gray-700'
  }`;

  let finalPanelClassName: string;
  if (userProvidedPanelClassName) {
    // If user provides classes, they take full responsibility.
    // The 'direction' prop might not have an effect unless their classes are designed for it.
    finalPanelClassName = userProvidedPanelClassName;
  } else {
    // Construct default classes, incorporating direction
    const baseClasses = "absolute z-20 w-full bg-white border border-gray-300 rounded-md max-h-[50vh] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none";
    const positionClasses = direction === 'up' ? 'bottom-full mb-1' : 'mt-1';
    finalPanelClassName = `${baseClasses} ${positionClasses}`;
  }

  return (
    <div className="relative w-full" ref={dropdownRef} id={id}>
      <button
        type="button"
        className={buttonDisplayClassName}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={buttonTextClassName || computedButtonTextClassName}>{displayValue}</span>
        <ChevronDownIcon className={`ml-1 w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={finalPanelClassName}
          role="listbox"
          aria-activedescendant={value ? `option-${options.indexOf(value)}` : undefined}
        >
          {options.map((option, index) => (
            <div
              key={option}
              id={`option-${index}`}
              className={`${optionItemClassName} ${
                option === value && value !== choosePlaceholderValue ? 'bg-blue-100 font-semibold text-blue-700' : ''
              } ${
                option === choosePlaceholderValue ? 'text-gray-500' : ''
              }`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option === value}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
