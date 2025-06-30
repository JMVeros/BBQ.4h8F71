
import React from 'react';

// Updated BuyBackQ Logo with new SVG
const BuyBackQLogo: React.FC = () => (
    <div className="flex items-center space-x-2">
         <svg 
            width="25.5" 
            height="25.5" 
            viewBox="0 0 384 512" // New viewBox from Font Awesome icon
            xmlns="http://www.w3.org/2000/svg" 
            className="text-blue-500" // Keeps the blue color from Tailwind
            fill="currentColor" // Ensures the path is filled with the text color
        >
            <path d="M153.6 29.9l16-21.3C173.6 3.2 180 0 186.7 0C198.4 0 208 9.6 208 21.3V43.5c0 13.1 5.4 25.7 14.9 34.7L307.6 159C356.4 205.6 384 270.2 384 337.7C384 434 306 512 209.7 512H192C86 512 0 426 0 320v-3.8c0-48.8 19.4-95.6 53.9-130.1l3.5-3.5c4.2-4.2 10-6.6 16-6.6C85.9 176 96 186.1 96 198.6V288c0 35.3 28.7 64 64 64s64-28.7 64-64v-3.9c0-18-7.2-35.3-19.9-48l-38.6-38.6c-24-24-37.5-56.7-37.5-90.7c0-27.7 9-54.8 25.6-76.9z"/>
        </svg>
        <span className="text-xl font-bold text-blue-700">BuyBackQ</span>
    </div>
);


export const Header: React.FC = () => {
  const navItems = ['BBQ', 'User Maint', 'ATPC', 'Logout'];

  return (
    <header className="shadow-md" style={{ backgroundColor: '#F2F2F2' }}>
      {/* Removed 'container' class to ensure full width for justify-between to work as expected across page widths */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
            <img 
              src="https://i.ibb.co/cSNC1LJc/veros-logo-print-copy.png" 
              alt="Veros Credit Logo" 
              className="h-10 mr-6"
            />
            <nav className="flex space-x-1">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${item === 'BBQ' 
                    ? 'bg-gray-200 text-gray-800' // Active item, slightly darker than F2F2F2
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1`} 
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <BuyBackQLogo />
      </div>
      <div className="h-px bg-blue-600"></div>
    </header>
  );
};
