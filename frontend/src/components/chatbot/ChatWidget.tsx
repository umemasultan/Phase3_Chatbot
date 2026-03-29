'use client';

import React from 'react';
import { ChatPanel } from './ChatPanel';

type ChatWidgetProps = {
  userId: string;
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ userId }) => {
  return <ChatPanel userId={userId} isOpen={true} onClose={() => {}} />;
};