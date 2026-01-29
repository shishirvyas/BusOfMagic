import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Snackbar, Alert, AlertColor, Slide, SlideProps, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface Toast {
  id: number
  message: string
  severity: AlertColor
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor, duration?: number) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [currentToast, setCurrentToast] = useState<Toast | null>(null)
  const [open, setOpen] = useState(false)

  const processQueue = useCallback(() => {
    if (toasts.length > 0 && !currentToast) {
      setCurrentToast(toasts[0])
      setToasts((prev) => prev.slice(1))
      setOpen(true)
    }
  }, [toasts, currentToast])

  const showToast = useCallback((message: string, severity: AlertColor = 'info', duration = 4000) => {
    const newToast: Toast = {
      id: Date.now(),
      message,
      severity,
      duration,
    }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast])
  const showError = useCallback((message: string) => showToast(message, 'error', 6000), [showToast])
  const showWarning = useCallback((message: string) => showToast(message, 'warning'), [showToast])
  const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast])

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  const handleExited = () => {
    setCurrentToast(null)
  }

  // Process queue when toasts change
  useState(() => {
    processQueue()
  })

  // Process queue after toast exits
  useState(() => {
    if (!currentToast) {
      processQueue()
    }
  })

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={currentToast?.duration || 4000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={currentToast?.severity || 'info'}
          variant="filled"
          onClose={handleClose}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{ 
            minWidth: 300,
            boxShadow: 3,
          }}
        >
          {currentToast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Standalone toast functions for use outside of React components
let toastFunctions: ToastContextType | null = null

export function setToastFunctions(functions: ToastContextType) {
  toastFunctions = functions
}

export const toast = {
  success: (message: string) => toastFunctions?.showSuccess(message),
  error: (message: string) => toastFunctions?.showError(message),
  warning: (message: string) => toastFunctions?.showWarning(message),
  info: (message: string) => toastFunctions?.showInfo(message),
}
