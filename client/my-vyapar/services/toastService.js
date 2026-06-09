// services/toastService.js
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ToastService {
  constructor() {
    this.activeToasts = new Map();
  }

  showLoading(message, options = {}) {
    const id = toast.loading(message, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      theme: "light",
      ...options
    });
    
    this.activeToasts.set('loading', id);
    return id;
  }

  updateToSuccess(toastId, message, options = {}) {
    toast.update(toastId, {
      render: message,
      type: "success",
      isLoading: false,
      autoClose: 2000,
      position: "top-right",
      transition: Bounce,
      ...options
    });
    this.activeToasts.delete('loading');
  }

  updateToError(toastId, message, options = {}) {
    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 3000,
      position: "top-right",
      transition: Bounce,
      ...options
    });
    this.activeToasts.delete('loading');
  }

  showSuccess(message, options = {}) {
    return toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      transition: Bounce,
      ...options
    });
  }

  showError(message, options = {}) {
    return toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      transition: Bounce,
      ...options
    });
  }

  dismissAll() {
    toast.dismiss();
    this.activeToasts.clear();
  }

  dismissLoading() {
    const loadingId = this.activeToasts.get('loading');
    if (loadingId) {
      toast.dismiss(loadingId);
      this.activeToasts.delete('loading');
    }
  }
}

export default new ToastService();