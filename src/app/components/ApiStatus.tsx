"use client";

import { useState, useEffect } from "react";
import { checkGoogleAIHealth, ApiHealthStatus } from "../lib/apiUtils";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

export function ApiStatus() {
  const [status, setStatus] = useState<ApiHealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const healthStatus = await checkGoogleAIHealth();
      setStatus(healthStatus);
    } catch (error) {
      setStatus({
        isHealthy: false,
        error: "Failed to check API status"
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!status && !isChecking) return null;

  return (
    <div className="mb-4 p-3 rounded-lg border">
      <div className="flex items-center gap-2">
        {isChecking ? (
          <>
            <FiClock className="animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">Verificando status da API...</span>
          </>
        ) : status?.isHealthy ? (
          <>
            <FiCheckCircle className="text-green-500" />
            <span className="text-sm text-green-700">
              API funcionando ({status.responseTime}ms)
            </span>
          </>
        ) : (
          <>
            <FiXCircle className="text-red-500" />
            <span className="text-sm text-red-700">
              API indisponível: {status?.error}
            </span>
            <button
              onClick={checkStatus}
              className="ml-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
            >
              Tentar novamente
            </button>
          </>
        )}
      </div>
    </div>
  );
} 