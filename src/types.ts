export type ScreenId =
  | 'dashboard'
  | 'issues'
  | 'field-teams'
  | 'reports'
  | 'settings'
  | 'emergency-protocols'
  | 'audit-trail';

export interface GisNode {
  id: string;
  name: string;
  subTitle: string;
  coordinates: string;
  type: 'reservoir' | 'station' | 'incident' | 'booster' | 'tower';
  status: 'optimal' | 'warning' | 'critical' | 'active';
  metrics: {
    dischargeFlow?: string;
    vfdDrive?: string;
    valvePos?: string;
    pressure?: string;
    chlorineResidual?: string;
    capacity?: string;
    fillPercent?: number;
    connectionsServed?: number;
  };
}

export interface Incident {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  district: string;
  locationName: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'repaired';
  statusLabel: string;
  classification:
    | 'Main Pipeline Burst'
    | 'Low Pressure Alert'
    | 'Contamination Risk'
    | 'Gate Valve Leak'
    | 'Citizen Intake'
    | 'Turbidity Exceedance';
  slaTimeRemaining: string;
  statusBadge: string;
  flowDeficitM3H: number;
  impactHouseholds?: number;
  pressureDrop?: string;
  fieldCrew?: string;
  isolationValves?: string;
  waterQuality?: string;
  population?: string;
  unitAssigned?: string;
  intakeSource?: string;
  assetId?: string;
  scheduledDate?: string;
  partsStatus?: string;
  intakeTime?: string;
  checkValve?: string;
  autoDispatch?: string;
  directContact?: string;
  gpsCoords: { lat: number; lng: number };
  photoUrl?: string;
  isIsolated?: boolean;
  timeline: {
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'alert' | 'call' | 'matrix' | 'dispatch' | 'isolation';
  }[];
}

export interface FieldCrew {
  id: string;
  name: string;
  status: 'on-site' | 'in-transit' | 'executing' | 'standby';
  statusBadge: string;
  lead: string;
  techniciansCount: number;
  vehicleUnit: string;
  vehicleType: string;
  currentAssignment: string;
  assignmentDetail: string;
  timeOnSiteOrEta: string;
  signalType: 'VHF' | '5G';
  signalPercent: number;
  batteryPercent: number;
  gps: { lat: number; lng: number };
}

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  priority: 'P1' | 'P2' | 'scheduled';
  priorityLabel: string;
  gpsLocation: string;
  elapsedTime?: string;
  estLossOrSpike?: string;
  requiredGear?: string;
  estDuration?: string;
  isolationValves?: string;
  recommendedCrew?: string;
  assignedCrew?: string;
  status: 'unassigned' | 'in-progress' | 'queued' | 'completed';
  statusLabel: string;
  progressPercent?: number;
  requiresNotes?: string;
  scheduledTime?: string;
  type: 'emergency' | 'preventive';
}

export interface TelemetryLogItem {
  id: string;
  sensorId: string;
  timestamp: string;
  level: 'critical' | 'normal' | 'notice' | 'offline';
  title: string;
  description: string;
  actionRequired?: boolean;
}

export interface PressureZoneSummaryItem {
  id: string;
  zone: string;
  flowRate: string;
  inletPressure: string;
  residualPressure: string;
  turbidity: string;
  status: 'optimal' | 'rupture' | 'elevated';
  isIsolated?: boolean;
}

export interface ReservoirGauge {
  id: string;
  name: string;
  capacityML: number;
  currentML: number;
  percent: number;
  flowNote: string;
}
