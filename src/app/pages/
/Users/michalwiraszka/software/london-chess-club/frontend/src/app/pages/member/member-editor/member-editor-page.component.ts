import { MemberFormComponent } from '@app/components/member-form/member-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { MembersSelectors } from '@app/store/members';

@UntilDestroy()
@Component({
  selector: 'lcc-member-editor-page',
  templateUrl: './member-editor-page.component.html',
  imports: [CommonModule, LinkListComponent, MemberFormComponent, PageHeaderComponent],
})
export class MemberEditorPageComponent implements OnInit {
        const pageTitle =
          controlMode === 'edit' && memberName ? `Edit ${memberName}` : 'Add a member';
        this.metaAndTitleService.updateTitle(pageTitle);
        this.metaAndTitleService.updateDescription(
          `${pageTitle} for the London Chess Club.`,
        );
