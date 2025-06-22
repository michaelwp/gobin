import { create } from 'zustand';

// --- TYPE DEFINITIONS ---
interface NotificationData {
  message: string;
  type: 'success' | 'error';
  key?: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    key?: string;
    content?: string;
  };
}

interface AppState {
  // State
  loading: boolean;
  paste: string | null;
  notification: NotificationData | null;
  countdown: number;
  keyCopyStatus: string;
  contentCopyStatus: string;
  createContent: string;
  createExpires: string;
  retrieveKey: string;

  // Actions
  setCreateContent: (content: string) => void;
  setCreateExpires: (expires: string) => void;
  setRetrieveKey: (key: string) => void;
  showNotification: (message: string, type: 'success' | 'error', key?: string) => void;
  clearNotification: () => void;
  handleCreatePaste: () => Promise<void>;
  handleFetchPaste: () => Promise<void>;
  handleCopyKey: () => void;
  handleCopyContent: () => void;
  handleClearPaste: () => void;
  handleClearCreate: () => void;
  handlePasteFromClipboard: () => Promise<void>;
  handlePasteKeyFromClipboard: () => Promise<void>;
  handleClearRetrieveKey: () => void;
}

// --- STORE IMPLEMENTATION ---
const useAppStore = create<AppState>((set, get) => {
  let notificationTimeout: number | null = null;
  let countdownInterval: number | null = null;

  const clearNotification = () => {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    if (countdownInterval) clearInterval(countdownInterval);
    set({ notification: null, countdown: 0 });
  };

  return {
    // Initial State
    loading: false,
    paste: null,
    notification: null,
    countdown: 0,
    keyCopyStatus: 'Copy',
    contentCopyStatus: 'Copy',
    createContent: '',
    createExpires: '',
    retrieveKey: '',

    // --- STATE SETTERS ---
    setCreateContent: (content) => set({ createContent: content }),
    setCreateExpires: (expires) => set({ createExpires: expires }),
    setRetrieveKey: (key) => set({ retrieveKey: key }),

    // --- NOTIFICATION ACTIONS ---
    showNotification: (message, type, key) => {
      clearNotification();
      set({ notification: { message, type, key }, countdown: 60 });

      countdownInterval = window.setInterval(() => {
        set((state) => ({ countdown: state.countdown - 1 }));
      }, 1000);

      notificationTimeout = window.setTimeout(clearNotification, 60000);
    },
    clearNotification,

    // --- API ACTIONS ---
    handleCreatePaste: async () => {
      set({ loading: true, keyCopyStatus: 'Copy' });
      const { createContent, createExpires, showNotification } = get();
      try {
        const res = await fetch('/api/v1/pastes/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: createContent, expires: createExpires }),
        });
        const data = (await res.json()) as ApiResponse;
        if (data.status === 'success') {
          showNotification('Paste created! Key:', 'success', data.data?.key);
          set({ createContent: '', createExpires: '' });
        } else {
          showNotification(data.message || 'Failed to create paste', 'error');
        }
      } catch (error) {
        console.error('Create paste error:', error);
        showNotification('Network error', 'error');
      } finally {
        set({ loading: false });
      }
    },

    handleFetchPaste: async () => {
      set({ loading: true, paste: null, contentCopyStatus: 'Copy' });
      const { retrieveKey, showNotification } = get();
      try {
        const res = await fetch(`/api/v1/pastes/${retrieveKey}`);
        const data = (await res.json()) as ApiResponse;
        if (res.ok && data.status === 'success') {
          set({ paste: data.data?.content ?? null });
          clearNotification();
        } else {
          showNotification('content not found', 'error');
        }
      } catch (error) {
        console.error('Fetch paste error:', error);
        showNotification('Network error', 'error');
      } finally {
        set({ loading: false });
      }
    },

    // --- UI ACTIONS ---
    handleCopyKey: () => {
      const { notification } = get();
      if (notification?.key) {
        navigator.clipboard.writeText(notification.key).catch((err) => {
          console.error('Could not copy key: ', err);
        });
        set({ keyCopyStatus: 'Copied!' });
        setTimeout(() => set({ keyCopyStatus: 'Copy' }), 2000);
      }
    },

    handleCopyContent: () => {
      const { paste } = get();
      if (paste) {
        navigator.clipboard.writeText(paste).catch((err) => {
          console.error('Could not copy content: ', err);
        });
        set({ contentCopyStatus: 'Copied!' });
        setTimeout(() => set({ contentCopyStatus: 'Copy' }), 2000);
      }
    },

    handleClearPaste: () => set({ paste: null, retrieveKey: '' }),
    handleClearCreate: () => set({ createContent: '' }),
    handleClearRetrieveKey: () => set({ retrieveKey: '' }),

    handlePasteFromClipboard: async () => {
      try {
        const text = await navigator.clipboard.readText();
        set({ createContent: text });
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
      }
    },

    handlePasteKeyFromClipboard: async () => {
      try {
        const text = await navigator.clipboard.readText();
        set({ retrieveKey: text });
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
      }
    },
  };
});

export default useAppStore;
