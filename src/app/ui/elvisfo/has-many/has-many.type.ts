import { Component, ChangeDetectionStrategy, Type, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

interface HasManyProps extends FormlyFieldProps {
  disabled?: boolean;
  fromEntity?: string;
  toEntity?: string;
  fromField?: string;
  toField?: string;
  onChangeAction?: 'NONE' | 'CLEAR_FIELDS';
  onChangeClearFields?: string;
  dependsOnFields?: string;
}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<HasManyProps> {
  type: 'input' | Type<FormlyFieldHasMany>;
}

@Component({
  selector: 'formly-field-elvisfo-has-many',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './has-many.type.scss',
  template: `
    <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }" size="small">
      <ng-template #header>
        <tr>
          <th style="width: 50px"><p-tableHeaderCheckbox /></th>
          <th>Code</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
        </tr>
      </ng-template>
      <ng-template #body let-product>
        <tr>
          <td><p-tableCheckbox [value]="product" /></td>
          <td>{{ product.code }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.quantity }}</td>
        </tr>
      </ng-template>
    </p-table>

    <!-- <input
      type="hidden"
      [formControl]="formControl"
      [formlyAttributes]="field"
    />

    <p-buttongroup class="has-many flex flex-col basis-full" [style]="{ width: '100% !important' }">
      <p-button (click)="onPreview()" [disabled]="!formControl.value || props.disabled" icon="pi pi-eye" variant="outlined" severity="info"/>
      <p-button fluid (click)="onSelect(); op.toggle($event)" [disabled]="props.disabled" class="grow" [label]="formControl.value || (props.placeholder || 'Select')" variant="outlined" severity="secondary" />
      <p-button (click)="onClear()" [disabled]="!formControl.value || props.disabled" icon="pi pi-times" variant="outlined" severity="danger" />
    </p-buttongroup>

    <p-popover #op>
      <div class="flex flex-col gap-4 w-[25rem]"> </div>
    </p-popover> -->
  `,
})
export class FormlyFieldHasMany extends FieldType<FieldTypeConfig<HasManyProps>> implements OnInit {

  public _displayValue?: string;
  public _helpText?: string;

  products: {
    code: string;
    name: string;
    category: string;
    quantity: number;
  }[] = [
    {
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      category: 'Accessories',
      quantity: 24,
    },
    {
      code: 'nvklal433',
      name: 'Black Watch',
      category: 'Accessories',
      quantity: 61,
    },
    {
      code: 'zz21cz3c1',
      name: 'Blue Band',
      category: 'Fitness',
      quantity: 2,
    },
  ];

  constructor( ) {
    super();
  }

  ngOnInit() {
    if (this.props.fromEntity && this.props.toEntity && this.props.fromField && this.props.toField) {
      this._helpText = `<b>JOIN</b> ${this.props.toEntity} <b>ON</b> (from.${this.props.fromField} = to.${this.props.toField})`;
    } else {
      this._helpText = 'No related entity configured!';
    }

    if (this.props.dependsOnFields && this.props.dependsOnFields.length > 0) {
      for (const _depField of this.props.dependsOnFields) {
        this.field?.parent?.formControl?.get(_depField.trim())?.valueChanges.subscribe((_value: any) => {
          // Implement logic to handle changes in dependent fields
          console.log('Dependent field changed:', _depField);
          // For example, you might want to clear the current value
          if (!_value) {
            this.formControl.patchValue(null);
            this.formControl.disable();
          } else {
            this.formControl.enable();
          }
        });
      }
    }
    
    if (this.props.onChangeAction) {
      if (this.props.onChangeAction == 'CLEAR_FIELDS') {
        this.formControl.valueChanges.subscribe(() => {
          // Implement field clearing logic here
          if (this.formControl.dirty) {
            const _keys = this.props.onChangeClearFields || [];
            for (const _key of _keys) {
              console.log('Clearing field due to BELONGS TO change:', _key);
              const _trimmedKey = _key.trim();
              if (_trimmedKey && this.field?.parent?.formControl?.get(_trimmedKey)) {
                this.field.parent.formControl.get(_trimmedKey)?.setValue(null);
              }
            }
          }
        });
      }
    }
  }
  
  onPreview() {
    if (this.formControl.value) {
      alert(`${this.props.fromEntity} JOIN ${this.props.toEntity} ON (${this.props.fromEntity}.${this.props.fromField} = ${this.props.toEntity}.${this.props.toField})`)
    } else {
      alert('No item selected to preview.');
    }
  }

  onSelect() {
    this.formControl.markAsDirty();
    this.formControl.patchValue(Math.floor(Math.random() * 1000).toString());
  }

  onClear() {
    this.formControl.markAsDirty();
    this.formControl.patchValue(null);
  }
}
