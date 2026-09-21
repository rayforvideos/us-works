type PublishOption<TValue extends string> = {
  value: TValue;
  label: string;
};

export type OptionRadioRowProps<TValue extends string> = {
  label: string;
  name: string;
  options: readonly PublishOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  disabled: boolean;
  disabledValues?: readonly TValue[];
};
