import { inject } from "@angular/core";
import { MockData } from "./services/mock-data";
import { EntityFormService } from "./services/entity-form-service";


export const appInitializer = async () => {
  const _mockDataSvc = inject(MockData);
  const _entityFormSvc = inject(EntityFormService);

  await _mockDataSvc.init();
  await _entityFormSvc.init();
  console.log('App Initialized!');
  
  return true;
}