export interface IMappingPattern {
  field: string;
  key: string;
  type?: "string" | "number" | "boolean";
}

export enum DataDirective {
  BLANK,
}

export type ICellValue = string | number | boolean;
export type IDataValue = Record<string, ICellValue> | DataDirective;