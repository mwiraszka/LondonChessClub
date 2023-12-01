import { FeatherModule } from 'angular-feather';
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Home,
  Info,
  PlusCircle,
  Trash2,
  User,
  Users,
  X,
} from 'angular-feather/icons';

import { NgModule } from '@angular/core';

const icons = {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Home,
  Info,
  PlusCircle,
  Trash2,
  User,
  Users,
  X,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}
