import type { Project } from './index.d.ts';

declare global {
  interface Window {
    openProjectModal?: (project: Project) => void;
    handleProjectClick?: (element: HTMLElement) => void;
  }
}

export {};
