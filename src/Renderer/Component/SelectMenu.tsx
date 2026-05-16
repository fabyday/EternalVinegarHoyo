import React from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectMenuOption {
  value: string;
  label: string;
  description?: string;
  swatchColor?: string;
}

export interface SelectMenuProps {
  value: string;
  options: SelectMenuOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function SelectMenu({ value, options, onChange, label, className = "" }: SelectMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handle_pointer_down = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handle_key_down = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handle_pointer_down);
    window.addEventListener("keydown", handle_key_down);

    return () => {
      window.removeEventListener("pointerdown", handle_pointer_down);
      window.removeEventListener("keydown", handle_key_down);
    };
  }, [isOpen]);

  const handle_select = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0b1020] px-3 text-left text-sm text-slate-100 outline-none transition hover:border-white/20 hover:bg-white/[0.05] focus:border-white/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.swatchColor && (
            <span
              className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: selectedOption.swatchColor }}
            />
          )}
          <span className="min-w-0">
            <span className="block truncate font-semibold">{selectedOption?.label}</span>
            {selectedOption?.description && <span className="block truncate text-xs text-slate-500">{selectedOption.description}</span>}
          </span>
        </span>
        <ChevronDown size={16} className={`shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-[#0f172a] p-1 shadow-2xl shadow-black/40"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handle_select(option.value)}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition ${
                  isSelected ? "accent-selection text-white" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {option.swatchColor && (
                    <span className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white/10" style={{ backgroundColor: option.swatchColor }} />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{option.label}</span>
                    {option.description && <span className="block truncate text-xs text-slate-500">{option.description}</span>}
                  </span>
                </span>
                {isSelected && <Check size={16} className="shrink-0 accent-text" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
