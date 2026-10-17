import { useEffect } from 'react';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  text: string;
}

interface Props {
  toasts: ToastMessage[];
  remove: (id: number) => void;
}

export function ToastContainer({ toasts, remove }: Props) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${toast.type}`}>
      <span>{toast.type === 'success' ? '✓' : '✕'}</span>
      <span>{toast.text}</span>
    </div>
  );
}
