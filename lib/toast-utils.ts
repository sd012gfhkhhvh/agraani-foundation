import { toast } from 'sonner';

/**
 * Standardized toast notification utilities
 */

export const toastMessages = {
  // Success messages
  success: {
    created: (item: string) => `${item} created successfully`,
    updated: (item: string) => `${item} updated successfully`,
    deleted: (item: string) => `${item} deleted successfully`,
    saved: (item: string) => `${item} saved successfully`,
    published: (item: string) => `${item} published successfully`,
    submitted: (item: string) => `${item} submitted successfully`,
  },
  
  // Error messages
  error: {
    load: (item: string) => `Failed to load ${item}`,
    create: (item: string) => `Failed to create ${item}`,
    update: (item: string) => `Failed to update ${item}`,
    delete: (item: string) => `Failed to delete ${item}`,
    save: (item: string) => `Failed to save ${item}`,
    generic: 'Something went wrong. Please try again.',
    unauthorized: 'You must be logged in to perform this action',
    forbidden: 'You do not have permission to perform this action',
    validation: 'Please check your input and try again',
  },
  
  // Info messages
  info: {
    loading: (item: string) => `Loading ${item}...`,
    processing: 'Processing your request...',
    noChanges: 'No changes to save',
  },
};

/**
 * Show success toast
 */
export function showSuccess(message: string) {
  toast.success(message);
}

/**
 * Show error toast
 */
export function showError(message: string) {
  toast.error(message);
}

/**
 * Show loading toast (returns toast ID for later dismissal)
 */
export function showLoading(message: string) {
  return toast.loading(message);
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Show success toast with promise handling
 */
export async function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> {
  toast.promise(promise, messages);
  return promise;
}
