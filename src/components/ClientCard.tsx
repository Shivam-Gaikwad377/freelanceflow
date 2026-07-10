import React from "react";

import StatusBadge from "./StatusBadge";
import ClientInitialBadge from "./ClientInitialBadge";
type ClientCardProps = {
  name: string;
  phone: string;
  email: string;
  status: string;
  totalBilled?: string | number | null | undefined;
};


const ClientCard = ({ name, phone, email, status, totalBilled }: ClientCardProps) => {
 
 
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-[0_8px_24px_-4px_rgba(70,72,212,0.04)] transition-shadow cursor-pointer group">
      <div className="flex justify-between items-center mb-md e-2">
        <div className="flex items-center gap-md">
          <ClientInitialBadge name={name} size="medium" />
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
              {name}
            </h3>
            
          </div>
        </div>
        <StatusBadge color={status === "active" ? "success" : "normal"} label={status} fontSize="small" />
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
    </div>
  );
};

export default ClientCard;
