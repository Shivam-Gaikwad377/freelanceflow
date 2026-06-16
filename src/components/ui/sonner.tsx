"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group z-[100]"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl border shadow-md text-sm font-medium",
          success: "bg-green-50 text-green-800 border-green-200",
          error:   "bg-red-50 text-red-800 border-red-200",
          warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
          info:    "bg-blue-50 text-blue-800 border-blue-200",
          icon:    "shrink-0",
          title:   "flex-1",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
