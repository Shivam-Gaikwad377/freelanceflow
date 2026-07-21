import React from 'react'

type FontSize = "small" | "medium" | "large";

type PrimaryButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string | null;
 fontSize: FontSize
};
const SIZE_CLASSES: Record<FontSize, string> = {
  small: "text-label-sm py-1 md:text-label-sm md:py-1",
  medium: "text-label-sm py-1 md:text-label-md md:py-3",
  large: "text-label-sm py-1 md:text-label-lg md:py-3",
};
const PrimaryButton = ({ label, onClick, disabled, icon, fontSize }: PrimaryButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} type="button" className={`w-auto cursor-pointer flex items-center justify-center hover:scale-102 active:scale-98 transition-all text-label-sm py-1 duration-100 bg-primary text-on-primary ${SIZE_CLASSES[fontSize]}  rounded-lg  px-4 hover:bg-surface-tint  shadow-[0_4px_12px_rgba(70,72,212,0.2)]`}>
      {icon && <span className="hidden! md:inline-flex!  material-symbols-outlined mr-2">{icon}</span>}
      {label}
    </button>
  )
}

export default PrimaryButton