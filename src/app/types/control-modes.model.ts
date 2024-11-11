const controlModes = ['add', 'edit', 'view'] as const;
export type ControlModes = (typeof controlModes)[number];

export function isValidControlMode(value: string): value is ControlModes {
  return controlModes.indexOf(value as ControlModes) !== -1;
}
