import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { FormlyFormFieldModule } from '../form-field/form-field.module';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormlyFieldHasMany } from './has-many.type';
import { withFormlyFieldHasMany } from './has-many.config';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    FormlyFieldHasMany
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forChild(withFormlyFieldHasMany()),
    FormlyFormFieldModule,
    ButtonModule,
    ButtonGroup,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    PopoverModule,
    TableModule
  ],
})
export class FormlyInputModule {}
