export interface LineStatus {
  statusSeverity: number;
  reason: string;
}

interface ServiceType {
  name: string;
}

export interface Line {
  name: string;
  modeName: string;
  lineStatuses: LineStatus[];
  serviceTypes: ServiceType[];
}
