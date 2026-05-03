/**
 * B站
 *
 * 使用 B站
 */

import type { Result } from "@/lib/errors";
import { err, ok } from "@/lib/errors";

const BILIBILI_API_URL = "https://api.live.bilibili.com/room/v1/Room/get_info";

/** B站 */
export interface BilibiliLiveInfo {
  isLive: boolean;
  title: string;
  cover: string;
  url: string;
}

type FetchBilibiliLiveResult = Result<
  BilibiliLiveInfo,
  { reason: "FETCH_FAILED" | "INVALID_ROOM_ID" }
>;

/**
 * 查询 B站
 *
 * @param roomId - 直播间房间号
 */
export async function fetchBilibiliLiveStatus(
  roomId: string,
): Promise<FetchBilibiliLiveResult> {
  try {
    if (!roomId) return err({ reason: "INVALID_ROOM_ID" });

    const response = await fetch(`${BILIBILI_API_URL}?room_id=${roomId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://live.bilibili.com/",
      },
    });

    if (!response.ok) {
      return err({ reason: "FETCH_FAILED" });
    }

    const json = (await response.json()) as {
      data?: { live_status?: number; title?: string; keyframe?: string };
    };
    const data = json?.data;

    if (!data) {
      return ok({
        isLive: false,
        title: "",
        cover: "",
        url: `https://live.bilibili.com/${roomId}`,
      });
    }

    return ok({
      isLive: data.live_status === 1,
      title: data.title || "",
      cover: data.keyframe || "",
      url: `https://live.bilibili.com/${roomId}`,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "bilibili live status fetch failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return err({ reason: "FETCH_FAILED" });
  }
}
