import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, take } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_MEMBERS } from '@app/mocks/members.mock';
import {
  DataPaginationOptions,
  LccError,
  Member,
  MemberWithNewRatings,
} from '@app/models';
import { DialogService, MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import * as utils from '@app/utils';

import { MembersPageComponent } from './members-page.component';

describe('MembersPageComponent', () => {
  let fixture: ComponentFixture<MembersPageComponent>;
  let component: MembersPageComponent;

  let dialogOpenSpy: jest.SpyInstance;
  let dialogService: DialogService;
  let metaAndTitleService: MetaAndTitleService;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  const mockFilteredCount = 50;
  const mockFilteredMembers = MOCK_MEMBERS.slice(0, 3);
  const mockIsAdmin = true;
  const mockIsSafeMode = false;
  const mockOptions: DataPaginationOptions<Member> = {
    page: 0,
    pageSize: 10,
    sortBy: 'firstName',
    sortOrder: 'asc',
    filters: {},
    search: '',
  };
  const mockTotalCount = 100;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersPageComponent],
      providers: [
        {
          provide: DialogService,
          useValue: { open: jest.fn() },
        },
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        provideMockStore(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersPageComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);
    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    store = TestBed.inject(MockStore);

    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    dispatchSpy = jest.spyOn(store, 'dispatch');
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');

    store.overrideSelector(MembersSelectors.selectFilteredCount, mockFilteredCount);
    store.overrideSelector(MembersSelectors.selectFilteredMembers, mockFilteredMembers);
    store.overrideSelector(AuthSelectors.selectIsAdmin, mockIsAdmin);
    store.overrideSelector(AppSelectors.selectIsSafeMode, mockIsSafeMode);
    store.overrideSelector(MembersSelectors.selectOptions, mockOptions);
    store.overrideSelector(MembersSelectors.selectTotalCount, mockTotalCount);
    store.refreshState();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set meta title and description', () => {
      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('Members');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });

    it('should set viewModel$ with expected data', async () => {
      const vm = await firstValueFrom(component.viewModel$!.pipe(take(1)));

      expect(vm).toStrictEqual({
        filteredCount: mockFilteredCount,
        filteredMembers: mockFilteredMembers,
        isAdmin: mockIsAdmin,
        isSafeMode: mockIsSafeMode,
        options: mockOptions,
        totalCount: mockTotalCount,
      });
    });
  });

  describe('onOptionsChange', () => {
    it('should dispatch paginationOptionsChanged action with fetch true by default', () => {
      const options: DataPaginationOptions<Member> = {
        ...mockOptions,
        page: 1,
      };
      component.onOptionsChange(options);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.paginationOptionsChanged({ options, fetch: true }),
      );
    });

    it('should dispatch paginationOptionsChanged action with fetch false when specified', () => {
      const options: DataPaginationOptions<Member> = {
        ...mockOptions,
        search: 'test',
      };
      component.onOptionsChange(options, false);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.paginationOptionsChanged({ options, fetch: false }),
      );
    });
  });

  describe('onRequestDeleteMember', () => {
    it('should dispatch deleteMemberRequested action', () => {
      const member = mockFilteredMembers[0];
      component.onRequestDeleteMember(member);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.deleteMemberRequested({ member }),
      );
    });
  });

  describe('onMemberRatingChangesFileSelected', () => {
    let parseCsvSpy: jest.SpyInstance;
    let mockEvent: Event;
    let mockFile: File;

    beforeEach(() => {
      mockFile = new File(['test,data'], 'test.csv', { type: 'text/csv' });
      mockEvent = {
        target: {
          files: [mockFile],
          value: 'test.csv',
        },
      } as unknown as Event;

      parseCsvSpy = jest.spyOn(utils, 'parseCsv');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return early if no file is selected', async () => {
      const eventWithoutFile = {
        target: {
          files: null,
          value: '',
        },
      } as unknown as Event;

      await component.onMemberRatingChangesFileSelected(eventWithoutFile);

      expect(parseCsvSpy).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should clear input value after processing', async () => {
      parseCsvSpy.mockResolvedValue([['John', 'Doe', '1500', '1520', '1550']]);
      store.overrideSelector(MembersSelectors.selectAllMembers, MOCK_MEMBERS);
      store.overrideSelector(MembersSelectors.selectTotalCount, MOCK_MEMBERS.length);
      store.refreshState();

      jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');

      await component.onMemberRatingChangesFileSelected(mockEvent);

      expect((mockEvent.target as HTMLInputElement).value).toBe('');
    });

    it('should dispatch parseMemberRatingsFromCsvFailed when CSV parsing fails', async () => {
      const mockError: LccError = {
        name: 'LCCError',
        message: 'Invalid CSV format',
      };
      parseCsvSpy.mockResolvedValue(mockError);

      await component.onMemberRatingChangesFileSelected(mockEvent);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.parseMemberRatingsFromCsvFailed({ error: mockError }),
      );
    });

    it('should open rating changes dialog when CSV parsing succeeds', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      parseCsvSpy.mockResolvedValue([
        ['Magnus', 'Carlsen', '2850', '2860', '2882'],
        ['Hikaru', 'Nakamura', '2775', '2785', '2816'],
      ]);
      store.overrideSelector(MembersSelectors.selectAllMembers, MOCK_MEMBERS);
      store.overrideSelector(MembersSelectors.selectTotalCount, MOCK_MEMBERS.length);
      store.refreshState();

      await component.onMemberRatingChangesFileSelected(mockEvent);

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: expect.any(Function),
        inputs: {
          membersWithNewRatings: expect.any(Array),
          unmatchedMembers: expect.any(Array),
        },
        isModal: false,
      });
    });

    it('should dispatch updateMemberRatingsRequested when dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      parseCsvSpy.mockResolvedValue([['Magnus', 'Carlsen', '2850', '2860', '2882']]);
      store.overrideSelector(MembersSelectors.selectAllMembers, MOCK_MEMBERS);
      store.overrideSelector(MembersSelectors.selectTotalCount, MOCK_MEMBERS.length);
      store.refreshState();

      await component.onMemberRatingChangesFileSelected(mockEvent);

      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.updateMemberRatingsRequested({
          membersWithNewRatings: expect.any(Array),
        }),
      );
    });

    it('should not dispatch updateMemberRatingsRequested when dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      parseCsvSpy.mockResolvedValue(['Magnus', 'Carlsen', '2850', '2860', '2882']);
      store.overrideSelector(MembersSelectors.selectAllMembers, MOCK_MEMBERS);
      store.overrideSelector(MembersSelectors.selectTotalCount, MOCK_MEMBERS.length);
      store.refreshState();

      await component.onMemberRatingChangesFileSelected(mockEvent);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: '[Members] Update Member Ratings Requested',
        }),
      );
    });

    it('should handle members with new ratings correctly', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      parseCsvSpy.mockResolvedValue([['Magnus', 'Carlsen', '2850', '2860', '2882']]);
      store.overrideSelector(MembersSelectors.selectAllMembers, MOCK_MEMBERS);
      store.overrideSelector(MembersSelectors.selectTotalCount, MOCK_MEMBERS.length);
      store.refreshState();

      await component.onMemberRatingChangesFileSelected(mockEvent);

      const dialogCall = dialogOpenSpy.mock.calls[0][0];
      const membersWithNewRatings = dialogCall.inputs?.[
        'membersWithNewRatings'
      ] as MemberWithNewRatings[];

      expect(membersWithNewRatings).toHaveLength(1);
      expect(membersWithNewRatings[0]).toMatchObject({
        firstName: 'Magnus',
        lastName: 'Carlsen',
        rating: '2850',
        newRating: '2860',
        newPeakRating: '2882',
      });
    });

    it('should handle unmatched members correctly', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      parseCsvSpy.mockResolvedValue([['Unknown', 'Player', '1500', '1520', '1550']]);
      store.overrideSelector(MembersSelectors.selectAllMembers, MOCK_MEMBERS);
      store.overrideSelector(MembersSelectors.selectTotalCount, MOCK_MEMBERS.length);
      store.refreshState();

      await component.onMemberRatingChangesFileSelected(mockEvent);

      const dialogCall = dialogOpenSpy.mock.calls[0][0];
      const unmatchedMembers = dialogCall.inputs?.['unmatchedMembers'] as string[];

      expect(unmatchedMembers).toHaveLength(1);
      expect(unmatchedMembers[0]).toBe('Unknown Player');
    });
  });

  describe('onExportToCsv', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return early if viewModel$ is undefined', async () => {
      component.viewModel$ = undefined;

      await component.onExportToCsv();

      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should return early if member count is zero', async () => {
      store.overrideSelector(MembersSelectors.selectTotalCount, 0);
      store.refreshState();

      await component.onExportToCsv();

      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct member count', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');

      await component.onExportToCsv();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: expect.any(Function),
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Export all ${mockTotalCount} members to a CSV file?`,
            confirmButtonText: 'Export',
            confirmButtonType: 'primary',
          },
        },
        isModal: false,
      });
    });

    it('should dispatch exportMembersToCsvRequested when dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onExportToCsv();

      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.exportMembersToCsvRequested(),
      );
    });

    it('should not dispatch exportMembersToCsvRequested when dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onExportToCsv();

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: '[Members] Export Members To CSV Requested',
        }),
      );
    });
  });

  describe('component properties', () => {
    it('should have correct addMemberLink configuration', () => {
      expect(component.addMemberLink).toStrictEqual({
        internalPath: ['member', 'add'],
        text: 'Add a member',
        icon: 'add_circle_outline',
      });
    });

    it('should have correct adminButtons configuration', () => {
      expect(component.adminButtons).toHaveLength(2);

      expect(component.adminButtons[0]).toMatchObject({
        id: 'update-ratings-from-csv',
        tooltip: 'Update member ratings from CSV',
        icon: 'upload_file',
        action: expect.any(Function),
      });

      expect(component.adminButtons[1]).toMatchObject({
        id: 'export-to-csv',
        tooltip: 'Export to CSV',
        icon: 'download',
        action: expect.any(Function),
      });
    });

    it('should trigger file input click when first admin button action is called', () => {
      const mockClick = jest.fn();
      component.memberRatingChangesFileInput = {
        nativeElement: { click: mockClick } as unknown as HTMLInputElement,
      };

      component.adminButtons[0].action();

      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('should call onExportToCsv when second admin button action is called', () => {
      const onExportToCsvSpy = jest.spyOn(component, 'onExportToCsv').mockResolvedValue();

      component.adminButtons[1].action();

      expect(onExportToCsvSpy).toHaveBeenCalledTimes(1);
    });
  });
});
