export type FromRowComponent = (data: ITableDataDefinition, column: string) => JSX.Element;

export interface IColumnDefinition {
  name: string;
  key: string;
  showname?: string;
  className?: string;
  component?: FromRowComponent;
}

export interface ITableDataDefinition {
  [s: string]: string | number;
}

export interface ITableBaseProps {
  columns: IColumnDefinition[];
  data: ITableDataDefinition[];
  key_column: string;
  caption?: string;
  className?: string;
  scrollableHeight?: number;
}
