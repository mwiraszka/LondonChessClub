export type ImageRequestKind =
  | 'fetchAllImagesMetadata'
  | 'fetchFilteredThumbnails'
  | 'fetchBatchThumbnails'
  | 'fetchOriginal'
  | 'fetchOriginalInBackground'
  | 'addImage'
  | 'addImages'
  | 'updateImage'
  | 'updateAlbum'
  | 'deleteImage'
  | 'deleteAlbum'
  | 'automaticAlbumCoverSwitch';
