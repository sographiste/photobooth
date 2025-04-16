import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { filterOptions } from "@/lib/filters";
import { addWatermark } from "@/lib/watermark";

export const useCamera = () => {
  const webcamRef = useRef<Webcam>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("normal");
  const [cameraError, setCameraError] = useState<string | null>(null);
  // Variables pour la prévisualisation en direct
  const [filterStyle, setFilterStyle] = useState<string>("");

  // Check camera permissions on mount
  useEffect(() => {
    async function checkCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setCameraError("Error accessing camera. Please allow camera permissions.");
      }
    }

    checkCameraPermission();
  }, []);

  // Mettre à jour le style du filtre lorsque le filtre sélectionné change
  useEffect(() => {
    const filter = filterOptions.find(f => f.id === selectedFilter);
    if (filter) {
      setFilterStyle(filter.cssFilter);
    } else {
      setFilterStyle("");
    }
  }, [selectedFilter]);

  // Apply selected filter to captured image
  const applyFilterToImage = (imageDataUrl: string): Promise<string> => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded. Applying filter:", selectedFilter);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          console.error("No canvas context available");
          resolve(imageDataUrl); // Return original if no context
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // D'abord, dessiner l'image originale
        ctx.drawImage(img, 0, 0);
        
        // Appliquer le filtre
        try {
          const filter = filterOptions.find(f => f.id === selectedFilter);
          console.log("Selected filter:", filter);
          
          if (filter && filter.id !== "normal") {
            console.log("Applying filter:", filter.id);
            
            // Récupérer les données de l'image
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Appliquer le filtre approprié
            switch (selectedFilter) {
              case "bw":
                for (let i = 0; i < data.length; i += 4) {
                  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  data[i] = avg;     // Rouge
                  data[i + 1] = avg; // Vert
                  data[i + 2] = avg; // Bleu
                }
                break;
                
              case "sepia":
                for (let i = 0; i < data.length; i += 4) {
                  const r = data[i];
                  const g = data[i + 1];
                  const b = data[i + 2];
                  data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     // Rouge
                  data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // Vert
                  data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // Bleu
                }
                break;
            }
            
            // Remettre les données modifiées sur le canvas
            ctx.putImageData(imageData, 0, 0);
          }
        } catch (error) {
          console.error("Error applying filter:", error);
        }
        
        // Convertir en URL de données et retourner
        try {
          const resultDataUrl = canvas.toDataURL("image/jpeg", 0.9);
          console.log("Filter applied successfully");
          resolve(resultDataUrl);
        } catch (error) {
          console.error("Error converting canvas to data URL:", error);
          resolve(imageDataUrl); // En cas d'erreur, retourner l'image originale
        }
      };
      
      img.src = imageDataUrl;
    });
  };

  return {
    webcamRef,
    selectedFilter,
    setSelectedFilter,
    cameraError,
    applyFilterToImage,
    filterStyle,
  };
};
