import {
  hanaModule,
  maxdbModule,
  sybaseModule,
  oracleModule,
} from "./moduleContent";

import {
  awsModule,
  gcpModule,
  azureModule,
  solmanModule,
  cloudAlmModule,
  dmsModule,
  sacModule,
  connectorsModule,
  tcodesModule,
} from "./modulesExtra";

import type { ModuleData } from "./moduleContent";

export { ModuleData };

export const moduleRegistry: Record<string, ModuleData> = {
  hana: hanaModule,
  maxdb: maxdbModule,
  sybase: sybaseModule,
  oracle: oracleModule,
  aws: awsModule,
  gcp: gcpModule,
  azure: azureModule,
  solman: solmanModule,
  cloudAlm: cloudAlmModule,
  dms: dmsModule,
  sac: sacModule,
  connectors: connectorsModule,
  tcodes: tcodesModule,
};
