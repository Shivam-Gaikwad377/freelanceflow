import React from "react";
type ClientCardProps = {
  name: string;
  phone: string;
  email: string;
  status: string;
  totalBilled?: number;
};
type StatusColor = {
  [key: string]: string;
};

const ClientCard = ({ name, phone, email, status, totalBilled }: ClientCardProps) => {
  const statusColor: StatusColor = {
    active: "bg-secondary-container text-on-secondary-container",
    inactive: "bg-surface-variant text-on-surface-variant",
  };
  const clientInitialsColor: StatusColor = {
    A: "bg-amber-200", // Amber
    B: "bg-blue-200", // Blue
    C: "bg-cyan-200", // Cyan
    D: "bg-slate-200", // Denim / Dark Slate
    E: "bg-emerald-200", // Emerald
    F: "bg-fuchsia-200", // Fuchsia
    G: "bg-green-200", // Green
    H: "bg-yellow-200", // Honey
    I: "bg-indigo-200", // Indigo
    J: "bg-teal-200", // Jade
    K: "bg-stone-200", // Khaki
    L: "bg-lime-200", // Lime
    M: "bg-rose-200", // Magenta / Maroon
    N: "bg-blue-100", // Navy (Soft tint)
    O: "bg-orange-200", // Orange
    P: "bg-purple-200", // Purple
    Q: "bg-zinc-200", // Quartz
    R: "bg-red-200", // Red
    S: "bg-sky-200", // Sky
    T: "bg-teal-100", // Teal
    U: "bg-indigo-100", // Ultramarine (Soft tint)
    V: "bg-violet-200", // Violet
    W: "bg-rose-100", // Wine (Soft tint)
    X: "bg-lime-100", // Xanthic
    Y: "bg-yellow-100", // Yellow
    Z: "bg-zinc-100",
  };
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-[0_8px_24px_-4px_rgba(70,72,212,0.04)] transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start mb-md">
        <div className="flex items-center gap-md">
          <div
            className={`${clientInitialsColor[name.charAt(0).toUpperCase()]} w-12 h-12 rounded-full flex items-center font-bold text-xl justify-center object-cover border  border-surface-variant`}
          >
            {name.charAt(0).toUpperCase() +
              name.split(" ").slice(-1)[0].charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {email}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wide ${statusColor[status] || statusColor.inactive}`}
        >
          {status}
        </span>
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
