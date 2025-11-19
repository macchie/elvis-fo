import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyField, FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MockData } from '../../services/mock-data';
import { ButtonModule } from 'primeng/button';
import { EntityFormBuilder } from '../entity-form-builder/entity-form-builder';
import { FormSpec } from '../../interfaces/form-spec.interface';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { EntityFormService } from '../../services/entity-form-service';

@Component({
  selector: 'app-entity-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyForm,
    ButtonModule,
    EntityFormBuilder,
    ToolbarModule,
    TagModule,
    SplitButtonModule
  ],
  templateUrl: './entity-form.html',
  styleUrl: './entity-form.css',
})
export class EntityForm implements OnInit {

  form!: FormGroup;
  model: any;

  @Input() hostId!: string;
  @Input() entityId!: string | number | undefined;
  @Input() readonly!: boolean;
  @Input() hideHeader!: boolean;
  @Input() hideFooter!: boolean;
  schemaName!: string;
  tableName!: string;
  formSpec!: FormSpec;

  @ViewChild('formlyForm', { static: false }) 
  formlyForm!: FormlyForm;

  @ViewChild('entityFormBuilder', { static: false }) 
  entityFormBuilder!: EntityFormBuilder;

  editMode: boolean = false;

  mode: string = 'create';
  modeIcon: string = 'pi pi-circle-off';
  modeSeverity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | null | undefined = 'secondary';
  title: string = 'Entity Form';

  loading: boolean = false;

  _formActions: any[] = [];

  constructor(
    private mockDataSvc: MockData,
    private entityFormSvc: EntityFormService,
    private cd: ChangeDetectorRef,
  ) {

  }

  async ngOnInit() {
    this.form = new FormGroup({});

    if (this.hostId) {
      const _parts = this.hostId.split('.');

      if (_parts.length === 2) {
        this.schemaName = _parts[0];
        this.tableName = _parts[1];
      }

      this.formSpec = await this.entityFormSvc.getFormSpec(this.hostId);

      if (this.entityId !== undefined) {
        this.model = await this.mockDataSvc.getEntity(this.hostId, this.entityId);
      }

      if (this.readonly) {
        this.form.disable();
      } else {
        this.form.enable();
      }

      this.setMeta();
      this.cd.detectChanges();
    }
  }

  async clearData() {
    this.model = {};
    if (this.readonly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.setMeta();
    this.cd.detectChanges();
  }

  async refreshData() {
    if (this.hostId && this.entityId !== undefined) {
      this.loading = true;
      if (this.readonly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
      this.model = await this.mockDataSvc.getEntity(this.hostId, this.entityId);
      this.setMeta();
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  async refreshFormSpec() {
    if (this.readonly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    // this.formSpec = this.entityFormSvc.getE
    this.cd.detectChanges();
  }

  onEditForm() {
    console.log('Form Spec:', this.formSpec);
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.refreshFormSpec();
    }
  }

  async onSaveSpec() {
    await this.entityFormBuilder.onSave();
    this.editMode = false;
    this.editMode = false;
  }

  private setMeta() {
    if (this.entityId !== undefined) {
      this.mode = this.readonly ? 'view' : 'edit';
      this.modeIcon = this.readonly ? 'pi pi-eye' : 'pi pi-pen-to-square';
      this.modeSeverity = this.readonly ? 'info' : 'warn';
      this.title = this.hostId;

      if (this.model) {
        const pkField = this.mockDataSvc.tableInfo[this.hostId].primary_key;
        this.title += ` (#${this.model[pkField]})`;
      }
    } else {
      this.mode = 'create';
      this.modeIcon = 'pi pi-plus';
      this.modeSeverity = 'success';
      this.title = this.hostId;
    }
  }
}
