import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  countdown: number;
  successKey?: string;
  keyCopyStatus: string;
  onCopyKey: () => void;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  countdown,
  successKey,
  keyCopyStatus,
  onCopyKey,
  onClose,
}) => {
  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        {message}{' '}
        {type === 'success' && successKey && (
          <span className="success-key">{successKey}</span>
        )}
      </div>
      <div className="notification-actions">
        <span className="countdown">({countdown}s)</span>
        {type === 'success' && (
          <button onClick={onCopyKey} className="copy-btn">
            {keyCopyStatus}
          </button>
        )}
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
