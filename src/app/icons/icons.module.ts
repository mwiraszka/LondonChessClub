import { FeatherModule } from 'angular-feather';
import {
  Activity,
  AlertTriangle,
  Award,
  Bookmark,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Edit,
  Edit2,
  ExternalLink,
  File,
  FilePlus,
  FileText,
  Grid,
  Home,
  Info,
  Instagram,
  Mail,
  MapPin,
  PlusCircle,
  Radio,
  RotateCcw,
  Settings,
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
  Bookmark,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Edit,
  Edit2,
  ExternalLink,
  File,
  FilePlus,
  FileText,
  Grid,
  Home,
  Info,
  Instagram,
  Mail,
  MapPin,
  PlusCircle,
  Radio,
  RotateCcw,
  Settings,
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
