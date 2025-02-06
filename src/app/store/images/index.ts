export { ImagesStoreModule } from './images-store.module';

export * as ImagesActions from './images.actions';
export { ImagesEffects } from './images.effects';
export * as ImagesSelectors from './images.selectors';
export { ImagesState, imagesInitialState } from './images.reducer';

export const IMAGE_KEY = 'lcc-article-image';
