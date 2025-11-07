
export const DefaultTableSpec = {
    paginator: true,
    rowsPerPageOptions: [5, 10, 20],
    stripedRows: true,
    // sortMode: 'multiple',
    // selectionMode: 'single',
}
export interface TableSpec {
  frozenColumns?: any[];
  paginator: boolean;
  stripedRows: boolean;
  rowsPerPageOptions: number[];
  sortMode?: 'single' | 'multiple';
  selectionMode?: 'single' | 'multiple';
  columnsSpec?: {
    field: string;
    name: string;
    sortable?: boolean;
    filterable?: boolean;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
    width?: string;
    template?: any;
  }[];
}

export const CompanyTableSpec: TableSpec = {
    paginator: true,
    rowsPerPageOptions: DefaultTableSpec.rowsPerPageOptions,
    stripedRows: DefaultTableSpec.stripedRows,
    columnsSpec: [
        {
            field: 'n0_company_id',
            name: 'ID',
            sortable: true,
        },
        {
            field: 'sz_company_name',
            name: 'Name',
        },
        {
            field: 'sz_description',
            name: 'Description',
        },
        {
            field: 'dt_created',
            name: 'Created',
            type: 'date',
            sortable: true,
        },
        {
            field: 'dt_updated',
            name: 'Updated',
            type: 'date',
            sortable: true,
        }
    ]
};