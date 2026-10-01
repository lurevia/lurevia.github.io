import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "../api/http";
import {
  verificationApi,
  type VerificationStatus,
  type VerificationStatusResponse,
} from "../api/verification";

export const useVerification = () => {
  const [status, setStatus] = useState<VerificationStatus>("NOT_SUBMITTED");
  const [latestRequest, setLatestRequest] =
    useState<VerificationStatusResponse["latestRequest"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const response = await verificationApi.status();
      setStatus(response.status);
      setLatestRequest(response.latestRequest);
    } catch (err) {
      setError(toErrorMessage(err, "Impossible de charger le statut de vérification."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submit = useCallback(async (cinNumber: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await verificationApi.submit(cinNumber);
      await refresh();
      return true;
    } catch (err) {
      const message = toErrorMessage(err, "Impossible d'envoyer la demande.");
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, latestRequest, isLoading, error, submit, refresh };
};
