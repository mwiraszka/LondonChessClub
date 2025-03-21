export interface Photo {
  filename: string;
  name: string;
  albums: string[];
  isFeatured: boolean;
}

export interface PhotoAlbum {
  name: string;
  photos: Photo[];
}
