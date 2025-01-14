import { ControlMode } from './control-mode.model';
import { Id } from './core.model';
import { NavPath } from './nav-path.model';

interface BaseLink {
  text: string;
  icon?: string;
  tooltip?: string;
}

export type InternalPath = NavPath | [NavPath, ControlMode] | [NavPath, ControlMode, Id];

export interface InternalLink extends BaseLink {
  internalPath: InternalPath;
  externalPath?: never;
}

export interface ExternalLink extends BaseLink {
  externalPath: string | null;
  internalPath?: never;
}
