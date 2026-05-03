import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as BilibiliLiveService from "../bilibili-live.service";

const GetLiveStatusInput = z.object({
  roomId: z.string(),
});

export const getLiveStatusFn = createServerFn({
  method: "POST",
})
  .inputValidator(GetLiveStatusInput)
  .handler(({ data }) =>
    BilibiliLiveService.fetchBilibiliLiveStatus(data.roomId),
  );
