// Declaration file for the adjacent use-toast.js
declare module '@/components/ui/toast/use-toast' {
  import { type VNode } from 'vue';

  export interface ToastProps {
    id?: string;
    title?: string | VNode;
    description?: string | VNode;
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    action?: VNode;
    class?: any;
    [key: string]: any;
  }

  export function toast(props: ToastProps): {
    id: string;
    dismiss: () => void;
    update: (props: Partial<ToastProps>) => void;
  };

  // You can also declare useToast if it's exported and used from the .js file
  // export function useToast(): any;
}
