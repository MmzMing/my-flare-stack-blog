import type { FriendLinkWithUser } from "@/features/friend-links/friend-links.schema";
import { m } from "@/paraglide/messages";
import { PinContainer } from "@/components/ui/3d-pin";

interface FriendLinkCardProps {
  link: Omit<FriendLinkWithUser, "createdAt" | "updatedAt">;
}

export function FriendLinkCard({ link }: FriendLinkCardProps) {
  const description = link.description || m.friend_links_unknown_site();

  return (
    <div className="h-[22rem] w-full flex items-center justify-center">
      <PinContainer
        title={link.siteUrl}
        href={link.siteUrl}
        className="w-[17rem] sm:w-[19rem]"
        containerClassName="w-full h-full"
      >
        <div className="flex h-full w-full basis-full flex-col p-5 tracking-tight">
          {/* Layer 1: Title - Large font */}
          <h3 className="!m-0 text-xl font-bold text-white truncate leading-tight">
            {link.siteName}
          </h3>

          {/* Layer 2: Description - Max 2 lines */}
          <div className="!m-0 !p-0 mt-3 text-sm font-normal min-h-[2.8em]">
            <span className="text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </span>
          </div>

          {/* Layer 3: Website Image */}
          <div className="mt-4 flex w-full flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-blue-500/20 border border-white/5">
            {link.logoUrl ? (
              <img
                src={link.logoUrl}
                alt={link.siteName}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white/10">
                  {link.siteName.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </PinContainer>
    </div>
  );
}
