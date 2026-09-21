export type DateTimeFieldProps = {
  value: string;
  onValueChange: (next: string) => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  min?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
};
