import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'schedule-page',
  template: `
    <lcc-page-header
      title="Schedule"
      icon="calendar">
    </lcc-page-header>
    <lcc-schedule></lcc-schedule>
  `,
  imports: [CommonModule, ScheduleComponent, PageHeaderComponent],
})
export class SchedulePageComponent implements OnInit {
