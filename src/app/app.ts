import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from "@ngx-formly/core";
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Menu,
    ToastModule,
    ScrollPanelModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyForm
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
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Logout', icon: 'pi pi-sign-out' }
        ]
      },
      {
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Logout', icon: 'pi pi-sign-out' }
        ]
      },
      {
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Logout', icon: 'pi pi-sign-out' }
        ]
      },
      {
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Logout', icon: 'pi pi-sign-out' }
        ]
      },
      {
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Logout', icon: 'pi pi-sign-out' }
        ]
      },
      {
        label: 'Documents',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      },
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Logout', icon: 'pi pi-sign-out' }
        ]
      },
    ];
  }

  form = new FormGroup({});
  model = { email: 'email@gmail.com' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      className: 'col-12',
      props: {
        label: 'Email address',
        placeholder: 'Enter email',
        required: true,
      }
    },
    {
      key: 'name',
      type: 'input',
      className: 'col-6',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name2',
      type: 'input',
      className: 'col-6',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name2',
      type: 'input',
      className: 'col-6',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name2',
      type: 'input',
      className: 'col-4',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name3',
      type: 'input',
      className: 'col-12',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name3',
      type: 'input',
      className: 'col-4',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name3',
      type: 'input',
      className: 'col-4',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
    {
      key: 'name3',
      type: 'input',
      className: 'col-4',
      props: {
        label: 'Your name',
        placeholder: 'Enter name',
        required: true,
      }
    },
  ];

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
