import { FormlyFieldConfig } from "@ngx-formly/core";

export interface ElvisFormlyFieldConfig extends FormlyFieldConfig {
  __builderType?: 'input' | 'layout';
  __builderWrapper?: string;
}
export interface FormSpec {
  fields: ElvisFormlyFieldConfig[];
}
