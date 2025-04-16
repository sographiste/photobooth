import { FC, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { filterOptions } from "@/lib/filters";
import { addWatermark } from "@/lib/watermark";

interface CameraScreenProps {
  mode: "single" | "strip";
  onBackClick: () => void;
  onPhotoCapture: (dataUrl: string) => void;
  stripIndex?: number;
  totalStripPhotos?: number;
}

const CameraScreen: FC<CameraScreenProps> = ({
  mode,
  onBackClick,
  onPhotoCapture,
  stripIndex = 0,
  totalStripPhotos = 3
}) => {
  const {
    webcamRef,
    selectedFilter,
    setSelectedFilter,
    applyFilterToImage,
    filterStyle
  } = useCamera();

  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  // Handle countdown timer
  const startCountdown = () => {
    setCountdown(5);
    
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
    }
    
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          window.clearInterval(countdownIntervalRef.current!);
          // Capture photo when countdown reaches 0
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          console.log("Capturing photo with filter:", selectedFilter);
          
          // Apply selected filter to the captured image
          const filteredImage = await applyFilterToImage(imageSrc);
          
          // Add the watermark (logo and text)
          const watermarkedImage = await addWatermark(filteredImage);
          
          // Pass the final image to the parent component
          onPhotoCapture(watermarkedImage);
        } catch (error) {
          console.error("Error processing photo:", error);
          // If there's an error, still return the original image
          onPhotoCapture(imageSrc);
        }
      }
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fade-in h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBackClick}
          className="bg-[#FFFFFF] hover:bg-[#f4e6dc] p-2 rounded-full shadow-md transition-colors h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4 text-neutral" />
        </Button>
        <span className="bg-[#f4e6dc] backdrop-blur-sm px-4 py-2 rounded-full font-['Montserrat'] text-sm text-neutral shadow-md">
          {mode === 'single' ? 'Mode Photo Unique' : `Mode Photomaton (${stripIndex + 1}/${totalStripPhotos})`}
        </span>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {/* Camera Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="relative bg-black rounded-xl overflow-hidden shadow-xl flex-1 flex items-center justify-center">
            <div style={{ filter: filterStyle }} className="w-full h-full">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Countdown display */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-7xl font-bold text-white drop-shadow-lg">{countdown}</span>
              </div>
            )}
          </div>
          
          {/* Camera Controls */}
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={startCountdown}
              className="bg-[#74c095] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#8b5128] transition-colors p-0"
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>
        
        {/* Settings Panel */}
        <div className="bg-white/70  rounded-xl p-6 shadow-lg w-full md:w-80">
          <h3 className="font-['Cormorant_Garamond'] text-xl mb-4 text-neutral text-center">Filtres</h3>
          
          {/* Filter Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2">
              {filterOptions.map((filter) => (
                <button 
                  key={filter.id}
                  className={`p-2 rounded border-2 ${selectedFilter === filter.id ? 'border-accent' : 'border-transparent'} hover:border-accent transition-all`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <span className="text-sm block text-center">{filter.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraScreen;
