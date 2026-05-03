"use client";

import { useCallback, useEffect, useState } from "react";
import { getLiveStatusFn } from "../api/bilibili-live.api";

export interface LiveStatus {
  isLive: boolean;
  title: string;
  cover: string;
  url: string;
  loading: boolean;
}

const DEFAULT_STATUS: LiveStatus = {
  isLive: false,
  title: "",
  cover: "",
  url: "",
  loading: true,
};

export function useBilibiliLive(
  roomId: string,
  pollInterval = 60000,
): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>(DEFAULT_STATUS);

  const fetchStatus = useCallback(async () => {
    const result = await getLiveStatusFn({ data: { roomId } });
    if (result.data) {
      setStatus({ ...result.data, loading: false });
    } else {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      setStatus((prev) => ({ ...prev, loading: false }));
      return;
    }

    fetchStatus();

    const timer = setInterval(fetchStatus, pollInterval);
    return () => clearInterval(timer);
  }, [fetchStatus, pollInterval, roomId]);

  return status;
}
