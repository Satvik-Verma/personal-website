import FadeInOnScroll from "@/components/animation/FadeInOnScroll";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <FadeInOnScroll className={cn("mb-12 md:mb-16", className)}>
      <div className={cn(align === "center" && "text-center")}>
        {/*
          GRADIENT HEADING
          White fades to a slightly cool gray — adds dimensionality
          without screaming "gradient text". Subtle but premium.
        */}
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
            "leading-[1.1]"
          )}
          style={{
            background: "linear-gradient(135deg, #fafafa 0%, #c8c8d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="mt-3 text-base md:text-lg leading-relaxed max-w-2xl"
            style={{ color: "#a1a1aa" }}
          >
            {subtitle}
          </p>
        )}

        {/*
          ACCENT UNDERLINE BAR with glow
          Blue-to-purple gradient + bloom shadow.
          On center-aligned headings it's centered.
        */}
        <div
          className={cn(
            "mt-4 h-[3px] w-12 rounded-full accent-bar-glow",
            align === "center" && "mx-auto"
          )}
        />
      </div>
    </FadeInOnScroll>
  );
}
