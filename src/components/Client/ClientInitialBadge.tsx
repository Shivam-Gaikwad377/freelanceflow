import React from "react";
type StatusColor = {
  [key: string]: string;
};
type ClientInitialBadgeProps = {
  name: string;
  size: "small" | "medium" | "large";
};

const ClientInitialBadge = ({ name, size }: ClientInitialBadgeProps) => {
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
    <div
      className={`${clientInitialsColor[name.charAt(0).toUpperCase()]}${ size === "small" ? " w-9 h-9 text-sm " : size === "medium" ? " w-12 h-12 text-xl font-bold" : " w-20 h-20 text-headline-lg font-bold" } rounded-full flex items-center   justify-center object-cover border  border-surface-variant`}
    >
      {name.charAt(0).toUpperCase() +
        name.split(" ").slice(-1)[0].charAt(0).toUpperCase()}
    </div>
  );
};

export default ClientInitialBadge;
