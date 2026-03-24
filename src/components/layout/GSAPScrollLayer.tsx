"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  GSAPScrollLayer
  ===============
  Drop-in replacement for the old StickyLayer wrapper in page.tsx.

  Layout behaviour (unchanged):
    position: sticky, top: 0, height: 100vh, overflow: hidden, z-index: z.

  Cinematic scroll-exit (new):
    As the user scrolls past a section, GSAP ScrollTrigger drives:
      - Content scales up to 1.05  (zoom-out reveal feel)
      - Content blurs to 6px       (depth-of-field blur)
      - Content fades to opacity 0 (graceful exit)
      - A dark overlay fades from 0 to 0.7 opacity (dimming)

    These mirror the Style.AI Hero.tsx exit animations:
      scale: 1.05, filter: "blur(4px)", opacity: 0, overlay 0.40 -> 0.75

  How it works with sticky positioning:
    Each layer has a natural flow position of (index * 100vh). ScrollTrigger
    reads the element's document-flow position, not its sticky visual position.
    So for layer N:
      - flow-top = N * 100vh
      - flow-bottom = (N + 1) * 100vh
      - "40% top" = scroll = N*100vh + 40vh (exit starts at 40% through section)
      - "bottom top" = scroll = (N+1)*100vh  (exit completes when fully covered)

    This means the user sees 40% of the section content undisturbed, then
    the cinematic exit kicks in for the remaining 60% of scroll.

  The animation is scrubbed (tied to scroll position, not time) so it
  feels perfectly synchronised with the user's scroll velocity.

  On mobile (< 768px) the GSAP scrub is skipped to keep the page lightweight.
  The sticky CSS still works.

  Respects prefers-reduced-motion: all animations are skipped.
*/

interface GSAPScrollLayerProps {
  children: ReactNode;
  z: number;
  /** Skip exit animation for this layer (e.g. last section) */
  noExit?: boolean;
}

export default function GSAPScrollLayer({
  children,
  z,
  noExit = false,
}: GSAPScrollLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (noExit) return;

    const layer = layerRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (!layer || !content || !overlay) return;

    const mm = gsap.matchMedia();

    // Desktop: full cinematic scroll-exit
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          /*
            ScrollTrigger geometry for sticky layers:

            The trigger element sits in document flow at its natural position.
            For a sticky element at flow index N (top = N*100vh):

              "40% top"   = when the point at 40% of the element's height
                            (measured from its flow-top) crosses the viewport top.
                            That is scrollTop = N*100vh + 40vh.

              "bottom top" = when the element's flow-bottom crosses the
                            viewport top = scrollTop = (N+1)*100vh.

            So the exit animation scrubs across the last 60vh of each
            section's scroll range, matching the Style.AI feel:
            user reads the content, then it cinematically exits.
          */

          // Content exit: scale up, blur, fade out
          gsap.to(content, {
            scale: 1.05,
            filter: "blur(6px)",
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "40% top",
              end: "bottom top",
              scrub: 0.8,
            },
          });

          // Overlay darkens from 0 to 0.7
          gsap.to(overlay, {
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              // Overlay starts darkening a bit later for a layered feel
              start: "55% top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }, layer);

        return () => ctx.revert();
      }
    );

    // Mobile: lighter exit animation (no blur for perf, just fade + scale)
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          gsap.to(content, {
            scale: 1.03,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "50% top",
              end: "bottom top",
              scrub: 0.5,
            },
          });

          gsap.to(overlay, {
            opacity: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "60% top",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        }, layer);

        return () => ctx.revert();
      }
    );

    // Reduced motion: no animations
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // No-op: sticky scroll still works, just no cinematic effects
    });

    return () => mm.revert();
  }, [noExit]);

  return (
    <div
      ref={layerRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: z,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Content wrapper — the element GSAP animates */}
      <div
        ref={contentRef}
        style={{
          width: "100%",
          height: "100%",
          willChange: noExit ? "auto" : "transform, opacity, filter",
        }}
      >
        {children}
      </div>

      {/* Dark overlay — starts fully transparent, GSAP fades it in */}
      {!noExit && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 1)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}
