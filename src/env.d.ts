/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/ui/dialog' {
  const component: any;
  export default component;
  export const Dialog: any;
  export const DialogContent: any;
  export const DialogHeader: any;
  export const DialogTitle: any;
  export const DialogDescription: any;
  export const DialogFooter: any;
  export const DialogClose: any;
}

declare module '@/components/ui/badge' {
  const component: any;
  export default component;
  export const Badge: any;
}
