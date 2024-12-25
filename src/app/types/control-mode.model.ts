const controlModes = ['add', 'edit', 'view'] as const;
export type ControlMode = (typeof controlModes)[number];

export function isControlMode(value: unknown): value is ControlMode {
  return controlModes.indexOf(value as ControlMode) !== -1;
}
