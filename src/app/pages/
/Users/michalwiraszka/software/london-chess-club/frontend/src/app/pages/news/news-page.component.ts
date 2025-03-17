import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-news-page',
  template: `
    <lcc-page-header
      title="News"
      icon="activity">
    </lcc-page-header>
    <lcc-article-grid></lcc-article-grid>
  `,
  imports: [ArticleGridComponent, CommonModule, PageHeaderComponent],
})
export class NewsPageComponent implements OnInit {
