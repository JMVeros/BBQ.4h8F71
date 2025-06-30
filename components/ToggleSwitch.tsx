import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  color?: 'green' | 'gray';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle, color = 'green' }) => {
  const bgColor = isOn ? (color === 'green' ? 'bg-green-500' : 'bg-gray-500') : 'bg-gray-300';
  // Updated circlePosition for more internal padding
  const circlePosition = isOn ? 'translate-x-4' : 'translate-x-1';

  return (
    <button
      onClick={handleToggle}
      // Updated track dimensions: h-7 (28px), w-10 (40px)
      // Removed focus:ring-offset-2 to prevent double border effect
      className={`relative inline-flex items-center h-7 rounded-full w-10 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${isOn ? (color === 'green' ? 'focus:ring-green-400' : 'focus:ring-gray-400') : 'focus:ring-gray-400'} ${bgColor}`}
    >
      <span className="sr-only">Toggle</span>
      <span
        // Circle dimensions remain w-5 h-5 (20x20px)
        className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${circlePosition}`}
      />
    </button>
  );
};