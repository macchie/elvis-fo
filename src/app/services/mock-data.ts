import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumnSpec, TableSpec } from '../interfaces/table-spec.interface';
import { PagedResult } from './api-service';
import { Observable } from 'rxjs';
import { FormSpec } from '../interfaces/form-spec.interface';

export enum RemoteLookupCommand {
  CMD_FREE_QUERY_REMOTE = 1000,
  CMD_FREE_QUERY = 1001,
  CMD_FREE_QUERY_FAST = 1002,
  CMD_FREE_QUERY_JSONARRAY = 1003,
}

export interface ColumnForeignKeyInfo {
  constraint_name: string;
  ref_schema: string;
  ref_table: string;
  ref_column: string;
  match_option: string;
  update_rule: string;
  delete_rule: string;
}

export interface TableColumnInfo {
  name: string;
  description?: string;
  type: string | null;
  nullable: boolean;
  default: any;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  foreign_keys: ColumnForeignKeyInfo[];
}

export interface TableInfo {
  name: string;
  table_schema: string;
  table_name: string;
  primary_key: string;
  columns: TableColumnInfo[];
}

@Injectable({
  providedIn: 'root',
})
export class MockData {

  public TABLES = [
    'system.velocity_codes',
    'auth.user',
    'elvispos.departments',
    'system.store',
    'system.users',
    'system.companies',
    'system.logos',
    'system.store_device_types',
    'system.devices',
    'elvispos.barcode_price_new',
    'elvispos.vat_tax_rates',
  ]

  SERVER_HOST = 'beta.elvispos.com';

  tableInfo: { [key: string]: TableInfo; } = {};
  formSpecs: { [key: string]: FormSpec; } = {};
  tableSpecs: { [key: string]: TableSpec; } = {};

  imageBuckets: any = {
    'system.velocity_codes': 'http://beta.elvispos.com:8080/assets/pos/velocity-code-images/',
    'elvispos.barcode_price_new': 'http://beta.elvispos.com:8080/assets/pos/article-images/',
  }

  get tableInfoArray(): TableInfo[] {
    return Object.values(this.tableInfo);
  }
  
  constructor(
    private http: HttpClient
  ) {}

  async init() {
    console.time('MockData Load');
    const _requests = [];

    for (const _table of this.TABLES) {
      const [_schema, _tableName] = _table.split('.');
      _requests.push(this.getTableDefinition(_schema, _tableName));
      this.formSpecs[_table] = { fields: [] };
    }

    const _tableDefinitions = await Promise.all(_requests);

    for (const _tableDef of _tableDefinitions) {
      const key = `${_tableDef.table_schema}.${_tableDef.table_name}`;
      this.tableInfo[key] = _tableDef;
    }

    const _formSpecs = await this.getFormSpecs();
    for (const _spec of _formSpecs) {
      this.formSpecs[_spec.host_id] = _spec.data;
    }

    const _tableSpecs = await this.getTableSpecs();
    for (const _spec of _tableSpecs) {
      this.tableSpecs[_spec.host_id] = _spec.data;
    }

    console.log('Table Specs Loaded:', this.tableSpecs);
    
    for (const _table of this.TABLES) {
      if (!this.tableSpecs[_table]) {
        this.tableSpecs[_table] = this.createSpecFromTableInfo(this.tableInfo[_table]);
      }
    }

    console.log('Table Info Loaded:', this.tableInfo);
    console.log('Table Specs:', this.tableSpecs);

    console.timeEnd('MockData Load');
  }

  createSpecFromTableInfo(_tableInfo: TableInfo): TableSpec {
    const _spec: TableSpec = {
      rows: 15,
      rowsPerPageOptions: [15, 30, 50],
      sortMode: 'single',
      columns: [],
      defaultSortField: _tableInfo.primary_key.split(', ')[0] || undefined,
    };

    for (const _col of _tableInfo.columns) {
      const _colSpec: TableColumnSpec = {
        field: _col.name,
        header: _col.name.replace(/(n0_|n2_|sz_|dt_|bl_|j_)/g, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        sortable: true,
        filterable: true,
        hidden: false,
      }
      
      _tableInfo.primary_key.split(', ').includes(_col.name) ? _colSpec.isPrimaryKey = true : null;

      switch (_col.type) {
        case 'integer':
        case 'bigint':
        case 'numeric':
        case 'decimal':
          _colSpec.type = 'number';
          break;
        case 'date':
        case 'timestamp without time zone':
        case 'timestamp with time zone':
          _colSpec.type = 'date';
          break;
        case 'boolean':
          _colSpec.type = 'boolean';
          break;
        default:
          _colSpec.type = 'text';
          break;
      }

      _spec.columns.push(_colSpec);
    }

    return _spec;
  }

  async getEntities(_table: string): Promise<any[]> {
    const orderBy = this.tableInfo[_table]?.primary_key ? ` ORDER BY ${this.tableInfo[_table].primary_key} ASC ` : '';
    const query = `SELECT * FROM ${_table} ${orderBy} LIMIT 100`;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Found Entities for ${_table}:`, _resp);
      return _resp;
    } catch (error) {
      console.warn('Error fetching Entities:', error);
      return [];
    }
  }

  async getEntity(_table: string, _entityId: string | number): Promise<{ id: string, host_id: string, data: FormlyFieldConfig[] }[]> {
    const whereClause = this.tableInfo[_table]?.primary_key ? ` WHERE ${this.tableInfo[_table].primary_key} = '${_entityId}' ` : '';
    const query = `SELECT * FROM ${_table} ${whereClause} LIMIT 1`;

    console.log('Get Entity Query:', query);

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Found Entity for ${_table}:`, _resp);
      return _resp[0];
    } catch (error) {
      console.warn('Error fetching form definition:', error);
      return [];
    }
  }

  async getTableDefinition(schemaName: string, tableName: string): Promise<any> {
    const query = `
      WITH
      pk AS (
        SELECT
            kcu.table_schema,
            kcu.table_name,
            kcu.column_name,
            kcu.ordinal_position
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema   = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
      ),
      pk_agg AS (
        SELECT
            table_schema,
            table_name,
            string_agg(column_name, ', ' ORDER BY ordinal_position) AS primary_key
        FROM pk
        GROUP BY table_schema, table_name
      ),
      fk AS (
        SELECT
            tc.table_schema,
            tc.table_name,
            kcu.column_name,
            tc.constraint_name,
            rc.unique_constraint_schema AS ref_schema,
            ccu.table_name              AS ref_table,
            ccu.column_name             AS ref_column,
            rc.update_rule,
            rc.delete_rule,
            rc.match_option
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema   = kcu.table_schema
        JOIN information_schema.referential_constraints rc
          ON rc.constraint_name = tc.constraint_name
        AND rc.constraint_schema = tc.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = rc.unique_constraint_name
        AND ccu.constraint_schema = rc.unique_constraint_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
      ),
      fk_per_col AS (
        SELECT
            table_schema,
            table_name,
            column_name,
            json_agg(
              json_build_object(
                'constraint_name', constraint_name,
                'ref_schema',      ref_schema,
                'ref_table',       ref_table,
                'ref_column',      ref_column,
                'update_rule',     update_rule,
                'delete_rule',     delete_rule,
                'match_option',    match_option
              )
              ORDER BY constraint_name
            ) AS foreign_keys
        FROM fk
        GROUP BY table_schema, table_name, column_name
      )
      SELECT
        c.table_schema,
        c.table_name,
        COALESCE(pka.primary_key, '') AS primary_key,
        json_agg(
          json_build_object(
            'name',          c.column_name,
            'type',          CASE
                              WHEN c.data_type IN ('character varying','character')
                                THEN c.data_type || '(' || c.character_maximum_length || ')'
                              WHEN c.data_type IN ('numeric','decimal')
                                THEN c.data_type || '(' || c.numeric_precision || ',' || c.numeric_scale || ')'
                              ELSE c.data_type
                            END,
            'nullable',      (c.is_nullable = 'YES'),
            'default',       c.column_default,
            'is_primary_key', (pk.column_name IS NOT NULL),
            'is_foreign_key', (fkpc.foreign_keys IS NOT NULL),
            'foreign_keys',  COALESCE(fkpc.foreign_keys, '[]'::json)
          )
          ORDER BY c.ordinal_position
        ) AS columns
      FROM information_schema.columns c
      LEFT JOIN pk        pk   ON pk.table_schema = c.table_schema
                              AND pk.table_name   = c.table_name
                              AND pk.column_name  = c.column_name
      LEFT JOIN pk_agg    pka  ON pka.table_schema = c.table_schema
                              AND pka.table_name   = c.table_name
      LEFT JOIN fk_per_col fkpc ON fkpc.table_schema = c.table_schema
                              AND fkpc.table_name   = c.table_name
                              AND fkpc.column_name  = c.column_name
      WHERE c.table_schema = '${schemaName}'
        AND c.table_name   = '${tableName}'
      GROUP BY c.table_schema, c.table_name, pka.primary_key;
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      _resp[0].name = `${schemaName}.${tableName}`;
      return _resp[0] as TableInfo;
    } catch (error) {
      return null;
    }
  }

  async getFormSpecs(): Promise<{ id: string, host_id: string, data: FormSpec }[]> {
    const query = `SELECT * FROM frontoffice.entity_form_specs`;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Found Form Specs: ${_resp.length}x`);
      return _resp as { id: string, host_id: string, data: FormSpec }[];
    } catch (error) {
      console.warn('Error fetching Form Specs:', error);
      return [];
    }
  }

  async getTableSpecs(): Promise<{ id: string, host_id: string, data: TableSpec }[]> {
    const query = `SELECT * FROM frontoffice.entity_specs`;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Found Table Specs: ${_resp.length}x`);
      return _resp as { id: string, host_id: string, data: TableSpec }[];
    } catch (error) {
      console.warn('Error fetching Table Specs:', error);
      return [];
    }
  }

  async onSaveFormSpec(hostId: string, formSpec: FormSpec) {
    const query = `
      INSERT INTO frontoffice.entity_form_specs (host_id, data)
      VALUES ('${hostId}', $$${JSON.stringify(formSpec)}$$)
      ON CONFLICT (host_id) DO UPDATE SET data = EXCLUDED.data
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Saved Form Spec for ${hostId}`, _resp);
      return _resp;
    } catch (error) {
      console.warn('Error saving Form Spec:', error);
      return null;
    }
  }

  async onSaveTableSpec(hostId: string, tableSpec: TableSpec) {
    const query = `
      INSERT INTO frontoffice.entity_specs (host_id, data)
      VALUES ('${hostId}', $$${JSON.stringify(tableSpec)}$$)
      ON CONFLICT (host_id) DO UPDATE SET data = EXCLUDED.data
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Saved Table Spec for ${hostId}`, _resp);
      return _resp;
    } catch (error) {
      console.warn('Error saving Table Spec:', error);
      return null;
    }
  }

  async getFormSpec(schemaName: string, tableName: string): Promise<FormlyFieldConfig[]> {
    const query = `
      SELECT * FROM frontoffice.entity_form_specs
      WHERE host_id = '${schemaName}.${tableName}'
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Form Spec for ${schemaName}.${tableName}`, _resp[0].data);
      return _resp[0].data as FormlyFieldConfig[];
    } catch (error) {
      console.warn('Error fetching Form Spec:', error);
      return [];
    }
  }

  async getTableSpec(schemaName: string, tableName: string): Promise<FormlyFieldConfig[]> {
    const query = `
      SELECT * FROM frontoffice.entity_specs
      WHERE host_id = '${schemaName}.${tableName}'
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Table Spec for ${schemaName}.${tableName}`, _resp[0].data);
      return _resp[0].data as FormlyFieldConfig[];
    } catch (error) {
      console.warn('Error fetching Table Spec:', error);
      return [];
    }
  }

  fetchItems<T>(
    schemaName: string, 
    tableName: string,
    tableSpec: TableSpec,
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: 'asc' | 'desc',
    filterField?: string,
    filterValue?: any
  ): Observable<PagedResult<T>> {

    const _relationColumns = tableSpec.columns.filter(col => col.type === 'relation' && !col.hidden);
    let _relationSelects = '';
    let _relationJoins = '';

    if (_relationColumns.length > 0) {
      _relationColumns.forEach((col, index) => {
        const alias = `rel_${col.field}`;
        _relationSelects += `, TRIM(${alias}.${col.relationToDisplayField}::text) AS ${col.field}__display `;
        _relationJoins += `LEFT JOIN ${col.relationTo} ${alias} ON (it.${col.field} = ${alias}.${col.relationToField})`;
      });
    }

    const _query = `
      WITH
        paged AS (
          SELECT
            it.*
            ${_relationSelects}
          FROM ${schemaName}.${tableName} it
          ${_relationJoins}
          ${ sortField ? `ORDER BY it.${sortField} ${sortOrder?.toUpperCase()}` : '' }
          LIMIT ${limit} 
          OFFSET ${offset}
        )
      SELECT
        json_build_object(
          'data',  (SELECT json_agg(row_to_json(p)) FROM paged p),
          'total', (SELECT count(*) FROM ${schemaName}.${tableName})
        ) AS result;
    `;

    console.log('Generated Query:', _query);
    // WHERE
    //   (:filter_status IS NULL OR it.status = :filter_status)
    //   AND (:filter_search IS NULL OR it.name ILIKE '%' || :filter_search || '%')
    // ORDER BY
    //   CASE WHEN :sort_field = 'name'        AND :sort_order = 'asc'  THEN it.name END        ASC,
    //   CASE WHEN :sort_field = 'name'        AND :sort_order = 'desc' THEN it.name END        DESC,
    //   CASE WHEN :sort_field = 'created_at'  AND :sort_order = 'asc'  THEN it.created_at END  ASC,
    //   CASE WHEN :sort_field = 'created_at'  AND :sort_order = 'desc' THEN it.created_at END  DESC,
    //   it.id  -- fallback

    return this.http.post<PagedResult<T>>(`http://${this.SERVER_HOST}:7392/api/db-operations/remote-lookup`, {
      request: {
        query: _query,
        command: RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY
      }
    })
  }

  
  async execute(command: RemoteLookupCommand, query: string, host = this.SERVER_HOST): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.http.post<string>(`http://${host}:7392/api/db-operations/remote-lookup`, {
          request: {
            query: query,
            command: command
          }
        }).subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (error) => {
            if (error.text?.trim() === 'NO RECORD FOUND') {
              return resolve([]);
            }
            console.error('There was an error!', error);
            return reject(error);
          }
        });
      } catch (error) {
        console.error(`RemoteLookup Error!`);
        return reject(error);
      }
    });
  }
}
