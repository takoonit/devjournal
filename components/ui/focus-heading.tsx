"use client";

import BlurText from "@/components/reactbits/blur-text";
import DecryptedText from "@/components/reactbits/decrypted-text";
import { cn } from "@/lib/utils";

type FocusHeadingTone = "hero" | "section" | "micro";
type FocusHeadingEffect = "blur" | "decrypt";

interface FocusHeadingProps {
  text: string;
  tone?: FocusHeadingTone;
  effect?: FocusHeadingEffect;
  className?: string;
}

const toneStyles: Record<FocusHeadingTone, string> = {
  hero: "text-4xl font-semibold tracking-tight text-text-primary md:text-6xl",
  section: "text-2xl font-semibold tracking-tight text-text-primary md:text-3xl",
  micro: "text-sm font-medium uppercase tracking-[0.16em] text-text-secondary",
};

export function FocusHeading({
  text,
  tone = "section",
  effect = "blur",
  className,
}: FocusHeadingProps) {
  const classes = cn("leading-tight", toneStyles[tone], className);
  const HeadingTag = tone === "hero" ? "h1" : tone === "section" ? "h2" : "h3";

  if (effect === "decrypt") {
    return (
      <HeadingTag className={classes}>
        <DecryptedText
          text={text}
          animateOn="view"
          speed={36}
          maxIterations={14}
          revealDirection="start"
          encryptedClassName="text-text-muted"
        />
      </HeadingTag>
    );
  }

  return (
    <HeadingTag className={classes}>
      <BlurText
        text={text}
        animateBy={tone === "micro" ? "letters" : "words"}
        delay={tone === "hero" ? 90 : 45}
        direction="top"
        stepDuration={0.3}
      />
    </HeadingTag>
  );
}
