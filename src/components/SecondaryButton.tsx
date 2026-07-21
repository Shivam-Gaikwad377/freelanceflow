import React from "react";

type FontSize = "small" | "medium" | "large";

type SecondaryButtonProps = {
  onClick: () => void;
  label: string;
  icon?: string;
  fontSize?: FontSize;
};

// Full literal strings only — Tailwind needs "md:text-label-lg" etc.
// to appear as one contiguous token somewhere in the source.
const SIZE_CLASSES: Record<FontSize, string> = {
  small: "text-label-sm py-1 md:text-label-sm md:py-1",
  medium: "text-label-sm py-1 md:text-label-md md:py-3",
  large: "text-label-sm py-1 md:text-label-lg md:py-3",
};

const SecondaryButton = ({
  onClick,
  label,
  icon,
  fontSize = "medium",
}: SecondaryButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-auto h-auto cursor-pointer items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface px-2 text-on-surface-variant shadow-sm transition-colors hover:text-primary md:px-4 ${SIZE_CLASSES[fontSize]}`}
    >
      {icon && (
        <span className="hidden! md:inline-flex!  material-symbols-outlined text-[18px]">
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};

export default SecondaryButton;