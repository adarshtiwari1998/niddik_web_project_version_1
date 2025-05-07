import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading, please wait..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-background shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}