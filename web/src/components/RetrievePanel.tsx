import React from 'react';
import useAppStore from '../store';

const RetrievePanel: React.FC = () => {
  const {
    paste,
    retrieveKey,
    loading,
    contentCopyStatus,
    setRetrieveKey,
    handleFetchPaste,
    handleCopyContent,
    handleClearPaste,
    handlePasteKeyFromClipboard,
    handleClearRetrieveKey,
  } = useAppStore();

  return (
    <div className="panel">
      <div className="panel-display">
        <div className="display-area-wrapper">
          <textarea
            readOnly
            className="display-textarea"
            value={paste || ''}
            placeholder="the text will appeared here"
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleFetchPaste();
          }}
          className="retrieve-form"
        >
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder="enter the key here"
              value={retrieveKey}
              onChange={(e) => setRetrieveKey(e.target.value)}
              required
            />
            <div className="floating-actions-left">
              <button
                type="button"
                onClick={() => void handlePasteKeyFromClipboard()}
                className="floating-btn"
              >
                Paste
              </button>
              {retrieveKey && (
                <button
                  type="button"
                  onClick={handleClearRetrieveKey}
                  className="floating-btn"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'retrieving...' : 'retrieve'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RetrievePanel;
