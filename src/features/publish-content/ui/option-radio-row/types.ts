type PublishOption = {
  value: string;
  label: string;
};

export type OptionRadioRowProps = {
  label: string;
  name: string;
  options: readonly PublishOption[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  disabledValues?: readonly string[];
};
