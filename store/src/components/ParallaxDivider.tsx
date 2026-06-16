export default function ParallaxDivider() {
  return (
    <div className="parallax-divider py-8 md:py-10" aria-hidden>
      <div className="mx-auto w-[min(90%,480px)] h-px bg-[var(--color-border-light)]" />
    </div>
  );
}
