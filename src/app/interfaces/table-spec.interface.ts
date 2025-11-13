
export interface TableColumnSpec {
  isPrimaryKey?: boolean;
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  color?: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | null | undefined;
}

export interface TableSpec {
  rows?: number;
  rowsPerPageOptions: number[];
  sortMode?: 'single' | 'multiple';
  selectionMode?: null | 'single' | 'multiple';
  columns: TableColumnSpec[];
  frozenColumns?: string[];
  defaultSortField?: string;
}
