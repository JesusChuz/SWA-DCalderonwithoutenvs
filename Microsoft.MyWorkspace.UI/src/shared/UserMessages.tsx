import { useEffect, useState } from 'react';

const retrieveMessages = () => {
  let stored: string = window.localStorage.getItem('userMessages') ?? '';
  if (!stored) {
    stored = JSON.stringify([]);
    window.localStorage.setItem('userMessages', stored);
  }
  return stored;
};

export const useUserMessages = (): string[] => {
  const getUserMessagesDismissed = () => {
    return JSON.parse(retrieveMessages());
  };

  const [settings, setSettings] = useState(getUserMessagesDismissed);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getUserMessagesDismissed());
    };

    window.addEventListener('userMessages', handleUpdate);
    return () => window.removeEventListener('userMessages', handleUpdate);
  }, []);

  return settings;
};

export const setUserMessageRead = (messageId: string): void => {
  const stored: string[] = JSON.parse(
    window.localStorage.getItem('userMessages') ?? '[]'
  );
  stored.push(messageId);
  window.localStorage.setItem('userMessages', JSON.stringify(stored));
  window.dispatchEvent(new Event('userMessages'));
};
