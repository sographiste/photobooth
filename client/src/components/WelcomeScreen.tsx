import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Images } from "lucide-react";

interface WelcomeScreenProps {
  onSinglePhotoClick: () => void;
  onPhotoStripClick: () => void;
}

const WelcomeScreen: FC<WelcomeScreenProps> = ({ 
  onSinglePhotoClick, 
  onPhotoStripClick 
}) => {
  return (
    <div className="fade-in flex flex-col items-center justify-center h-full text-center px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] text-neutral mb-6">
          Gardons un souvenir unique de ce jour ❤️
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Button
            variant="outline"
            onClick={onSinglePhotoClick}
            className="slide-in p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center h-auto"
          >
            <div className="bg-primary/20 p-6 rounded-full mb-4">
              <Camera className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-['Cormorant_Garamond'] text-neutral mb-2">Photo Unique</h3>
            <p className="text-sm font-['Montserrat'] text-neutral/70">Prenez une belle photo</p>
          </Button>
          
          <Button
            variant="outline"
            onClick={onPhotoStripClick}
            className="slide-in p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center h-auto"
          >
            <div className="bg-primary/20 p-6 rounded-full mb-4">
              <Images className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-['Cormorant_Garamond'] text-neutral mb-2">Photomaton</h3>
            <p className="text-sm font-['Montserrat'] text-neutral/70">Prenez 3 photos en séquence</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
