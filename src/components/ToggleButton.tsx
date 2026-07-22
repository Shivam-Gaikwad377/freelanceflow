import { useState } from "react";

/**
 * Size presets — hoisted out of the component so it isn't
 * reallocated on every render.
 */
const SIZES = {
  sm: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "translate-x-4" },
  md: { track: "h-6 w-11", thumb: "h-5 w-5", translate: "translate-x-5" },
  lg: { track: "h-7 w-14", thumb: "h-6 w-6", translate: "translate-x-7" },
};

type Size = "sm" | "md" | "lg";

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: Size;
}

const Toggle = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  size = "md",
}: ToggleProps) => {
  // Controlled if the parent passes `checked` at all — even `checked={false}`.
  // This mirrors how <input checked> works, so it's the least surprising API.
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isOn = isControlled ? checked : internalChecked;

  function handleToggle() {
    if (disabled) return;
    const next = !isOn;
    // Only touch internal state when uncontrolled — otherwise the parent's
    // prop is the single source of truth and we'd fight it.
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }

  const { track, thumb, translate } = SIZES[size];

  return (
    <label
      className={`inline-flex items-center gap-3 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      {/*
        Real <button>, not a styled <div>. Native buttons already handle
        Enter/Space and focus correctly — reimplementing that with
        onKeyDown on a div is extra code that's also easier to get wrong.
      */}
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex ${track} shrink-0 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
          ${isOn ? "bg-indigo-600" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block ${thumb} transform rounded-full bg-white shadow
            transition-transform duration-200 ease-in-out
            ${isOn ? translate : "translate-x-1"}`}
        />
      </button>
      {label && (
        <span className="select-none text-sm font-medium text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
}

export default Toggle;
