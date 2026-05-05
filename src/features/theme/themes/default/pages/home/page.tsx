import { Link, useRouteContext } from "@tanstack/react-router";
import { Monitor, Terminal } from "lucide-react";
import { useMemo } from "react";
import { useBilibiliLive } from "@/features/bilibili-live/hooks/use-bilibili-live";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";
import { useViewCounts } from "@/features/pageview/queries";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { BlurFade } from "@/features/theme/themes/default/components/blur-fade";
import { PixelatedCanvas } from "@/features/theme/themes/default/components/pixelated-canvas";
import { PostItem } from "@/features/theme/themes/default/components/post-item";
import { m } from "@/paraglide/messages";

const BILIBILI_ROOM_ID = "3893221";
const BILIBILI_LIVE_URL = `https://live.bilibili.com/${BILIBILI_ROOM_ID}`;
const AVATAR_URL =
  "https://i.stardots.io/784774835/StarDots-2026050515272984592.webp";

export function HomePage({ posts, pinnedPosts }: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });

  const liveStatus = useBilibiliLive(BILIBILI_ROOM_ID);

  const displayPosts = useMemo(() => {
    const pinned = (pinnedPosts ?? []).map((p) => ({ ...p, isPinned: true }));
    const regular = posts.map((p) => ({ ...p, isPinned: false }));
    const seen = new Set<number>();
    const merged = [];
    for (const p of [...pinned, ...regular]) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }
    return merged;
  }, [posts, pinnedPosts]);

  const allSlugs = useMemo(
    () => displayPosts.map((p) => p.slug),
    [displayPosts],
  );
  const { data: viewCounts, isPending: isPendingViewCounts } =
    useViewCounts(allSlugs);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-6 md:px-0 py-4 md:py-8">
      <BlurFade
        direction="down"
        delay={0}
        duration={0.6}
        className="flex flex-col items-center gap-6 pt-0 pb-0"
      >
        <div className="relative">
          <div
            className="relative rounded-full border-4 p-1 transition-colors duration-300"
            style={{
              borderColor: liveStatus.isLive
                ? "#FF6B9D"
                : "hsl(var(--color-default-300))",
            }}
          >
            <PixelatedCanvas
              src={AVATAR_URL}
              width={260}
              height={260}
              cellSize={5}
              dotScale={0.85}
              shape="circle"
              interactive={true}
              distortionMode="swirl"
              distortionStrength={4}
              distortionRadius={80}
              fadeOnLeave={true}
              maxFps={60}
              dropoutStrength={0.05}
              className="rounded-full"
            />
          </div>

          <a
            href={liveStatus.url || BILIBILI_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: liveStatus.isLive
                ? "linear-gradient(135deg, #FF6B9D 0%, #FF4757 100%)"
                : "rgba(156, 163, 175, 0.8)",
              color: liveStatus.isLive
                ? "white"
                : "hsl(var(--color-default-700))",
              boxShadow: liveStatus.isLive
                ? "0 4px 12px rgba(255, 107, 157, 0.4)"
                : "none",
            }}
          >
            <Monitor
              size={16}
              className={liveStatus.isLive ? "fill-white" : ""}
            />
            {liveStatus.isLive ? "正在直播" : "未开播"}
          </a>
        </div>

        <div className="flex items-center gap-5">
          {siteConfig.social
            .filter((link) => link.url)
            .map((link, i) => {
              const preset =
                link.platform !== "custom"
                  ? SOCIAL_PLATFORMS[link.platform]
                  : null;
              const Icon = preset?.icon;
              const label = preset?.label ?? link.label ?? "";
              const href = resolveSocialHref(link.platform, link.url);

              return (
                <a
                  key={`${link.platform}-${i}`}
                  href={href}
                  target={link.platform === "email" ? undefined : "_blank"}
                  rel={link.platform === "email" ? undefined : "noreferrer"}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                  aria-label={label}
                >
                  {Icon ? (
                    <Icon size={18} strokeWidth={1.5} />
                  ) : (
                    <img src={link.icon} alt={label} className="w-5 h-5" />
                  )}
                </a>
              );
            })}
        </div>
      </BlurFade>

      <div className="flex justify-center pt-4 pb-0">
        <BlurFade
          direction="down"
          delay={0.2}
          duration={0.6}
          className="flex flex-col items-center text-center gap-2 max-w-2xl"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {siteConfig.author}
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              {siteConfig.title}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            {siteConfig.description}
          </p>
        </BlurFade>
      </div>

      <section className="space-y-10 mt-8">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-tight flex items-center gap-2">
          {m.home_latest_posts()}
        </h2>

        <div className="space-y-8">
          {displayPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              pinned={post.isPinned}
              views={viewCounts?.[post.slug]}
              isLoadingViews={isPendingViewCounts}
            />
          ))}
        </div>

        <div className="pt-8">
          <Link
            to="/posts"
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Terminal size={14} />
            cd /posts
          </Link>
        </div>
      </section>
    </div>
  );
}
