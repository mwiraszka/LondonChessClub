import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { ExternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-champion-page',
  templateUrl: './champion-page.component.html',
  styleUrl: './champion-page.component.scss',
  imports: [CommonModule, LinkListComponent, PageHeaderComponent],
})
export class ChampionPageComponent implements OnInit {
