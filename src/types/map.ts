import type L from 'leaflet';
import type { CheckedStates } from './storage';

export interface BaseMapPin {
  label: string;
  x: number;
  y: number;
  info?: string;
  wiki?: string;
  notes?: string;
  difficulty?: string;
  iconOptions?: L.DivIconOptions;
}

export interface LocationBossEntry {
  name: string;
  optional?: boolean;
  wiki?: string;
  notes?: string;
  difficulty?: string;
}

export interface LocationPin extends BaseMapPin {
  type: 'location';
  details?: {
    bosses?: LocationBossEntry[];
  };
}

export interface BossPin extends BaseMapPin {
  type: 'boss';
}

export type MapPin = LocationPin | BossPin;

export interface MapStoreState {
  allProcessedPins: MapPin[];
  hideCompletedItems: boolean;
  activeSearchQuery: string;
  selectedPin: MapPin | null;
  isDialogVisible: boolean;
  checkedStates: CheckedStates;
}