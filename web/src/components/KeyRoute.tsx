import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppStore from '../store';

const KeyRoute: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const {
    paste,
    loading,
    contentCopyStatus,
    handleFetchPasteByKey,
    handleCopyContent,
    handleClearPaste,
  } = useAppStore();

  useEffect(() => {
    if (key) {
      void handleFetchPasteByKey(key);
    }
  }, [key, handleFetchPasteByKey]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-display">
          <div className="display-area-wrapper">
            <textarea
              readOnly
              className="display-textarea"
              value={paste || ''}
              placeholder="Content not found or expired"
            />
            {paste && (
              <div className="floating-actions">
                <button onClick={handleCopyContent} className="floating-btn">
                  {contentCopyStatus}
                </button>
                <button onClick={handleClearPaste} className="floating-btn">
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="key-info">
            <p>Key: <strong>{key}</strong></p>
            <button onClick={handleGoHome} className="btn">
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyRoute;
