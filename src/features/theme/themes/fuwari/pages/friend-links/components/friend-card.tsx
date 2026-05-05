import { Globe } from "lucide-react";
import type { FriendLinkWithUser } from "@/features/friend-links/friend-links.schema";
import { m } from "@/paraglide/messages";
import { PinContainer } from "@/components/ui/3d-pin";

interface FriendCardProps {
  link: Omit<FriendLinkWithUser, "createdAt" | "updatedAt">;
}

export function FriendCard({ link }: FriendCardProps) {
  const avatarUrl = link.logoUrl || link.user?.image;
  const description = link.description || m.friend_links_unknown_site();

  return (
    <div className="h-[20rem] w-full flex items-center justify-center">
      <PinContainer
        title={link.siteUrl}
        href={link.siteUrl}
        className="w-[16rem] sm:w-[18rem]"
        containerClassName="w-full h-full"
      >
        <div className="flex h-full w-full basis-full flex-col p-4 tracking-tight text-slate-100/50">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar Area */}
            <div className="shrink-0 relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={link.siteName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.classList.add("!bg-white/10");
                  }}
                />
              ) : (
                <Globe className="w-6 h-6 opacity-40 text-slate-300" />
              )}
            </div>

            {/* Site Name */}
            <h3 className="!m-0 text-base font-bold text-slate-100 truncate">
              {link.siteName}
            </h3>
          </div>

          {/* Description */}
          <div className="!m-0 !p-0 text-sm font-normal">
            <span className="text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </span>
          </div>

          {/* Gradient Placeholder - simulating the preview image area */}
          <div className="mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500/30 via-purple-500/30 to-blue-500/30 border border-white/5" />
        </div>
      </PinContainer>
    </div>
  );
}
