import { FormlyFieldConfig } from "@ngx-formly/core";

export const LogoFormSpec: FormlyFieldConfig[] = [
  {
    key: 'n0_company_id',
    type: 'belongs-to',
    className: 'col-6',
    props: {
      required: true,
      label: 'Company',
      fromEntity: 'system.logos',
      toEntity: 'system.companies',
      fromField: 'n0_company_id',
      toField: 'n0_company_id',
    }
  },
  {
    key: 'sz_logo_description',
    type: 'input',
    className: 'col-6',
    props: {
      label: 'Logo Name',
      placeholder: 'Great Logo',
      required: true,
    }
  },
  {
    key: 'n0_retail_type_id',
    type: 'belongs-to',
    className: 'col-6',
    props: {
      required: true,
      label: 'Retail Type',
      fromEntity: 'system.logos',
      toEntity: 'system.retail_types',
      fromField: 'n0_retail_type_id',
      toField: 'n0_retail_type_id',
    }
  },
  {
    key: 'sz_vat_number',
    type: 'input',
    className: 'col-6',
    props: {
      label: 'VAT Number',
      placeholder: 'IT00000000000',
      required: true,
    }
  },
];