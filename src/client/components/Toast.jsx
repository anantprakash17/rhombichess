'use client';

import { toast } from 'react-toastify';

export default function Toast({ message, error = false }) {
  const options = {
    position: 'bottom-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light',
    toastId: message,
  };

  if (error) {
    toast.error(message, options);
  } else {
    toast.info(message, options);
  }
}
