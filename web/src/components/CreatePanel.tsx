import React from 'react';
import useAppStore from '../store';

const CreatePanel: React.FC = () => {
  const {
    createContent,
    createExpires,
    loading,
    setCreateContent,
    setCreateExpires,
    handleCreatePaste,
    handlePasteFromClipboard,
    handleClearCreate,
  } = useAppStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleCreatePaste();
  };

  return (
    <div className="panel">
      <form
        onSubmit={handleSubmit}
        className="panel-form"
      >
        <div className="display-area-wrapper">
          <textarea
            className="text-area"
            placeholder="enter the text here"
            value={createContent}
            onChange={(e) => setCreateContent(e.target.value)}
            required
          />
          <div className="floating-actions">
            <button
              type="button"
              onClick={() => void handlePasteFromClipboard()}
              className="floating-btn"
            >
              Paste
            </button>
            {createContent && (
              <button
                type="button"
                onClick={handleClearCreate}
                className="floating-btn"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <input
          type="date"
          className="input-field"
          value={createExpires}
          onChange={(e) => setCreateExpires(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'creating...' : 'create'}
        </button>
      </form>
    </div>
  );
};

export default CreatePanel;
