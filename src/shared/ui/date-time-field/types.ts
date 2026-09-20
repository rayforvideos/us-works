export type DateTimeFieldProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  min?: string;
  step?: number;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
};
