import React from "react";

type BackButtonProps = {
  onBack: () => void;
  label: string;
};
const BackButton = ({ onBack, label }: BackButtonProps) => {
  return (
    <button
      className=" cursor-pointer  flex items-center justify-center gap-1 px-2 py-1 -ml-2 mb-4 text-primary font-label-md text-label-md hover:bg-surface-container-high rounded-lg transition-colors group"
      onClick={onBack}
    >
      <span className="material-symbols-outlined text-[20px]">
        chevron_left
      </span>
      <span className="">{label}</span>
    </button>
  );
};

export default BackButton;
