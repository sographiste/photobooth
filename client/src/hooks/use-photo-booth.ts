import { create } from 'zustand';
import { Photo } from '@shared/schema';

interface PhotoBoothState {
  mode: 'single' | 'strip';
  photoUrls: string[];
  stripIndex: number;
  capturedPhoto: Photo | null;
  setMode: (mode: 'single' | 'strip') => void;
  setPhotoUrls: (urls: string[]) => void;
  addPhotoUrl: (url: string) => void;
  setStripIndex: (index: number) => void;
  resetState: () => void;
  capturePhoto: (dataUrl: string) => void;
  setCapturedPhoto: (photo: Photo) => void;
}

export const usePhotoBoothStore = create<PhotoBoothState>((set) => ({
  mode: 'single',
  photoUrls: [],
  stripIndex: 0,
  capturedPhoto: null,
  
  setMode: (mode) => set(() => ({ mode })),
  
  setPhotoUrls: (photoUrls) => set(() => ({ photoUrls })),
  
  addPhotoUrl: (url) => set((state) => ({ 
    photoUrls: [...state.photoUrls, url] 
  })),
  
  setStripIndex: (stripIndex) => set(() => ({ stripIndex })),
  
  resetState: () => set(() => ({ 
    photoUrls: [],
    stripIndex: 0,
  })),
  
  capturePhoto: (dataUrl) => set((state) => ({ 
    photoUrls: state.mode === 'single' 
      ? [dataUrl] 
      : [...state.photoUrls, dataUrl] 
  })),
  
  setCapturedPhoto: (photo) => set(() => ({ capturedPhoto: photo })),
}));
