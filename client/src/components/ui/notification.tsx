import { FC, useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export const Notification: FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"error" | "success">("success");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Subscribe to global events for notification system
  useEffect(() => {
    // Create a custom event handler for showing notifications
    const handleShowNotification = (event: CustomEvent) => {
      const { message, type } = event.detail;
      showNotification(type, message);
    };

    // Add event listener
    window.addEventListener('showNotification', handleShowNotification as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('showNotification', handleShowNotification as EventListener);
    };
  }, []);

  // Function to show a notification
  const showNotification = (notificationType: "error" | "success", notificationMessage: string) => {
    setType(notificationType);
    setMessage(notificationMessage);
    setIsVisible(true);

    // Hide after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg fade-in z-50">
      <div 
        className={`${
          type === "error" ? "bg-red-500/90" : "bg-green-500/90"
        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}
      >
        {type === "error" ? (
          <AlertCircle className="mr-2 h-5 w-5" />
        ) : (
          <CheckCircle className="mr-2 h-5 w-5" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

// Helper function to globally trigger notifications
export const showNotification = (type: "error" | "success", message: string) => {
  const event = new CustomEvent('showNotification', {
    detail: { type, message }
  });
  window.dispatchEvent(event);
};
