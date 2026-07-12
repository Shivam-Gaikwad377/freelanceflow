import React,{useState} from "react";

import StatusBadge from "../Invoice/StatusBadge";
import ClientInitialBadge from "./ClientInitialBadge";
import ConfirmationBox from "../confirmationBox";
type ClientCardProps = {
  name: string;
  phone: string;
  email: string;
  status: string;
  totalBilled?: string | number | null | undefined;
  onClick?: () => void;
  onDelete?: () => Promise<void>;
};

const ClientCard = ({
  name,
  phone,
  email,
  status,
  totalBilled,
  onClick,
  onDelete,
}: ClientCardProps) => {
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const confirmHandler = async () => {
    await onDelete?.();
    setShowConfirmCard(false);
  }
  return (
    <div onClick={onClick} className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-[0_8px_24px_-4px_rgba(70,72,212,0.04)] transition-shadow cursor-pointer group">
      <div className="flex justify-between items-center mb-md e-2">
        <div className="flex items-center gap-md">
          <ClientInitialBadge name={name} size="medium" />
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <StatusBadge
            color={status === "active" ? "success" : "normal"}
            label={status}
            fontSize="small"
          />
          <span
            onClick={(e) => {
              e.stopPropagation(); // stops it from reaching the card's onClick
              setShowConfirmCard(true);
            }}
            className="hover:text-primary  duration-200 material-symbols-outlined text-[20px] group-hover:opacity-100 opacity-0 transition-all"
          >
            delete
          </span>
        </div>
      </div>
      <div className="space-y-sm mb-lg">
        <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[16px]">mail</span>
          {email}
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[16px]">call</span>
          {phone}
        </div>
      </div>
      <div className="pt-md border-t border-surface-variant flex justify-between items-center">
        <span className="font-label-md text-label-md text-on-surface-variant">
          Total Billed
        </span>
        <span className="font-headline-sm text-headline-sm text-on-surface">
          {totalBilled?.toLocaleString()}
        </span>
      </div>
      {showConfirmCard && (
        <ConfirmationBox
          message="Are you sure you want to delete this client? "
          message2="Deleting this client will also delete all associated projects and invoices."
          onConfirm={confirmHandler}
          onCancel={() => setShowConfirmCard(false)}
        />
      )}
    </div>
  );
};

export default ClientCard;
