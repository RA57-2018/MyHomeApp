import { AxiosResponse } from 'axios';
import { RowData } from '@tanstack/react-table';

type CamelToSnake<T extends string, P extends string = ''> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
  ? CamelToSnake<R, `${P}${C0 extends Lowercase<C0> ? '' : '_'}${Lowercase<C0>}`>
  : P;

export type CamelToSnakeKeys<T> = {
  [K in keyof T as CamelToSnake<Extract<K, string>>]: T[K];
};

export type Options = {
  onSuccess: (response?: AxiosResponse) => void;
  onError: (error?: unknown) => void;
  enabled?: boolean;
};

export type SelectOption = {
  value: string | number;
  label: string;
};

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    tooltip?: string;
  }
};

