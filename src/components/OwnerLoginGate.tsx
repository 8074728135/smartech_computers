'use client';

import React from 'react';
import EnterpriseAuthModal from './EnterpriseAuthModal';

export default function OwnerLoginGate() {
  return (
    <EnterpriseAuthModal 
      isOpen={true} 
      defaultRole="owner" 
      isStandaloneGate={true} 
    />
  );
}
