import './App.css'
import useAppStore from './store'
import Header from './components/Header'
import Notification from './components/Notification'
import CreatePanel from './components/CreatePanel'
import RetrievePanel from './components/RetrievePanel'
import Footer from './components/Footer'

function App() {
  const notification = useAppStore((state) => state.notification)
  const countdown = useAppStore((state) => state.countdown)
  const keyCopyStatus = useAppStore((state) => state.keyCopyStatus)
  const handleCopyKey = useAppStore((state) => state.handleCopyKey)
  const clearNotification = useAppStore((state) => state.clearNotification)

  return (
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
          onClose={clearNotification}
        />
      )}

      <main className="main-content">
        <CreatePanel />
        <RetrievePanel />
      </main>

      <Footer />
    </div>
  )
}

export default App
