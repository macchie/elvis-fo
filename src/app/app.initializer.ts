import { inject } from "@angular/core";
import { MockData } from "./services/mock-data";


export const appInitializer = async () => {
  const _mockDataSvc = inject(MockData);

  await _mockDataSvc.init();
  console.log('App Initialized!');
  
  return true;
}