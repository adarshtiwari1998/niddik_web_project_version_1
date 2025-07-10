import { useAuth } from "./use-auth";

export const useUser = () => {
  const auth = useAuth();
  return {
    user: auth?.user || null,
    isLoading: auth?.isLoading || false,
  };
};