// Toast is a global notification pop-up that appears briefly at the bottom-right.
// It receives messages via a custom event ("show-toast") dispatched elsewhere in the app.

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// Helper function other components call to trigger a toast.
export function showToast(message, type = 'success') {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
}

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const BG = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handleToast(event) {
      const { message, type } = event.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-remove toast after 3.5 seconds.
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    }

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${BG[toast.type] || BG.info} min-w-[260px] max-w-[380px] animate-slide-up`}
        >
          {ICONS[toast.type] || ICONS.info}
          <span className="flex-1 text-sm text-gray-800">{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
