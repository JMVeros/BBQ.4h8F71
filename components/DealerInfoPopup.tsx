
import React, { useEffect, useRef } from 'react';
import { Application } from '../types';

interface DealerInfoPopupProps {
  application: Application;
  position: { top: number; left: number };
  onClose: () => void;
}

export const DealerInfoPopup: React.FC<DealerInfoPopupProps> = ({ application, position, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const renderInfoRow = (label: string, value: string | React.ReactNode) => (
    <div className="py-1 flex"> {/* Always use flex for consistent alignment */}
      <span className="text-xs text-gray-500 w-1/4 shrink-0">{label}</span> {/* Added shrink-0 to prevent label from shrinking */}
      {typeof value === 'string' ? (
        <p className="text-xs font-semibold text-gray-800 flex-1 break-words">{value}</p>
      ) : (
        <div className="text-xs font-semibold text-gray-800 flex-1 break-words">{value}</div>
      )}
    </div>
  );

  return (
    <div
      ref={popupRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed bg-white rounded-md shadow-xl p-3 w-72 z-[100]" // Increased z-index
      role="dialog"
      aria-labelledby="dealer-info-popup-title"
    >
      {/* Pointer */}
      <div 
        className="absolute top-1/2 -left-[9px] transform -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderRight: '10px solid white', // Must match popup background
          filter: 'drop-shadow(-2px 0px 1px rgba(0,0,0,0.1))' // Optional: attempt to match shadow
        }}
      ></div>
      
      <div id="dealer-info-popup-title" className="sr-only">Dealer Information</div>

      {renderInfoRow("Name", `${application.dealer} (${application.dealerIdNum})`)}
      {renderInfoRow("Type", application.dealerType)}
      {renderInfoRow("Address", 
        <>
          <div>{application.dealerAddressLine1}</div>
          <div>{application.dealerAddressLine2}</div>
        </>
      )}
      {renderInfoRow("Phone", application.dealerPhone)}
      {renderInfoRow("Email", application.dealerEmail)}
    </div>
  );
};
