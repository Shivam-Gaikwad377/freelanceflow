import React from "react";
type SecondaryButtonProps = {
    onClick: () => void;
    label: string;
    icon: string | null;
    fontSize?: "small" | "medium" | "large";
};
const SecondaryButton = ({ onClick, label, icon, fontSize = "medium" }: SecondaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={` cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-surface border border-outline-variant text-on-surface-variant hover:text-primary transition-colors ${fontSize === "small" ? "text-label-sm py-1" : fontSize === "large" ? "text-label-lg py-3" : "text-label-md py-3"}  rounded-lg  transition-colors shadow-sm`
      }>
      {icon && (
        <span className="material-symbols-outlined text-[18px]">
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};

export default SecondaryButton;
