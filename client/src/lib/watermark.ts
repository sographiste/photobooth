import logoPath from '../assets/picto-rond.png';

/**
 * Adds a watermark to an image
 * @param imageDataUrl The image data URL to add watermark to
 * @returns A Promise that resolves to a watermarked image data URL
 */
export const addWatermark = (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas and context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        // If no context can be obtained, return original image
        resolve(imageDataUrl);
        return;
      }
      
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Load the watermark logo
      const logo = new Image();
      logo.onload = () => {
        // Utilise une taille fixe de 200px pour le watermark
        const maxLogoWidth = 200;
        // On s'assure que le logo ne dépasse pas 20% de la largeur de l'image
        const logoWidth = Math.min(maxLogoWidth, img.width * 0.12);
        const ratio = logo.height / logo.width;
        const logoHeight = logoWidth * ratio;
        const padding = img.width * 0.03; // 3% padding
        const logoX = img.width - logoWidth - padding;
        const logoY = img.height - logoHeight - padding;
        
        // Add text "Sophie & Jérôme • 27/09/25" at the top
        ctx.font = `${img.width * 0.03}px 'Cormorant Garamond', serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('Sophie & Jérôme • 27/09/25', img.width / 2, img.height * 0.05);
        
        // Draw the logo
        ctx.globalAlpha = 0.85; // Semi-transparent
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
        
        // Convert to data URL and resolve
        resolve(canvas.toDataURL('image/jpeg'));
      };
      
      logo.src = logoPath;
    };
    
    img.src = imageDataUrl;
  });
};