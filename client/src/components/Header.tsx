import { FC } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Images } from "lucide-react";
// Importing logo directly from assets folder
import logoPath from "../assets/logo.png";

interface HeaderProps {
  onGalleryClick: () => void;
}

const Header: FC<HeaderProps> = ({ onGalleryClick }) => {
  const [_, navigate] = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="text-neutral hover:text-accent transition-colors p-2"
        >
          <Home className="h-6 w-6" />
        </Button>
        <div className="flex items-center">
          <img src={logoPath} alt="Sophie & Jérôme" className="h-12 mr-3" />
          <h1 className="text-xl md:text-2xl font-['Cormorant_Garamond'] font-light text-neutral">
            Sophie & Jérôme • 27/09/25
          </h1>
        </div>
      </div>
      <div>
        <Button 
          variant="ghost" 
          onClick={onGalleryClick}
          className="bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-full font-['Montserrat'] transition-colors"
        >
          <Images className="mr-2 h-4 w-4" />
          Galerie
        </Button>
      </div>
    </header>
  );
};

export default Header;
