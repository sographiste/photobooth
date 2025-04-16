import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryScreenProps {
  onBackClick: () => void;
  onPhotoClick: (photo: Photo) => void;
}

const GalleryScreen: FC<GalleryScreenProps> = ({
  onBackClick,
  onPhotoClick,
}) => {
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  return (
    <div className="fade-in h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBackClick}
          className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4 text-neutral" />
        </Button>
        <h2 className="font-['Cormorant_Garamond'] text-2xl text-neutral">Galerie Photos</h2>
        <div className="w-10"></div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="aspect-square">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {photos && photos.length > 0 ? (
            photos.map((photo) => (
              <div 
                key={photo.id}
                className="aspect-square bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => onPhotoClick(photo)}
              >
                <img 
                  src={photo.filePath} 
                  alt={`Photo ${photo.id}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="outline"
                    className="bg-white/80 p-2 rounded-full text-neutral h-auto"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-neutral/70">
              <p className="text-lg font-['Montserrat']">Pas encore de photos. Capturez de beaux souvenirs !</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryScreen;
