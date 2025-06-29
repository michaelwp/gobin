import './App.css'
import useAppStore from './store'
import Header from './components/Header'
import Notification from './components/Notification'
import CreatePanel from './components/CreatePanel'
import RetrievePanel from './components/RetrievePanel'
import KeyRoute from './components/KeyRoute'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

function App() {
  const notification = useAppStore((state) => state.notification)
  const countdown = useAppStore((state) => state.countdown)
  const keyCopyStatus = useAppStore((state) => state.keyCopyStatus)
  const handleCopyKey = useAppStore((state) => state.handleCopyKey)
  const handleCopyUrl = useAppStore((state) => state.handleCopyUrl)
  const clearNotification = useAppStore((state) => state.clearNotification)

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('darkMode')
    return stored ? JSON.parse(stored) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleToggleDarkMode = () => setDarkMode((d) => !d)

  return (
    <>
      <button
        className="dark-toggle-btn"
        onClick={handleToggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
      <div className="container">
        <Header />

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            countdown={countdown}
            successKey={notification.key}
            keyCopyStatus={keyCopyStatus}
            onCopyKey={handleCopyKey}
            onCopyUrl={handleCopyUrl}
            onClose={clearNotification}
          />
        )}

        <Routes>
          <Route path="/" element={
            <main className="main-content">
              <CreatePanel />
              <RetrievePanel />
            </main>
          } />
          <Route path="/:key" element={<KeyRoute />} />
        </Routes>

        <Footer />
      </div>
    </>
  )
}

export default App
