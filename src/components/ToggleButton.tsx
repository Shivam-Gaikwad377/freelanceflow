import React from 'react';

interface ToggleProps {
    /** Current state of the toggle switch */
    enabled: boolean;
    /** Function called when state changes */
    onChange: (enabled: boolean) => void;
    /** Optional accessible label displayed next to the toggle */
    label?: string;
    /** Disable interactions */
    disabled?: boolean;
}

export const Toggle = ({
    enabled,
    onChange,
    label,
    disabled = false,
}: ToggleProps) => {
    return (
        <label
            className={`inline-flex items-center gap-3 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
        >
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                disabled={disabled}
                onClick={() => !disabled && onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:bg-primary-container focus:ring-offset-2 ${enabled ? 'bg-primary' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>

            {label && (
                <span className="text-sm font-medium text-gray-700">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Toggle;