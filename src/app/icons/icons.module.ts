import { FeatherModule } from 'angular-feather';
import { Camera, Edit, Trash2, X } from 'angular-feather/icons';

import { NgModule } from '@angular/core';

const icons = {
  Camera,
  Edit,
  Trash2,
  X,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}
