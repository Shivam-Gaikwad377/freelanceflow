import React from 'react'


type PrimaryButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string | null;
};
const PrimaryButton = ({ label, onClick, disabled, icon }: PrimaryButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} type="button" className="w-auto cursor-pointer flex items-center justify-center hover:scale-102 active:scale-98 transition-all duration-100 bg-primary text-on-primary py-3 rounded-lg font-label-md px-4 hover:bg-surface-tint  shadow-[0_4px_12px_rgba(70,72,212,0.2)]">
      {icon && <span className="material-symbols-outlined mr-2">{icon}</span>}
      {label}
    </button>
  )
}

export default PrimaryButton