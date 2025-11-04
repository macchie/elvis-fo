import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from "@ngx-formly/core";
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CompanyFormSpec } from './services/mock/company-form.mock';
import { CardModule } from 'primeng/card';
import { LogoFormSpec } from './services/mock/logo-form.mock';
import { DeviceFormSpec } from './services/mock/device-form.mock';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Menu,
    ToastModule,
    ScrollPanelModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyForm,
    CardModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('elvis-fo');

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Store Admin',
        icon: 'pi pi-circle',
        iconStyle: { 'font-size': '1.5em', 'margin-right': '0.5em' },
        items: [
          { label: 'Store Dashboard', icon: 'pi pi-circle' },
          { label: 'End of Day', icon: 'pi pi-circle' },
          { label: 'Balance Check', icon: 'pi pi-circle' },
          { label: 'Reports', icon: 'pi pi-circle' },
          { label: 'Import Status', icon: 'pi pi-circle' },
        ]
      },
      {
        label: 'System Parameters',
        items: [
          { label: 'Retail Types', icon: 'pi pi-circle' },
          { label: 'Tender Types', icon: 'pi pi-circle' },
          { label: 'Barcode Patterns', icon: 'pi pi-circle' },
        ]
      },
    ];
  }

  companyForm = new FormGroup({});
  logoForm = new FormGroup({});
  deviceForm = new FormGroup({});

  models = { 
    companyForm: {},
    logoForm: {},
    deviceForm: {},
  };

  companyFormFields: FormlyFieldConfig[] = CompanyFormSpec;
  logoFormFields: FormlyFieldConfig[] = LogoFormSpec;
  deviceFormFields: FormlyFieldConfig[] = DeviceFormSpec;

  onSubmit(model: any) {
    console.log(model);
  }

  // form = new UntypedFormGroup({});
  // model: any = {};
  // options: FormlyFormOptions = {};
  // fields: FormlyFieldConfig[] = [
  //   {
  //     key: 'Radio',
  //     type: 'radio',
  //     props: {
  //       label: 'Radio',
  //       placeholder: 'Placeholder',
  //       description: 'Description',
  //       required: true,
  //       options: [
  //         { value: 1, label: 'Option 1' },
  //         { value: 2, label: 'Option 2' },
  //         { value: 3, label: 'Option 3' },
  //         { value: 4, label: 'Option 4', disabled: true },
  //       ],
  //     },
  //   },
  // ];
}
