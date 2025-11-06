import { FormlyFieldConfig } from "@ngx-formly/core";
import { TableColumnInfo } from "../mock-data";

export const CompanyTableSpec: TableColumnInfo[] = [
  {
      "name": "n0_company_id",
      "description": "ID",
      "type": "integer",
      "nullable": false,
      "default": "nextval('system.companies_n0_company_id_seq_1'::regclass)",
      "is_primary_key": true,
      "is_foreign_key": false,
      "foreign_keys": []
  },
  {
      "name": "sz_company_name",
      "description": "Name",
      "type": null,
      "nullable": false,
      "default": null,
      "is_primary_key": false,
      "is_foreign_key": false,
      "foreign_keys": []
  },
  {
      "name": "sz_description",
      "description": "Description",
      "type": null,
      "nullable": false,
      "default": null,
      "is_primary_key": false,
      "is_foreign_key": false,
      "foreign_keys": []
  },
  {
      "name": "sz_address",
      "description": "Address",
      "type": null,
      "nullable": false,
      "default": null,
      "is_primary_key": false,
      "is_foreign_key": false,
      "foreign_keys": []
  },
  // {
  //     "name": "sz_theme",
  //     "description": "Theme",
  //     "type": null,
  //     "nullable": true,
  //     "default": null,
  //     "is_primary_key": false,
  //     "is_foreign_key": false,
  //     "foreign_keys": []
  // },
  {
      "name": "dt_created",
      "description": "Created At",
      "type": "timestamp without time zone",
      "nullable": true,
      "default": "now()",
      "is_primary_key": false,
      "is_foreign_key": false,
      "foreign_keys": []
  },
  // {
  //     "name": "sz_created_by",
  //     "description": "Created By",
  //     "type": null,
  //     "nullable": true,
  //     "default": null,
  //     "is_primary_key": false,
  //     "is_foreign_key": false,
  //     "foreign_keys": []
  // },
  {
      "name": "dt_updated",
      "description": "Updated At",
      "type": "timestamp without time zone",
      "nullable": true,
      "default": null,
      "is_primary_key": false,
      "is_foreign_key": false,
      "foreign_keys": []
  },
  // {
  //     "name": "sz_updated_by",
  //     "description": "Updated By",
  //     "type": null,
  //     "nullable": true,
  //     "default": null,
  //     "is_primary_key": false,
  //     "is_foreign_key": false,
  //     "foreign_keys": []
  // },
  // {
  //     "name": "dt_deleted",
  //     "description": "Deleted At",
  //     "type": "timestamp without time zone",
  //     "nullable": true,
  //     "default": null,
  //     "is_primary_key": false,
  //     "is_foreign_key": false,
  //     "foreign_keys": []
  // }
];