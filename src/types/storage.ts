export interface LocationStateObject {
  checked?: boolean;
  [bossName: string]: boolean | undefined;
}

export interface CheckedStates {
  [itemName: string]: boolean | LocationStateObject;
}

export interface AppStoredData {
  checkedStates: CheckedStates;
  hideCompletedItems: boolean;
}
