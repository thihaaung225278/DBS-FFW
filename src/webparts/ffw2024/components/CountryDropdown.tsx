import * as React from 'react';
import type { ICountryOption } from './countries';

export interface ICountryDropdownProps {
  id: string;
  options: ICountryOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const CountryDropdown: React.FC<ICountryDropdownProps> = ({
  id,
  options,
  selectedValue,
  onChange
}) => {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  let selected = options[0];
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === selectedValue) {
      selected = options[i];
      break;
    }
  }

  return (
    <div className="dropdown">
      <div
        ref={rootRef}
        id={id}
        className="custom-dropdown"
      >
        <div
          className="selected-option"
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((prev) => !prev);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        >
          {selected?.label || 'Select'}
        </div>
        <ul
          className="dropdown-list"
          role="listbox"
          style={{ display: open ? 'block' : 'none' }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              data-value={option.value}
              role="option"
              aria-selected={option.value === selectedValue}
              className={option.value === selectedValue ? 'selected' : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
