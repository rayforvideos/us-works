export type FormValuesWatcherProps<TValues> = {
  values: TValues;
  onChange?: (values: TValues) => void;
};
