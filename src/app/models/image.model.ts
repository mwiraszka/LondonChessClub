import { Id, Url } from './core.model';
import { ModificationInfo } from './modification-info.model';

export interface Image {
  id: Id;
  filename: string;
  fileSize: number;
  caption: string;
  presignedUrl: Url;
  albums: string[];
  coverForAlbum: string | null;
  modificationInfo: ModificationInfo;
  articleAppearances?: number;
}
