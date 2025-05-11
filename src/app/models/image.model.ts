import { Id, Url } from './core.model';
import { ModificationInfo } from './modification-info.model';

export interface Image {
  id: Id;
  filename: string;
  fileSize: number;
  title: string;
  presignedUrl: Url;
  articleAppearances: number;
  albums: string[];
  albumCoverFor: string | null;
  modificationInfo: ModificationInfo;
}
