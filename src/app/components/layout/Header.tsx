"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <span className="ml-2 text-sm text-gray-500">10X Engineered Materials</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">User</span>
            </button>
          </div>
          <div className="relative">
            {/* 10X Engineered Materials Logo */}
            <div className="relative h-10 w-32">
              <Image 
                src="/10X-Logo-Blue_White.png"
                alt="10X Engineered Materials Logo"
                fill
                sizes="128px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
