import logoImg from "@/assets/voxa-logo.jpg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImg}
        alt="Voxa logo"
        width={36}
        height={36}
        className="h-9 w-9 rounded-xl object-cover shadow-glow"
      />
      <span className="text-xl font-bold tracking-tight">Voxa</span>
    </div>
  );
}