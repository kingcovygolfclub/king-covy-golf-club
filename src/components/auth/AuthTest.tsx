'use client';

import React, { useState, useEffect } from 'react';

const AuthTest: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const access = sessionStorage.getItem('siteAccess');
    setHasAccess(access === 'granted');
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-[10000] text-sm">
      <div>Auth Status: {hasAccess ? '✅ GRANTED' : '❌ DENIED'}</div>
      <div>Client: {isClient ? '✅ YES' : '❌ NO'}</div>
      <button
        onClick={() => {
          sessionStorage.removeItem('siteAccess');
          setHasAccess(false);
        }}
        className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
      >
        Reset Auth
      </button>
    </div>
  );
};

export default AuthTest;
