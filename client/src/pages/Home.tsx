import { useState } from "react";
import Header from "@/components/Header";
import WelcomeScreen from "@/components/WelcomeScreen";
import CameraScreen from "@/components/CameraScreen";
import ResultsScreen from "@/components/ResultsScreen";
import GalleryScreen from "@/components/GalleryScreen";
import { usePhotoBoothStore } from "@/hooks/use-photo-booth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/ui/notification";
import { Photo } from "@shared/schema";
// Import background image
import backgroundImage from "../assets/background.jpg";

export default function Home() {
  const { toast } = useToast();
  const [screen, setScreen] = useState<"welcome" | "camera" | "results" | "gallery">("welcome");
  const { 
    mode, 
    setMode, 
    photoUrls, 
    setPhotoUrls,
    stripIndex, 
    setStripIndex, 
    resetState,
    capturedPhoto,
    setCapturedPhoto,
    capturePhoto
  } = usePhotoBoothStore();

  // For selected photo from gallery
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Handle photo capture
  const handlePhotoCapture = (dataUrl: string) => {
    capturePhoto(dataUrl);
    
    if (mode === "single") {
      // For single photo mode, go directly to results
      processPhotos([dataUrl]);
    } else {
      // For strip mode
      if (stripIndex < 2) {
        // More photos needed for strip
        setStripIndex(stripIndex + 1);
        toast({
          title: `Photo ${stripIndex + 1}/3 captured!`,
          description: "Get ready for the next one!",
        });
      } else {
        // Photo strip complete
        const allPhotos = [...photoUrls, dataUrl];
        processPhotos(allPhotos);
        setStripIndex(0);
      }
    }
  };

  // API mutation for saving photos
  const savePhotoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/photos", undefined, {
        body: formData,
        headers: {}, // Let the browser set content-type for FormData
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setCapturedPhoto(data);
      setScreen("results");
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error saving photo",
        description: "There was a problem saving your photo",
      });
    }
  });

  // Process photos (upload to server)
  const processPhotos = async (photos: string[]) => {
    // Convert base64 data URLs to actual files
    const formData = new FormData();
    
    for (let i = 0; i < photos.length; i++) {
      const base64Data = photos[i].split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      formData.append('photos', blob, `photo-${i}.jpg`);
    }
    
    // Add metadata
    formData.append('type', mode);
    formData.append('filter', 'normal'); // You can add filter selection here
    formData.append('background', 'none'); // You can add background selection here
    
    // Send to API
    savePhotoMutation.mutate(formData);
  };

  // Start single photo mode
  const handleSinglePhotoClick = () => {
    resetState();
    setMode("single");
    setScreen("camera");
  };

  // Start photo strip mode
  const handlePhotoStripClick = () => {
    resetState();
    setMode("strip");
    setScreen("camera");
  };

  // Handle gallery photo click
  const handleGalleryPhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setCapturedPhoto(photo);
    setScreen("results");
  };

  // Save to gallery (already saved when taking photo, so just show notification)
  const handleSaveToGallery = () => {
    toast({
      title: "Photo saved",
      description: "Photo has been saved to the gallery",
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Background overlay - using provided snow image */}
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-20 z-[-1]" style={{backgroundImage: `url(${backgroundImage})`}}></div>
      
      {/* Header */}
      <Header onGalleryClick={() => setScreen("gallery")} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        {screen === "welcome" && (
          <WelcomeScreen 
            onSinglePhotoClick={handleSinglePhotoClick}
            onPhotoStripClick={handlePhotoStripClick}
          />
        )}
        
        {screen === "camera" && (
          <CameraScreen 
            mode={mode}
            onBackClick={() => setScreen("welcome")}
            onPhotoCapture={handlePhotoCapture}
            stripIndex={stripIndex}
            totalStripPhotos={3}
          />
        )}
        
        {screen === "results" && capturedPhoto && (
          <ResultsScreen 
            mode={capturedPhoto.type as "single" | "strip"}
            photoUrls={capturedPhoto.photoUrls as string[]}
            qrCodeUrl={capturedPhoto.qrCode}
            onBackClick={() => setScreen("camera")}
            onSaveToGallery={handleSaveToGallery}
          />
        )}
        
        {screen === "gallery" && (
          <GalleryScreen 
            onBackClick={() => setScreen("welcome")}
            onPhotoClick={handleGalleryPhotoClick}
          />
        )}
      </main>
      
      {/* Notification component */}
      <Notification />
    </div>
  );
}
