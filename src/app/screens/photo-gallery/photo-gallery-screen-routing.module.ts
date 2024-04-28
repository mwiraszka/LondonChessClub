import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhotoGalleryScreenComponent } from './photo-gallery-screen.component';

const routes: Routes = [
  {
    path: '',
    component: PhotoGalleryScreenComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoGalleryScreenRoutingModule {}
