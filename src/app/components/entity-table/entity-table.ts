import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MockData, TableColumnInfo } from '../../services/mock-data';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';


@Component({
  selector: 'app-entity-table',
  imports: [
    CommonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    MultiSelectModule,
    ButtonModule,
    ButtonGroupModule,
    SplitButtonModule
  ],
  templateUrl: './entity-table.html',
  styleUrl: './entity-table.css',
})
export class EntityTable {

   statuses = [
    { label: 'Unqualified', value: 'unqualified' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'New', value: 'new' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Renewal', value: 'renewal' },
    { label: 'Proposal', value: 'proposal' }
  ];

  // customers = [
  //     {
  //       id: 1000,
  //       name: 'James Butt',
  //       country: {
  //           name: 'Algeria',
  //           code: 'dz'
  //       },
  //       company: 'Benton, John B Jr',
  //       date: '2015-09-13',
  //       status: 'unqualified',
  //       verified: true,
  //       activity: 17,
  //       representative: {
  //           name: 'Ioni Bowcher',
  //           image: 'ionibowcher.png'
  //       },
  //       balance: 70663
  //     },
  //     {
  //       id: 1000,
  //       name: 'Andrea M.',
  //       country: {
  //           name: 'Italy',
  //           code: 'it'
  //       },
  //       company: 'Benton, John B Jr',
  //       date: '2015-09-13',
  //       status: 'OK',
  //       verified: true,
  //       activity: 17,
  //       representative: {
  //           name: 'Ioni Bowcher',
  //           image: 'ionibowcher.png'
  //       },
  //       balance: 70663
  //     }
  //   ];

    // representatives = [
    //   { name: 'Amy Elsner', image: 'amyelsner.png' },
    //   { name: 'Anna Fali', image: 'annafali.png' },
    //   { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    //   { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    //   { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    //   { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    //   { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    //   { name: 'Onyama Limba', image: 'onyamalimba.png' },
    //   { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    //   { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
    // ];

    loading = true;

    clear(table: Table) {
      table.clear();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            default:
                return null;
        }
    }

    // real
    
    @ViewChild('entityTable') entityTable!: Table;

    @Input() hostId?: string;
    fieldList: TableColumnInfo[] = [];
    selectedColumns!: TableColumnInfo[];

    data: any[] = [];

    constructor(
      public mockDataSvc: MockData
    ) {
    }

    async ngOnInit() {
      console.log('EntityTable Host ID:', this.hostId);
      
      if (this.hostId) {
        try {
          this.fieldList = this.mockDataSvc.tableInfo[this.hostId].tableSpec || this.mockDataSvc.tableInfo[this.hostId].columns;
          this.selectedColumns = this.fieldList;
        } catch (error) {
        }
        console.log(`Table Column Info for Host ID ${this.hostId}:`, this.mockDataSvc.tableInfo[this.hostId]);
      }

      this.data = await this.mockDataSvc.getEntities(this.hostId!);
      // this.entityTable.value = this.data;
      this.loading = false;

      console.log('EntityTable Fields:', this.fieldList);
    }

}
