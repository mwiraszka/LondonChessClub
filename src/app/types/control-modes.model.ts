const controlModes = ['add', 'edit', 'view'] as const;
export type ControlModes = (typeof controlModes)[number];

export function isControlMode(value: string): value is ControlModes {
  return controlModes.indexOf(value as ControlModes) !== -1;
}
