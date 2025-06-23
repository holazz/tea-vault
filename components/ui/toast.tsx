import { CircleAlert, CircleCheck, Info, XCircle } from 'lucide-react'
import { toast as _toast } from 'sonner'

interface ToastOptions {
  duration?: number
}

function createToast(type: 'success' | 'error' | 'warning' | 'info', message: string, options?: ToastOptions) {
  const config = {
    success: {
      icon: CircleCheck,
      color: 'text-green-600',
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
    },
    warning: {
      icon: CircleAlert,
      color: 'text-yellow-600',
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
    },
  }

  const { icon: Icon, color } = config[type]

  return _toast.custom(
    () => (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white dark:bg-[#1f1f1f] shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)]">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm">{message}</span>
      </div>
    ),
    {
      duration: options?.duration || 3000,
    },
  )
}

export const toast = {
  success: (message: string, options?: ToastOptions) => createToast('success', message, options),
  error: (message: string, options?: ToastOptions) => createToast('error', message, options),
  warning: (message: string, options?: ToastOptions) => createToast('warning', message, options),
  info: (message: string, options?: ToastOptions) => createToast('info', message, options),
  custom: _toast.custom,
  dismiss: _toast.dismiss,
  promise: _toast.promise,
}
