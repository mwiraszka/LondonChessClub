import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment-timezone';
import { ReplaySubject, of, throwError } from 'rxjs';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { INITIAL_MEMBER_FORM_DATA } from '@app/constants';
import { MOCK_MEMBERS } from '@app/mocks/members.mock';
import { ApiResponse, LccError, Member, PaginatedItems, User } from '@app/models';
import { MembersApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';

import { MembersActions, MembersSelectors } from '.';
import { MembersEffects } from './members.effects';

const mockExportDataToCsv = jest.fn();
const mockParseError = jest.fn();
const mockIsExpired = jest.fn();
const mockGetNewPeakRating = jest.fn();

jest.mock('@app/utils', () => ({
  exportDataToCsv: (...args: unknown[]) => mockExportDataToCsv(...args),
  getNewPeakRating: (rating: string, peakRating: string) =>
    mockGetNewPeakRating(rating, peakRating),
  isDefined: <T>(value: T | null | undefined): value is T => value != null,
  isExpired: (date: unknown) => mockIsExpired(date),
  parseError: (error: unknown) => mockParseError(error),
}));

describe('MembersEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: MembersEffects;
  let membersApiService: jest.Mocked<MembersApiService>;
  let store: MockStore;

  const mockUser: User = {
    id: 'user123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    isAdmin: true,
  };

  const mockError: LccError = {
    name: 'LCCError',
    message: 'Test error',
  };

  const mockApiResponse: ApiResponse<PaginatedItems<Member>> = {
    data: {
      items: [MOCK_MEMBERS[0], MOCK_MEMBERS[1]],
      filteredCount: 2,
      totalCount: 5,
    },
  };

  beforeEach(() => {
    const membersApiServiceMock = {
      getAllMembers: jest.fn(),
      getFilteredMembers: jest.fn(),
      getMember: jest.fn(),
      addMember: jest.fn(),
      updateMember: jest.fn(),
      updateMembers: jest.fn(),
      deleteMember: jest.fn(),
    };

    const mockMembersState = {
      ids: MOCK_MEMBERS.map(m => m.id),
      entities: MOCK_MEMBERS.reduce(
        (acc, member) => ({
          ...acc,
          [member.id]: { member, formData: INITIAL_MEMBER_FORM_DATA },
        }),
        {},
      ),
      callState: { status: 'idle' as const, loadStart: null, error: null },
      newMemberFormData: INITIAL_MEMBER_FORM_DATA,
      lastFullFetch: null,
      lastFilteredFetch: null,
      filteredMembers: [],
      options: {
        page: 1,
        pageSize: 10,
        sortBy: 'lastName',
        sortOrder: 'asc',
        filters: {
          showInactiveMembers: {
            label: 'Show inactive members',
            value: false,
          },
        },
        search: '',
      },
      filteredCount: null,
      totalCount: 0,
    };

    TestBed.configureTestingModule({
      providers: [
        MembersEffects,
        provideMockActions(() => actions$),
        { provide: MembersApiService, useValue: membersApiServiceMock },
        provideMockStore({
          initialState: {
            membersState: mockMembersState,
          },
        }),
      ],
    });

    effects = TestBed.inject(MembersEffects);
    membersApiService = TestBed.inject(
      MembersApiService,
    ) as jest.Mocked<MembersApiService>;
    store = TestBed.inject(MockStore);
    actions$ = new ReplaySubject<Action>(1);

    jest.clearAllMocks();
    mockParseError.mockImplementation(error => error);
    mockGetNewPeakRating.mockImplementation((rating, peakRating) => peakRating);
  });

  describe('fetchAllMembers$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectIsAdmin, true);
      store.refreshState();
    });

    it('should fetch all members successfully', done => {
      membersApiService.getAllMembers.mockReturnValue(of(mockApiResponse));

      actions$.next(MembersActions.fetchAllMembersRequested());

      effects.fetchAllMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchAllMembersSucceeded({
            members: mockApiResponse.data.items,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        expect(membersApiService.getAllMembers).toHaveBeenCalledWith(true);
        done();
      });
    });

    it('should handle fetch all members failure', done => {
      membersApiService.getAllMembers.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.fetchAllMembersRequested());

      effects.fetchAllMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchAllMembersFailed({ error: mockError }),
        );
        expect(mockParseError).toHaveBeenCalledWith(mockError);
        done();
      });
    });
  });

  describe('fetchFilteredMembers$', () => {
    const mockOptions = {
      page: 2,
      pageSize: 10,
      sortBy: 'firstName' as const,
      sortOrder: 'desc' as const,
      filters: {
        showInactiveMembers: {
          label: 'Show inactive members',
          value: false,
        },
      },
      search: 'chess',
    };

    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectIsAdmin, true);
      store.overrideSelector(MembersSelectors.selectOptions, mockOptions);
      store.refreshState();
    });

    it('should fetch filtered members with options from store', done => {
      membersApiService.getFilteredMembers.mockReturnValue(of(mockApiResponse));

      actions$.next(MembersActions.fetchFilteredMembersRequested());

      effects.fetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersSucceeded({
            members: mockApiResponse.data.items,
            filteredCount: mockApiResponse.data.filteredCount,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        expect(membersApiService.getFilteredMembers).toHaveBeenCalledWith(
          true,
          mockOptions,
        );
        done();
      });
    });

    it('should fetch filtered members in background', done => {
      membersApiService.getFilteredMembers.mockReturnValue(of(mockApiResponse));

      actions$.next(MembersActions.fetchFilteredMembersInBackgroundRequested());

      effects.fetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersSucceeded({
            members: mockApiResponse.data.items,
            filteredCount: mockApiResponse.data.filteredCount,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        done();
      });
    });

    it('should handle fetch filtered members failure', done => {
      membersApiService.getFilteredMembers.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.fetchFilteredMembersRequested());

      effects.fetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('refetchFilteredMembers$', () => {
    it('should trigger refetch after addMemberSucceeded', done => {
      actions$.next(MembersActions.addMemberSucceeded({ member: MOCK_MEMBERS[0] }));

      effects.refetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after updateMemberSucceeded', done => {
      actions$.next(
        MembersActions.updateMemberSucceeded({
          member: MOCK_MEMBERS[0],
          originalMemberName: 'Old Name',
        }),
      );

      effects.refetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after deleteMemberSucceeded', done => {
      actions$.next(
        MembersActions.deleteMemberSucceeded({
          memberId: MOCK_MEMBERS[0].id,
          memberName: 'Test Member',
        }),
      );

      effects.refetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after paginationOptionsChanged', done => {
      actions$.next(
        MembersActions.paginationOptionsChanged({
          options: {
            page: 1,
            pageSize: 10,
            sortBy: 'lastName',
            sortOrder: 'asc',
            filters: {
              showInactiveMembers: {
                label: 'Show inactive members',
                value: false,
              },
            },
            search: '',
          },
          fetch: true,
        }),
      );

      effects.refetchFilteredMembers$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchFilteredMembersInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch when last fetch is expired', fakeAsync(() => {
      const expiredTimestamp = moment().subtract(20, 'minutes').toISOString();
      store.overrideSelector(MembersSelectors.selectLastFilteredFetch, expiredTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(true);

      const results: Action[] = [];
      effects.refetchFilteredMembers$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(10 * 60 * 1000);

      expect(results[0]).toEqual(
        MembersActions.fetchFilteredMembersInBackgroundRequested(),
      );
      expect(mockIsExpired).toHaveBeenCalledWith(expiredTimestamp);
    }));

    it('should not trigger refetch when last fetch is not expired', fakeAsync(() => {
      const recentTimestamp = moment().subtract(5, 'minutes').toISOString();
      store.overrideSelector(MembersSelectors.selectLastFilteredFetch, recentTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(false);

      const results: Action[] = [];
      effects.refetchFilteredMembers$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(10 * 60 * 1000);

      expect(results).toHaveLength(0);
    }));
  });

  describe('fetchMember$', () => {
    it('should fetch a single member successfully', done => {
      const mockResponse: ApiResponse<Member> = { data: MOCK_MEMBERS[0] };
      membersApiService.getMember.mockReturnValue(of(mockResponse));

      actions$.next(
        MembersActions.fetchMemberRequested({ memberId: MOCK_MEMBERS[0].id }),
      );

      effects.fetchMember$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchMemberSucceeded({ member: MOCK_MEMBERS[0] }),
        );
        expect(membersApiService.getMember).toHaveBeenCalledWith(MOCK_MEMBERS[0].id);
        done();
      });
    });

    it('should handle fetch member failure', done => {
      membersApiService.getMember.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.fetchMemberRequested({ memberId: 'invalid-id' }));

      effects.fetchMember$.subscribe(action => {
        expect(action).toEqual(MembersActions.fetchMemberFailed({ error: mockError }));
        done();
      });
    });
  });

  describe('addMember$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
    });

    it('should add member successfully', done => {
      const mockAddResponse: ApiResponse<string> = { data: 'new-member-id' };

      membersApiService.addMember.mockReturnValue(of(mockAddResponse));

      actions$.next(MembersActions.addMemberRequested());

      effects.addMember$.subscribe(action => {
        expect(action.type).toBe(MembersActions.addMemberSucceeded.type);
        const payload = (action as ReturnType<typeof MembersActions.addMemberSucceeded>)
          .member;
        expect(payload.id).toBe('new-member-id');
        expect(payload.modificationInfo.createdBy).toBe('Test User');
        expect(payload.modificationInfo.lastEditedBy).toBe('Test User');
        expect(membersApiService.addMember).toHaveBeenCalled();
        done();
      });
    });

    it('should handle add member failure', done => {
      membersApiService.addMember.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.addMemberRequested());

      effects.addMember$.subscribe(action => {
        expect(action).toEqual(MembersActions.addMemberFailed({ error: mockError }));
        done();
      });
    });
  });

  describe('updateMember$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
      mockGetNewPeakRating.mockReturnValue('2900');
    });

    it('should update member successfully', done => {
      const memberId = MOCK_MEMBERS[0].id;
      const mockUpdateResponse: ApiResponse<string> = { data: memberId };

      membersApiService.updateMember.mockReturnValue(of(mockUpdateResponse));

      actions$.next(MembersActions.updateMemberRequested({ memberId }));

      effects.updateMember$.subscribe(action => {
        expect(action.type).toBe(MembersActions.updateMemberSucceeded.type);
        const payload = action as ReturnType<typeof MembersActions.updateMemberSucceeded>;
        expect(payload.member.id).toBe(memberId);
        expect(payload.member.modificationInfo.lastEditedBy).toBe('Test User');
        expect(payload.originalMemberName).toBe(
          `${MOCK_MEMBERS[0].firstName} ${MOCK_MEMBERS[0].lastName}`,
        );
        expect(membersApiService.updateMember).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update member failure', done => {
      const memberId = MOCK_MEMBERS[0].id;

      membersApiService.updateMember.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.updateMemberRequested({ memberId }));

      effects.updateMember$.subscribe(action => {
        expect(action).toEqual(MembersActions.updateMemberFailed({ error: mockError }));
        done();
      });
    });

    it('should not dispatch success if response ID does not match', done => {
      const memberId = MOCK_MEMBERS[0].id;
      const mockUpdateResponse: ApiResponse<string> = { data: 'different-id' };

      membersApiService.updateMember.mockReturnValue(of(mockUpdateResponse));

      actions$.next(MembersActions.updateMemberRequested({ memberId }));

      const subscription = effects.updateMember$.subscribe(() => {
        done.fail('Should not dispatch action when IDs do not match');
      });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });

  describe('deleteMember$', () => {
    it('should delete member successfully', done => {
      const mockDeleteResponse: ApiResponse<string> = { data: MOCK_MEMBERS[0].id };
      membersApiService.deleteMember.mockReturnValue(of(mockDeleteResponse));

      actions$.next(MembersActions.deleteMemberRequested({ member: MOCK_MEMBERS[0] }));

      effects.deleteMember$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.deleteMemberSucceeded({
            memberId: MOCK_MEMBERS[0].id,
            memberName: `${MOCK_MEMBERS[0].firstName} ${MOCK_MEMBERS[0].lastName}`,
          }),
        );
        expect(membersApiService.deleteMember).toHaveBeenCalledWith(MOCK_MEMBERS[0].id);
        done();
      });
    });

    it('should handle delete member failure', done => {
      membersApiService.deleteMember.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.deleteMemberRequested({ member: MOCK_MEMBERS[0] }));

      effects.deleteMember$.subscribe(action => {
        expect(action).toEqual(MembersActions.deleteMemberFailed({ error: mockError }));
        done();
      });
    });

    it('should not dispatch success if response ID does not match', done => {
      const mockDeleteResponse: ApiResponse<string> = { data: 'different-id' };
      membersApiService.deleteMember.mockReturnValue(of(mockDeleteResponse));

      actions$.next(MembersActions.deleteMemberRequested({ member: MOCK_MEMBERS[0] }));

      const subscription = effects.deleteMember$.subscribe(() => {
        done.fail('Should not dispatch action when IDs do not match');
      });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });

  describe('exportMembersToCsv$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectIsAdmin, true);
      store.refreshState();
    });

    it('should export members to CSV successfully', done => {
      const exportedCount = 5;
      membersApiService.getAllMembers.mockReturnValue(of(mockApiResponse));
      mockExportDataToCsv.mockReturnValue(exportedCount);

      actions$.next(MembersActions.exportMembersToCsvRequested());

      effects.exportMembersToCsv$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.exportMembersToCsvSucceeded({ exportedCount }),
        );
        expect(membersApiService.getAllMembers).toHaveBeenCalledWith(true);
        expect(mockExportDataToCsv).toHaveBeenCalledWith(
          mockApiResponse.data.items,
          expect.stringMatching(/^members_export_\d{4}-\d{2}-\d{2}\.csv$/),
        );
        done();
      });
    });

    it('should handle export failure when exportDataToCsv returns error', done => {
      const exportError: LccError = {
        name: 'LCCError',
        message: 'Export failed',
      };
      membersApiService.getAllMembers.mockReturnValue(of(mockApiResponse));
      mockExportDataToCsv.mockReturnValue(exportError);

      actions$.next(MembersActions.exportMembersToCsvRequested());

      effects.exportMembersToCsv$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.exportMembersToCsvFailed({ error: exportError }),
        );
        done();
      });
    });

    it('should handle API error during export', done => {
      membersApiService.getAllMembers.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(MembersActions.exportMembersToCsvRequested());

      effects.exportMembersToCsv$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.fetchAllMembersFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('updateMemberRatings$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
    });

    it('should update member ratings successfully', done => {
      const membersWithNewRatings = [
        { ...MOCK_MEMBERS[0], newRating: '2900', newPeakRating: '2900' },
        { ...MOCK_MEMBERS[1], newRating: '2800', newPeakRating: '2850' },
      ];
      const updatedMembers = [
        { ...MOCK_MEMBERS[0], rating: '2900', peakRating: '2900' },
        { ...MOCK_MEMBERS[1], rating: '2800', peakRating: '2850' },
      ];
      const mockUpdateResponse: ApiResponse<Member[]> = {
        data: updatedMembers,
      };

      membersApiService.updateMembers.mockReturnValue(of(mockUpdateResponse));

      actions$.next(
        MembersActions.updateMemberRatingsRequested({ membersWithNewRatings }),
      );

      effects.updateMemberRatings$.subscribe(action => {
        expect(action.type).toBe(MembersActions.updateMemberRatingsSucceeded.type);
        const payload = action as ReturnType<
          typeof MembersActions.updateMemberRatingsSucceeded
        >;
        expect(payload.members).toHaveLength(2);
        expect(payload.members[0].rating).toBe('2900');
        expect(payload.members[1].rating).toBe('2800');
        expect(membersApiService.updateMembers).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update member ratings failure', done => {
      const membersWithNewRatings = [
        { ...MOCK_MEMBERS[0], newRating: '2900', newPeakRating: '2900' },
      ];

      membersApiService.updateMembers.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(
        MembersActions.updateMemberRatingsRequested({ membersWithNewRatings }),
      );

      effects.updateMemberRatings$.subscribe(action => {
        expect(action).toEqual(
          MembersActions.updateMemberRatingsFailed({ error: mockError }),
        );
        done();
      });
    });
  });
});
