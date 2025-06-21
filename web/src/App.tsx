import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [paste, setPaste] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successKey, setSuccessKey] = useState<string | null>(null)
  const [keyCopyStatus, setKeyCopyStatus] = useState('Copy')
  const [contentCopyStatus, setContentCopyStatus] = useState('Copy')

  const [createContent, setCreateContent] = useState('')
  const [createExpires, setCreateExpires] = useState('')
  const [retrieveKey, setRetrieveKey] = useState('')

  const handleCreatePaste = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessKey(null)
    setKeyCopyStatus('Copy')
    try {
      const res = await fetch('/api/v1/pastes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: createContent, expires: createExpires }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        setSuccessKey(data.data.key)
        setCreateContent('')
        setCreateExpires('')
      } else {
        setError(data.message || 'Failed to create paste')
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchPaste = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPaste(null)
    setContentCopyStatus('Copy')
    try {
      const res = await fetch(`/api/v1/pastes/${retrieveKey}`)
      const data = await res.json()
      if (res.ok && data.status === 'success') {
        setPaste(data.data.content)
      } else {
        setError('content not found')
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = () => {
    if (successKey) {
      navigator.clipboard.writeText(successKey)
      setKeyCopyStatus('Copied!')
      setTimeout(() => setKeyCopyStatus('Copy'), 2000)
    }
  }

  const handleCopyContent = () => {
    if (paste) {
      navigator.clipboard.writeText(paste)
      setContentCopyStatus('Copied!')
      setTimeout(() => setContentCopyStatus('Copy'), 2000)
    }
  }

  const handleClearPaste = () => {
    setPaste(null)
    setRetrieveKey('')
  }

  const handleCloseSuccess = () => {
    setSuccessKey(null)
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">GoBin</h1>
        <p className="subtitle">simple paste bin</p>
        <a
          href="https://github.com/michaelwp/gobin"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="github-icon"
          >
            <title>GitHub</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span>GitHub</span>
        </a>
      </header>

      {error && <div className="error-message">{error}</div>}
      {successKey && (
        <div className="success-message">
          <span>
            Paste created! Key:{' '}
            <span className="success-key">{successKey}</span>
          </span>
          <div className="success-actions">
            <button onClick={handleCopyKey} className="copy-btn">
              {keyCopyStatus}
            </button>
            <button onClick={handleCloseSuccess} className="close-btn">
              &times;
            </button>
          </div>
        </div>
      )}

      <main className="main-content">
        {/* Create Panel */}
        <div className="panel">
          <form onSubmit={handleCreatePaste} className="panel-form">
            <textarea
              className="text-area"
              placeholder="enter the text here"
              value={createContent}
              onChange={(e) => setCreateContent(e.target.value)}
              required
            />
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

        {/* Retrieve Panel */}
        <div className="panel">
          <div className="panel-display">
            <div className="text-display-area">
              {paste ? (
                <>
                  <div className="floating-actions">
                    <button onClick={handleCopyContent} className="floating-btn">
                      {contentCopyStatus}
                    </button>
                    <button onClick={handleClearPaste} className="floating-btn">
                      Clear
                    </button>
                  </div>
                  <pre>{paste}</pre>
                </>
              ) : (
                <span className="placeholder-text">the text will appeared here</span>
              )}
            </div>
            <form onSubmit={handleFetchPaste} className="retrieve-form">
              <input
                type="text"
                className="input-field"
                placeholder="enter the key here"
                value={retrieveKey}
                onChange={(e) => setRetrieveKey(e.target.value)}
                required
              />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'retrieving...' : 'retrieve'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} GoBin
      </footer>
    </div>
  )
}

export default App
