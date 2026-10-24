export function SectionBackdrop({ maskPosition = "78% 30%" }: { maskPosition?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2.5rem]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(50% 45% at 10% 15%, rgba(225,29,72,0.10), transparent 65%), radial-gradient(45% 40% at 90% 70%, rgba(4,120,87,0.08), transparent 65%), radial-gradient(40% 35% at 55% 0%, rgba(225,29,72,0.05), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(159,18,57,0.14) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage: `radial-gradient(55% 55% at ${maskPosition}, black, transparent 72%)`,
          WebkitMaskImage: `radial-gradient(55% 55% at ${maskPosition}, black, transparent 72%)`,
        }}
      />
    </div>
  );
}
