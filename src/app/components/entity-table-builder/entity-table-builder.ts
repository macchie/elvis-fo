import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { MockData } from '../../services/mock-data';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableColumnSpec, TableSpec } from '../../interfaces/table-spec.interface';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-entity-table-builder',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TagModule,
    FloatLabelModule,
    SelectModule,
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    ToggleSwitchModule,
    MultiSelectModule,
    TabsModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './entity-table-builder.html',
  styleUrl: './entity-table-builder.css',
})
export class EntityTableBuilder implements OnInit {

  _columnTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Image', value: 'image' },
    { label: 'Relation', value: 'relation' },
    { label: 'Barcode', value: 'barcode' },
    { label: 'Custom', value: 'custom' },
  ];

  _colors = [
    'primary',
    'contrast',
    'info',
    'success',
    'warn',
    'danger',
  ];

  _formatting = [
    { value: 'text-bold', icon: 'letter-bold' },
    { value: 'text-italic', icon: 'letter-italic' },
    { value: 'text-underline', icon: 'letter-underline' },
  ];

  @Input() hostId!: string;
  schemaName!: string;
  tableName!: string;
  tableSpec!: TableSpec;

  constructor(
    public mockDataSvc: MockData,
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    if (this.hostId) {
      const _parts = this.hostId.split('.');

      if (_parts.length === 2) {
        this.schemaName = _parts[0];
        this.tableName = _parts[1];
      }

      this.tableSpec = this.mockDataSvc.tableSpecs[this.hostId];
    }
  }

  onSaveSpec() {
    console.log('Table Spec to Save:', this.tableSpec);
    this.mockDataSvc.onSaveTableSpec(this.hostId!, this.tableSpec);
  }

  onRemoveColumn(col: TableColumnSpec, event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Column?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Column deleted!' });

        const idx = this.tableSpec.columns.findIndex(c => c.field === col.field);
        if (idx !== -1) {
          this.tableSpec.columns.splice(idx, 1);
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected.' });
      },
    });
  }

}
