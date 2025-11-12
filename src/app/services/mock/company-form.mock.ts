import { FormlyFieldConfig } from "@ngx-formly/core";

export const CompanyFormSpec: FormlyFieldConfig[] = [
  {
    key: 'sz_company_name',
    type: 'input',
    className: 'col-6',
    props: {
      label: 'Company Name',
      placeholder: 'ACME Ltd',
      required: true,
    },
  },
  {
    key: 'sz_company_description',
    type: 'input',
    className: 'col-6',
    props: {
      label: 'Company Description',
      placeholder: 'A great company',
      required: true,
    },
    expressions: {
      'props.disabled': '!model.sz_company_name'
    }
  },
  {
    key: 'sz_info',
    type: 'input',
    className: 'col-12',
    props: {
      label: 'Additional Info',
      placeholder: 'Company additional info',
      required: true,
    }
  },
];