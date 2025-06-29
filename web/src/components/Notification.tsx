import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  countdown: number;
  successKey?: string;
  keyCopyStatus: string;
  onCopyKey: () => void;
  onCopyUrl?: () => void;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  countdown,
  successKey,
  keyCopyStatus,
  onCopyKey,
  onCopyUrl,
  onClose,
}) => {
  // Parse the message to extract key and URL for styling
  const renderMessage = () => {
    if (type === 'success' && message.includes('Key:') && message.includes('direct url:')) {
      const parts = message.split(', or direct url: ');
      const keyPart = parts[0].split('Key: ')[1];
      const urlPart = parts[1];

      return (
        <span>
          Paste created! Key: <span className="notification-key">{keyPart}</span>, or direct url: <span className="notification-url">{urlPart}</span>
        </span>
      );
    }
    return message;
  };

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        {renderMessage()}
      </div>
      <div className="notification-actions">
        <span className="countdown">({countdown}s)</span>
        {type === 'success' && successKey && (
          <>
            <button onClick={onCopyKey} className="copy-btn">
              {keyCopyStatus}
            </button>
            {onCopyUrl && (
              <button onClick={onCopyUrl} className="copy-btn">
                Copy URL
              </button>
            )}
          </>
        )}
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
