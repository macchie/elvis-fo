
export interface TableColumnSpec {
  isPrimaryKey?: boolean;
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'barcode' | 'relation' | 'custom';
  color?: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | null | undefined;
  formatting?: string[] | null | undefined;
  hidden: boolean;
  relationTo?: string;
  relationToField?: string;
  relationToDisplayField?: string;
}

export interface TableSpec {
  logicalDeleteColumns?: string[];
  disableExport?: boolean;
  disableActions?: boolean;

  rows?: number;
  rowsPerPageOptions: number[];
  sortMode?: 'single' | 'multiple';
  selectionMode?: null | 'single' | 'multiple';
  columns: TableColumnSpec[];
  frozenColumns?: string[];
  defaultSortField?: string;
}
