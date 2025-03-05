import React from 'react';

interface LogoProps {
  className?: string;
}

const TenXLogo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg width="200" height="32" viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* 10 */}
          <path d="M4 4H10V28H4V4Z" fill="#2196F3" />
          <path d="M12 4H26V10H12V4Z" fill="#2196F3" />
          <path d="M12 22H26V28H12V22Z" fill="#2196F3" />
          <path d="M20 10H26V22H20V10Z" fill="#2196F3" />
          
          {/* X */}
          <path d="M30 4L40 16L30 28H38L48 16L38 4H30Z" fill="#2196F3" />
          
          {/* ENGINEERED MATERIALS */}
          <g fill="white">
            <path d="M55 10H75V12H55V10Z" />
            <path d="M55 12H57V20H55V12Z" />
            <path d="M55 20H75V22H55V20Z" />
            
            <path d="M80 10H82V22H80V10Z" />
            <path d="M80 10H90V12H80V10Z" />
            <path d="M80 16H88V18H80V16Z" />
            <path d="M80 20H90V22H80V20Z" />
            
            <path d="M95 10H105V12H95V10Z" />
            <path d="M95 12H97V22H95V12Z" />
            
            <path d="M110 10H120V12H110V10Z" />
            <path d="M110 12H112V22H110V12Z" />
            <path d="M110 16H118V18H110V16Z" />
            <path d="M110 20H120V22H110V20Z" />
            
            <path d="M125 10H135V12H125V10Z" />
            <path d="M125 12H127V22H125V12Z" />
            <path d="M125 20H135V22H125V20Z" />
            <path d="M133 12H135V20H133V12Z" />
            
            <path d="M140 10H150V12H140V10Z" />
            <path d="M140 12H142V22H140V12Z" />
            <path d="M140 16H148V18H140V16Z" />
            
            <path d="M155 10H165V12H155V10Z" />
            <path d="M155 12H157V22H155V12Z" />
            <path d="M155 20H165V22H155V20Z" />
            <path d="M163 12H165V20H163V12Z" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default TenXLogo;
