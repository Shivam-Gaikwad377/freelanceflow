import React from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

type ConfirmationBoxProps = {
  message: string;
  message2?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};
const ConfirmationBox = ({
  message,
  onConfirm,
  onCancel,
  message2,
}: ConfirmationBoxProps) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className=" inset-0 flex items-center justify-center h-screen fixed bg-black/40 rounded-xl z-50"
    >
      <div className="bg-surface  border border-outline-variant/40 rounded-xl p-lg flex flex-col items-center gap-sm w-auto h-auto">
        <p className="text-on-surface ">{message}</p>
        {message2 && <p className="text-on-surface-variant font-bold">{message2}</p>}
        <div className="flex items-center gap-4 mt-md">
            <PrimaryButton label="Confirm" onClick={onConfirm} />
            <SecondaryButton
              icon=""
              fontSize="medium"
              label="Cancel"
              onClick={onCancel}
            />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
