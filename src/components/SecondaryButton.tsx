import React from "react";
type SecondaryButtonProps = {
    onClick: () => void;
    label: string;
    icon: string | null;
};
const SecondaryButton = ({ onClick, label, icon }: SecondaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-outline-variant text-primary font-label-md  rounded-lg hover:bg-surface-container-high transition-colors shadow-sm"
    >
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
