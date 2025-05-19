export { default as Toast } from './Toast.vue';
export { default as ToastAction } from './ToastAction.vue';
export { default as ToastClose } from './ToastClose.vue';
export { default as ToastDescription } from './ToastDescription.vue';
export { default as Toaster } from './Toaster.vue';
export { default as ToastProvider } from './ToastProvider.vue';
export { default as ToastTitle } from './ToastTitle.vue';
export { default as ToastViewport } from './ToastViewport.vue';
export { toast, useToast } from './use-toast';

import { cva } from 'class-variance-authority';

export const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--reka-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-neutral-800',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 bg-white text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50',
        destructive:
          'destructive group border-red-500 bg-red-500 text-neutral-50 dark:border-red-700 dark:bg-red-900 dark:text-red-50',
        success:
          'success group border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-700 dark:text-white',
        warning:
          'warning group border-neutral-400 bg-neutral-300 text-neutral-800 dark:border-neutral-500 dark:bg-neutral-600 dark:text-neutral-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
