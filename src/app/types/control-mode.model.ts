const controlModes = ['add', 'edit', 'view'] as const;
export type ControlMode = (typeof controlModes)[number];

export function isControlMode(value: string): value is ControlMode {
  return controlModes.indexOf(value as ControlMode) !== -1;
}
