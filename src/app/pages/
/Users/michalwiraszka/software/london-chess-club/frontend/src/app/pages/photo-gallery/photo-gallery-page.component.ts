import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { ExternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-photo-gallery-page',
  template: `
    <lcc-page-header
      title="Photo Gallery"
      icon="camera">
    </lcc-page-header>

    <lcc-photo-grid></lcc-photo-grid>

    <lcc-link-list
      header="More photos"
      [links]="links"
      style="margin-top: 32px;">
    </lcc-link-list>
  `,
  imports: [CommonModule, LinkListComponent, PhotoGridComponent, PageHeaderComponent],
})
export class PhotoGalleryPageComponent implements OnInit {
