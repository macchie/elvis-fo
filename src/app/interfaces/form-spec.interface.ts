import { FormlyFieldConfig } from "@ngx-formly/core";

export interface ElvisFormlyFieldConfig extends FormlyFieldConfig {
  __builderType?: 'input' | 'layout';
  __builderWrapper?: string;
  __builderRules?: {
    type: 'disabled' | 'hidden';
    field?: string;
    condition?: 'IS NULL' | 'IS NOT NULL' | '=';
  }[];
}
export interface FormSpec {
  fields: ElvisFormlyFieldConfig[];
}
