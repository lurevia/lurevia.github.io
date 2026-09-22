import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "../api/http";
import {
  verificationApi,
  type VerificationStatus,
} from "../api/verification";

export const useVerification = () => {
  const [status, setStatus] = useState<VerificationStatus>("NONE");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await verificationApi.status();
      setStatus(res.status);
    } catch {
      setStatus("NONE");
    }
  }, []);

  const request = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await verificationApi.request();
      setStatus("PENDING");
    } catch (err) {
      setError(toErrorMessage(err, "Impossible d'envoyer la demande."));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirm = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await verificationApi.confirm(code);
      setStatus("USED");
    } catch (err) {
      setError(toErrorMessage(err, "Code invalide ou expiré."));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charge le statut au montage
  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    status,
    isLoading,
    error,
    request,
    confirm,
    refresh,
    setError,
  };
};