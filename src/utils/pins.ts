import type { MapPin, LocationPin, BossPin } from '../types/map';

export function isLocationPin(pin: MapPin): pin is LocationPin {
  return pin.type === 'location';
}

export function isBossPin(pin: MapPin): pin is BossPin {
  return pin.type === 'boss';
}

export const getPinStyleClasses = (completed: boolean, type: 'location' | 'boss') => {
  let pinColorClass = '';
  let borderColorClass = '';
  let circleOpacityClass = '';
  let labelOpacityClass = '';

  if (completed) {
    pinColorClass = 'bg-gray-400';
    borderColorClass = 'border-gray-600';
    circleOpacityClass = 'opacity-60';
    labelOpacityClass = 'opacity-80';
  } else {
    borderColorClass = 'border-white';
    pinColorClass = type === 'location' ? 'bg-green-500' : 'bg-red-500';
  }
  return { pinColorClass, borderColorClass, circleOpacityClass, labelOpacityClass };
};
