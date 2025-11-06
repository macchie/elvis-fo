import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

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
  type: string;
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
  formSpec?: FormlyFieldConfig[];
}

@Injectable({
  providedIn: 'root',
})
export class MockData {

  public TABLES = [
    'system.store',
    'system.users',
    'system.companies',
    'system.logos',
    'system.store_device_types',
    'system.devices',
  ]

  SERVER_HOST = 'beta.elvispos.com';

  tableInfo: { [key: string]: TableInfo; } = {};

  get tableInfoArray(): TableInfo[] {
    return Object.values(this.tableInfo);
  }
  
  constructor(
    private http: HttpClient
  ) {}

  async init() {
    const _requests = [];

    for (const _table of this.TABLES) {
      const [_schema, _tableName] = _table.split('.');
      _requests.push(this.getTableDefinition(_schema, _tableName));
    }

    const _tableDefinitions = await Promise.all(_requests);

    for (const _tableDef of _tableDefinitions) {
      const key = `${_tableDef.table_schema}.${_tableDef.table_name}`;
      this.tableInfo[key] = _tableDef;
    }

    let _formSpecsCount = 0;
    const _formSpecs = await this.getFormDefinitions();

    for (const _spec of _formSpecs) {
      this.tableInfo[_spec.host_id].formSpec = _spec.data;
      _formSpecsCount++;
    }

    console.log(`Loaded Form Definitions: ${Object.keys(_formSpecsCount).length}x`);
  }

  async getEntities(_table: string): Promise<any[]> {
    const query = `SELECT * FROM ${_table} LIMIT 100`;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Found Entities for ${_table}:`, _resp);
      return _resp;
    } catch (error) {
      console.warn('Error fetching Entities:', error);
      return [];
    }
  }

  async getEntity(_table: string): Promise<{ id: string, host_id: string, data: FormlyFieldConfig[] }[]> {
    const query = `SELECT * FROM ${_table} LIMIT 1`;

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

  async getFormDefinitions(): Promise<{ id: string, host_id: string, data: FormlyFieldConfig[] }[]> {
    const query = `SELECT * FROM frontoffice.entity_form_specs`;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Found Form Definitions: ${_resp.length}x`);
      return _resp as { id: string, host_id: string, data: FormlyFieldConfig[] }[];
    } catch (error) {
      console.warn('Error fetching form definition:', error);
      return [];
    }
  }

  async onSaveFormDefinition(hostId: string, formSpec: FormlyFieldConfig[]) {
    const query = `
      INSERT INTO frontoffice.entity_form_specs (host_id, data)
      VALUES ('${hostId}', $$${JSON.stringify(formSpec)}$$)
      ON CONFLICT (host_id) DO UPDATE SET data = EXCLUDED.data
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Saved Form Definition for ${hostId}`, _resp);
      return _resp;
    } catch (error) {
      console.warn('Error saving form definition:', error);
      return null;
    }
  }

  async getFormDefinition(schemaName: string, tableName: string): Promise<FormlyFieldConfig[]> {
    const query = `
      SELECT * FROM frontoffice.entity_form_specs
      WHERE host_id = '${schemaName}.${tableName}'
    `;

    try {
      const _resp = await this.execute(RemoteLookupCommand.CMD_FREE_QUERY_JSONARRAY, query);
      console.log(`Form Definition for ${schemaName}.${tableName}`, _resp[0].data);
      return _resp[0].data as FormlyFieldConfig[];
    } catch (error) {
      console.warn('Error fetching form definition:', error);
      return [];
    }
  }

  
  async execute(command: RemoteLookupCommand, query: string, host = this.SERVER_HOST): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          host: host,
          path: `/api/db-operations/remote-lookup`,
          port: '7392',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        };

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
