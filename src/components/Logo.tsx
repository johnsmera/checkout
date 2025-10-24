import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "default" | "compact";
}

export function Logo({
  className = "",
  width = 200,
  height = 42,
  variant = "default",
}: LogoProps) {
  const logoWidth = variant === "compact" ? 120 : width;
  const logoHeight = variant === "compact" ? 25 : height;

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo-colmeia-svg.svg"
        alt="Colmeia Checkout"
        width={logoWidth}
        height={logoHeight}
        priority
        className="h-auto"
      />
    </div>
  );
}
