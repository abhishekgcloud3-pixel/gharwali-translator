import React from 'react';

const MicAnimation: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-1 h-6">
      <div className="w-1 bg-red-500 animate-bounce h-2" style={{ animationDelay: '0s' }}></div>
      <div className="w-1 bg-red-500 animate-bounce h-4" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-1 bg-red-500 animate-bounce h-3" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-1 bg-red-500 animate-bounce h-5" style={{ animationDelay: '0.3s' }}></div>
      <div className="w-1 bg-red-500 animate-bounce h-2" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default MicAnimation;
