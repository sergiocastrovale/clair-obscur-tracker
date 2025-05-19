import { defineStore } from 'pinia';
import type { MapPin, LocationPin, LocationBossEntry, BossPin, MapStoreState } from '@/types/map';
import type { AppStoredData, LocationStateObject } from '@/types/storage';
import { bosses as rawBossesData, locations as rawLocationsData } from '@/data/pins';
import { MAP_STORAGE_KEY } from '@/utils/constants';

export const useMapStore = defineStore('map', {
  state: (): MapStoreState => ({
    allProcessedPins: [],
    hideCompletedItems: false,
    activeSearchQuery: '',
    selectedPin: null,
    isDialogVisible: false,
    checkedStates: {},
  }),

  getters: {
    // Getter to check if a pin is complete, using store's checkedStates
    isPinComplete(state) {
      return (pinLabel: string, pinType: 'location' | 'boss', bossesData?: Array<{ name: string; optional?: boolean }>): boolean => {
        const checkedStates = state.checkedStates;

        if (pinType === 'boss') {
          const bossState = checkedStates[pinLabel];
          return typeof bossState === 'boolean' ? bossState : false;
        }

        if (pinType === 'location') {
           // Can be boolean or LocationStateObject
          const locationEntry = checkedStates[pinLabel];
          let isLocationSelfChecked = false;

          if (typeof locationEntry === 'boolean') {
            isLocationSelfChecked = locationEntry;
          } else if (typeof locationEntry === 'object' && locationEntry !== null && typeof locationEntry.checked === 'boolean') {
            isLocationSelfChecked = locationEntry.checked;
          }

          if (!isLocationSelfChecked) {
            return false;
          }

          if (bossesData && bossesData.length > 0) {
            for (const boss of bossesData) {
              if (!boss.optional) {
                let isCurrentBossChecked = false;

                if (typeof locationEntry === 'object' && locationEntry !== null && typeof locationEntry[boss.name] === 'boolean') {
                  isCurrentBossChecked = locationEntry[boss.name] as boolean;
                }
                if (!isCurrentBossChecked) {
                  return false;
                }
              }
            }
          }
          return true;
        }
        return false;
      };
    },

    filteredPins(state): MapPin[] {
      const query = state.activeSearchQuery.toLowerCase().trim();
      const applySearchFilter = query.length > 2;
      const isPinCompleteGetter = (this as any).isPinComplete as (pinLabel: string, pinType: 'location' | 'boss', bossesData?: Array<{ name: string; optional?: boolean }>) => boolean;

      return state.allProcessedPins.filter(pin => {
        let showPin = true;

        if (state.hideCompletedItems) {
          const bossesData: LocationBossEntry[] | undefined = pin.type === 'location' ? (pin as LocationPin).details?.bosses : undefined;
          if (isPinCompleteGetter(pin.label, pin.type, bossesData)) {
            showPin = false;
          }
        }

        if (showPin && applySearchFilter) {
          let matchesSearch = false;
          if (pin.label.toLowerCase().includes(query)) {
            matchesSearch = true;
          }
          if (!matchesSearch && pin.type === 'location') {
            const locationPin = pin as LocationPin;
            if (locationPin.details?.bosses?.some(boss => boss.name.toLowerCase().includes(query))) {
              matchesSearch = true;
            }
          }
          if (!matchesSearch) {
            showPin = false;
          }
        }
        return showPin;
      });
    },

    getItemState(state) {
      return (itemName: string): boolean => {
        const itemValue = state.checkedStates[itemName];
        return typeof itemValue === 'boolean' ? itemValue : false;
      };
    },
    getLocationSelfState(state) {
      return (locationName: string): boolean => {
        const locationEntry = state.checkedStates[locationName];
        if (typeof locationEntry === 'object' && locationEntry !== null && typeof locationEntry.checked === 'boolean') {
          return locationEntry.checked;
        }
        if (typeof locationEntry === 'boolean') {
          return locationEntry;
        }
        return false;
      };
    },
    getBossState(state) {
      return (locationName: string, bossName: string): boolean => {
        const locationEntry = state.checkedStates[locationName];
        if (typeof locationEntry === 'object' && locationEntry !== null) {
          const bossValue = locationEntry[bossName];
          return typeof bossValue === 'boolean' ? bossValue : false;
        }
        return false;
      };
    },
  },

  actions: {
    // Helper to load all app data from localStorage
    _loadAppData(): Partial<AppStoredData> {
      const storedData = localStorage.getItem(MAP_STORAGE_KEY);
      if (storedData) {
        try {
          return JSON.parse(storedData) as AppStoredData;
        } catch (e) {
          console.error('Error parsing app data from localStorage:', e);
          return {};
        }
      }
      return {};
    },

    // Helper to save all app data to localStorage
    _saveAppData() {
      try {
        const dataToStore: AppStoredData = {
          checkedStates: this.checkedStates,
          hideCompletedItems: this.hideCompletedItems,
        };
        localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(dataToStore));
        document.dispatchEvent(new CustomEvent('appDataSaved'));
      } catch (e) {
        console.error('Error saving app data to localStorage:', e);
      }
    },

    initializeStore() {
      const loadedData = this._loadAppData();
      this.checkedStates = loadedData.checkedStates || {};
      this.hideCompletedItems = loadedData.hideCompletedItems || false;
      this.processRawPins();
    },

    processRawPins() {
      const processedBossPins: BossPin[] = rawBossesData.map(boss => ({
        ...boss,
        type: 'boss' as 'boss',
      }));

      const processedLocationPins: LocationPin[] = rawLocationsData.map(loc => ({
        x: loc.x,
        y: loc.y,
        label: loc.label,
        info: loc.info,
        wiki: loc.wiki,
        notes: loc.notes,
        difficulty: loc.difficulty,
        type: 'location' as 'location',
        details: {
          bosses: (loc.bosses || []).map(b => ({
            name: b.name,
            optional: b.optional,
            notes: (b as any).notes,
            wiki: b.wiki,
            difficulty: (b as any).difficulty,
          } as LocationBossEntry)),
        },
      }));
      this.allProcessedPins = [...processedBossPins, ...processedLocationPins];
    },

    setHideCompleted(value: boolean) {
      this.hideCompletedItems = value;
      this._saveAppData();
    },

    setSearchQuery(query: string) {
      this.activeSearchQuery = query;
    },

    openPinDialog(pin: MapPin) {
      this.selectedPin = pin;
      this.isDialogVisible = true;
    },

    closePinDialog() {
      this.selectedPin = null;
      this.isDialogVisible = false;
    },

    // Actions to update states, now directly modifying store state and persisting
    updateItemState(itemName: string, isChecked: boolean) {
      this.checkedStates[itemName] = isChecked;
      this._saveAppData(); // Save combined data
    },

    updateLocationSelfState(locationName: string, isChecked: boolean) {
      const currentLocationEntry = this.checkedStates[locationName];
      if (typeof currentLocationEntry === 'object' && currentLocationEntry !== null) {
        // It's already an object, just update its 'checked' property
        (currentLocationEntry as LocationStateObject).checked = isChecked;
      } else {
        // It was boolean, undefined, or null. Create a new object.
        // If it was boolean, that value becomes the initial 'checked' state.
        // Otherwise, it starts fresh with the new 'isChecked' state.
        const newLocationState: LocationStateObject = { checked: isChecked };
        if (typeof currentLocationEntry === 'boolean') {
           // This case might be redundant if we always convert to object on first boss add,
           // but good for safety if a location was marked true/false directly.
        }
        this.checkedStates[locationName] = newLocationState;
      }
      this._saveAppData(); // Save combined data
    },

    updateBossState(locationName: string, bossName: string, isChecked: boolean) {
      let locationEntry = this.checkedStates[locationName];

      if (typeof locationEntry !== 'object' || locationEntry === null) {
        // If location was boolean (e.g. true, meaning cleared without bosses)
        // or undefined/null, convert it to an object.
        // Preserve its "self-checked" state if it was a boolean.
        const selfCheckedValue = typeof locationEntry === 'boolean' ? locationEntry : undefined;
        const newLocationObject: LocationStateObject = {};
        if (selfCheckedValue !== undefined) {
          newLocationObject.checked = selfCheckedValue;
        }
        newLocationObject[bossName] = isChecked;
        this.checkedStates[locationName] = newLocationObject;
      } else {
        // It's already an object, just set the boss state
        (locationEntry as LocationStateObject)[bossName] = isChecked;
      }
      this._saveAppData(); // Save combined data
    },

    handleShiftClickPin(pin: MapPin): { itemType: 'location' | 'boss', itemName: string, newState: boolean } | undefined {
      let newCheckedState: boolean;
      let itemType: 'location' | 'boss';
      let itemName: string;

      // Access getters via this (Pinia makes them available on the store instance)
      const getLocationSelfStateGetter = (this as any).getLocationSelfState as (locationName: string) => boolean;
      const getItemStateGetter = (this as any).getItemState as (itemName: string) => boolean;


      if (pin.type === 'location') {
        const locPin = pin as LocationPin;
        itemType = 'location';
        itemName = locPin.label;
        const currentState = getLocationSelfStateGetter(locPin.label);
        newCheckedState = !currentState;
        this.updateLocationSelfState(locPin.label, newCheckedState);
        // Also update all non-optional bosses within this location
        locPin.details?.bosses?.forEach(boss => {
          // No check for optional here as per original intent of shift-click clearing all
          this.updateBossState(locPin.label, boss.name, newCheckedState);
        });
      } else if (pin.type === 'boss') {
        const bossPin = pin as BossPin;
        itemType = 'boss';
        itemName = bossPin.label;
        const currentState = getItemStateGetter(bossPin.label);
        newCheckedState = !currentState;
        this.updateItemState(bossPin.label, newCheckedState);
      } else {
        return undefined; // Should not happen
      }
      return { itemType, itemName, newState: newCheckedState };
    },

    // Action that can be called by Import.vue after successful import
    forceReloadStateFromStorage() {
      const loadedData = this._loadAppData();
      this.checkedStates = loadedData.checkedStates || {};
      this.hideCompletedItems = loadedData.hideCompletedItems || false;
      console.log('Map store state reloaded from localStorage.');
      document.dispatchEvent(new CustomEvent('storeStateReinitialized'));
    }
  },
});
