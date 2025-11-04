import { FormlyFieldConfig } from "@ngx-formly/core";

export const DeviceFormSpec: FormlyFieldConfig[] = [
  {
    key: 'n0_company_id',
    type: 'belongs-to',
    className: 'col-4',
    props: {
      required: true,
      label: 'Company',
      fromEntity: 'system.devices',
      toEntity: 'system.companies',
      fromField: 'n0_company_id',
      toField: 'n0_company_id',
    }
  },
  {
    key: 'n0_logo_id',
    type: 'belongs-to',
    className: 'col-4',
    props: {
      required: true,
      label: 'Logo',
      fromEntity: 'system.devices',
      toEntity: 'system.logos',
      fromField: 'n0_logo_id',
      toField: 'n0_logo_id',
    }
  },
  {
    key: 'n0_store_id',
    type: 'belongs-to',
    className: 'col-4',
    props: {
      required: true,
      label: 'Store',
      fromEntity: 'system.devices',
      toEntity: 'system.stores',
      fromField: 'n0_store_id',
      toField: 'n0_store_id',
    }
  },
  {
    key: 'n0_device_type_id',
    type: 'belongs-to',
    className: 'col-4',
    props: {
      required: true,
      label: 'Type',
      fromEntity: 'system.devices',
      toEntity: 'system.store_dev_types',
      fromField: 'n0_store_dev_type',
      toField: 'n0_store_dev_type',
    }
  },
  {
    key: 'sz_device_name',
    type: 'input',
    className: 'col-8',
    props: {
      label: 'Device Name',
      placeholder: 'SCO #1',
      required: true,
    }
  },
  {
    key: 'n0_device_number',
    type: 'integer',
    className: 'col-4',
    props: {
      label: 'Device Number',
      placeholder: '123',
      required: true,
    }
  },
  {
    key: 'sz_serial_no',
    type: 'string',
    className: 'col-4',
    props: {
      label: 'Serial Number',
      placeholder: 'POS-123',
      required: true,
    }
  },
  {
    key: 'sz_ip_address',
    type: 'string',
    className: 'col-4',
    props: {
      label: 'IP Address',
      placeholder: '10.1.2.3',
      required: true,
    }
  },
];