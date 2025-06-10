
import { useState } from 'react';

interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const canShare = () => {
    return navigator.share !== undefined;
  };

  const shareNative = async (data: ShareData) => {
    if (!canShare()) {
      throw new Error('Compartilhamento nativo não suportado');
    }

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        throw error;
      }
      return false;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback para browsers antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  const shareWhatsApp = (message: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareEmail = (subject: string, body: string) => {
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };

  const shareLinkedIn = (url: string, title: string) => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank');
  };

  const share = async (data: ShareData, method: 'native' | 'whatsapp' | 'email' | 'linkedin' | 'copy' = 'native') => {
    setIsSharing(true);

    try {
      switch (method) {
        case 'native':
          return await shareNative(data);
        case 'whatsapp':
          shareWhatsApp(data.text);
          return true;
        case 'email':
          shareEmail(data.title, data.text);
          return true;
        case 'linkedin':
          shareLinkedIn(data.url || window.location.href, data.title);
          return true;
        case 'copy':
          return await copyToClipboard(data.text);
        default:
          throw new Error('Método de compartilhamento não suportado');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  return {
    share,
    canShare,
    isSharing,
    shareWhatsApp,
    shareEmail,
    shareLinkedIn,
    copyToClipboard
  };
};
