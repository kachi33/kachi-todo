import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
  containerClassName?: string;
  dropdownClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, dropdownClassName, children, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className={cn("relative", containerClassName)}>
        <select
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
            className
          )}
          style={{
            backgroundImage: 'none',
          }}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
        <style>{`
          select option {
            ${dropdownClassName ? `background-color: inherit; padding: 0.5rem; font-size: 0.875rem;` : ''}
          }
        `}</style>
      </div>
    );
  }
);
Select.displayName = "Select";

const SelectTrigger = Select;
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SelectValue = ({ placeholder }: { placeholder?: string }) => null;
const SelectItem = ({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <option value={value} className={className}>{children}</option>
);

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
}