import React from 'react';
import { SimpleIcons } from './SimpleIcons';

const StatusIndicator = ({ isModelReady, modelError }) => {
  if (modelError) {
    return (
      <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
        <SimpleIcons.ExclamationCircle className="w-4 h-4" />
        <span>Service Error</span>
      </div>
    );
  }

  if (!isModelReady) {
    return (
      <div className="flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
        <SimpleIcons.Clock className="w-4 h-4" />
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
      <SimpleIcons.CheckCircle className="w-4 h-4" />
      <span>AI Ready</span>
    </div>
  );
};

export default StatusIndicator;
