import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  
  constructor() {}

  public async getData(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['Option 1', 'Option 2', 'Option 3']);
      }, 500);
    });
  }
  
}
