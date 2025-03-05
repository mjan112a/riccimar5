"use client";

import React from 'react';
import Header from '../components/layout/Header';
import Chat from '../components/Chat';

export default function AIAssistant() {
  return (
    <>
      <Header title="AI Assistant" />
      <main className="flex-1 overflow-hidden flex flex-col p-6">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">10X Materials AI Assistant</h2>
            <p className="text-sm text-gray-600">
              Ask questions about company metrics, sales data, or get help analyzing trends.
              The assistant has access to your business data and can provide insights and recommendations.
            </p>
          </div>

          <div className="flex-1 mb-4">
            <Chat />
          </div>
        </div>
      </main>
    </>
  );
}
