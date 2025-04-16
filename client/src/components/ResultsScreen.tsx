import { FC, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

interface ResultsScreenProps {
  mode: "single" | "strip";
  photoUrls: string[];
  qrCodeUrl: string;
  onBackClick: () => void;
  onSaveToGallery: () => void;
}

const ResultsScreen: FC<ResultsScreenProps> = ({
  mode,
  photoUrls,
  qrCodeUrl,
  onBackClick,
  onSaveToGallery,
}) => {
  const toast = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeprint: () => {
      toast({
        title: "Impression...",
        description: "Envoi de la photo à l'imprimante",
      });
    },
    onAfterPrint: () => {
      toast({
        title: "Impression terminée",
        description: "La photo a été envoyée à l'imprimante",
      });
    },
    onPrintError: () => {
      toast({
        variant: "destructive",
        title: "Erreur d'impression",
        description:
          "Un problème est survenu lors de l'impression de votre photo",
      });
    },
  });

  return (
    <div className="fade-in h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBackClick}
          className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4 text-neutral" />
        </Button>
        <h3 className="font-['Cormorant_Garamond'] text-xl text-neutral">
          Vos Photos
        </h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {/* Photo Preview */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex items-center justify-center p-4">
          <div ref={printRef} className="relative max-h-full max-w-full">
            {mode === "single" ? (
              // Single photo result
              <div className="fade-in">
                <img
                  src={photoUrls[0]}
                  alt="Captured photo"
                  className="max-h-[70vh] rounded shadow-md"
                />
              </div>
            ) : (
              // Photo strip result
              <div className="h-[70vh] w-64 mx-auto bg-white p-3 shadow-lg rounded">
                <div className="grid grid-rows-3 gap-2 h-full">
                  {photoUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Strip photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white/80 rounded-xl p-6 shadow-lg w-full md:w-80">
          <h3 className="font-['Cormorant_Garamond'] text-xl mb-6 text-neutral">
            Options de Partage
          </h3>

          <div className="flex">
            <Button
              onClick={handlePrint}
              className="w-half hover:bg-[white] bg-[#74c095] text-[white] hover:text-[#74c095] flex center transition-colors h-auto"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>

            <Button
              variant="outline"
              onClick={onSaveToGallery}
              className="w-half hover:bg-[white] bg-[#74c095] text-[white] hover:text-[#74c095] flex items-center transition-colors h-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder dans la Galerie
            </Button>

            <div className="border border-[#74c095]">
              <p className="text-sm text-neutral/70 mb-4 text-center">
                Envoyez votre photo par email
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button
                  variant="outline"
                  className="w-full hover:bg-[#74c095] flex items-center transition-colors"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
