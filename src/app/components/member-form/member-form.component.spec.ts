import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { pick } from 'lodash';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { MEMBER_FORM_DATA_PROPERTIES } from '@app/constants';
import { MOCK_MEMBERS } from '@app/mocks/members.mock';
import { DialogService } from '@app/services';
import { MembersActions } from '@app/store/members';
import { query } from '@app/utils';

import { MemberFormComponent } from './member-form.component';

describe('MemberFormComponent', () => {
  let fixture: ComponentFixture<MemberFormComponent>;
  let component: MemberFormComponent;

  let dialogService: DialogService;
  let store: MockStore;

  let cancelSpy: jest.SpyInstance;
  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let restoreSpy: jest.SpyInstance;
  let submitSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MemberFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MemberFormComponent);
        component = fixture.componentInstance;

        dialogService = TestBed.inject(DialogService);
        store = TestBed.inject(MockStore);

        cancelSpy = jest.spyOn(component, 'onCancel');
        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        dispatchSpy = jest.spyOn(store, 'dispatch');
        // @ts-expect-error Private class member
        initFormSpy = jest.spyOn(component, 'initForm');
        initFormValueChangeListenerSpy = jest.spyOn(
          component,
          // @ts-expect-error Private class member
          'initFormValueChangeListener',
        );
        restoreSpy = jest.spyOn(component, 'onRestore');
        submitSpy = jest.spyOn(component, 'onSubmit');

        fixture.componentRef.setInput(
          'formData',
          pick(MOCK_MEMBERS[0], MEMBER_FORM_DATA_PROPERTIES),
        );
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.componentRef.setInput('isSafeMode', false);
        fixture.componentRef.setInput('originalMember', null);

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    describe('handling form data', () => {
      describe('if form has unsaved changes', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('hasUnsavedChanges', true);
          fixture.detectChanges();

          jest.clearAllMocks();
          component.ngOnInit();
        });

        it('should initialize the form with touched values from formData', () => {
          expect(initFormSpy).toHaveBeenCalledTimes(1);
          expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

          for (const property of MEMBER_FORM_DATA_PROPERTIES) {
            expect(component.form.controls[property].value).toBe(
              component.formData[property],
            );
            expect(component.form.controls[property].touched).toBe(true);
          }
        });
      });

      describe('if form does not have unsaved changes', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('hasUnsavedChanges', false);
          fixture.detectChanges();

          jest.clearAllMocks();
          component.ngOnInit();
        });

        it('should initialize the form with untouched values from formData', () => {
          expect(initFormSpy).toHaveBeenCalledTimes(1);
          expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

          for (const property of MEMBER_FORM_DATA_PROPERTIES) {
            expect(component.form.controls[property].value).toBe(
              component.formData[property],
            );
            expect(component.form.controls[property].untouched).toBe(true);
          }
        });
      });
    });
  });

  describe('form validation', () => {
    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.patchValue({ firstName: '' });
        fixture.detectChanges();

        expect(component.form.controls.firstName.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({ rating: '1000' });
        fixture.detectChanges();

        expect(component.form.controls.rating.hasError('required')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({
          firstName: ' ',
          lastName: '\t\n',
          city: '  ',
        });
        fixture.detectChanges();

        expect(component.form.controls.firstName.hasError('pattern')).toBe(true);
        expect(component.form.controls.lastName.hasError('pattern')).toBe(true);
        expect(component.form.controls.city.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({
          firstName: '🔥',
          lastName: 'abc',
          city: '123',
        });
        fixture.detectChanges();

        expect(component.form.controls.firstName.hasError('pattern')).toBe(false);
        expect(component.form.controls.lastName.hasError('pattern')).toBe(false);
        expect(component.form.controls.city.hasError('pattern')).toBe(false);
      });
    });
  });

  describe('onRestore', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasUnsavedChanges', true);
      fixture.componentRef.setInput('originalMember', MOCK_MEMBERS[4]);
      fixture.detectChanges();

      component.ngOnInit();

      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should dispatch member form data reset and re-initialize form if dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onRestore();
      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: 'Restore original member data? All changes will be lost.',
            confirmButtonText: 'Restore',
            confirmButtonType: 'warning',
          },
        },
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.memberFormDataReset({ memberId: MOCK_MEMBERS[4].id }),
      );
      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

      // Verify formValueChanged was dispatched at least once
      const formValueChangedCalls = dispatchSpy.mock.calls.filter(
        call => call[0].type === MembersActions.formValueChanged.type,
      );
      expect(formValueChangedCalls.length).toBeGreaterThan(0);
    });

    it('should not dispatch reset action or re-initialize form if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onRestore();
      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(initFormSpy).not.toHaveBeenCalled();
      expect(initFormValueChangeListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dispatch cancelSelected action', () => {
      component.onCancel();
      expect(dispatchSpy).toHaveBeenCalledWith(MembersActions.cancelSelected());
    });
  });

  describe('onSubmit', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      component.form.patchValue({ rating: '' }); // Invalid - rating field is required
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();

      expect(component.form.controls.rating.touched).toBe(true);
      expect(component.form.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data if adding a new member', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_MEMBERS[3], MEMBER_FORM_DATA_PROPERTIES),
      );
      fixture.componentRef.setInput('originalMember', null);
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Add ${component.formData.firstName} ${component.formData.lastName}?`,
            confirmButtonText: 'Add',
          },
        },
      });
      expect(dispatchSpy).toHaveBeenCalledWith(MembersActions.addMemberRequested());
    });

    it('should open confirmation dialog with correct data if updating a member', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_MEMBERS[3], MEMBER_FORM_DATA_PROPERTIES),
      );
      fixture.componentRef.setInput('originalMember', MOCK_MEMBERS[2]);
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Update ${component.originalMember!.firstName} ${component.originalMember!.lastName}?`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        MembersActions.updateMemberRequested({ memberId: MOCK_MEMBERS[2].id }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_MEMBERS[3], MEMBER_FORM_DATA_PROPERTIES),
      );
      fixture.componentRef.setInput('originalMember', null);
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalledWith(MembersActions.addMemberRequested());
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        MembersActions.updateMemberRequested({ memberId: MOCK_MEMBERS[2].id }),
      );
    });
  });

  describe('template rendering', () => {
    describe('is-active input', () => {
      it('should render if originalMember is defined', () => {
        fixture.componentRef.setInput('originalMember', MOCK_MEMBERS[0]);
        fixture.detectChanges();

        expect(query(fixture.debugElement, '#is-active-input')).toBeTruthy();
      });

      it('should not render if originalMember is null', () => {
        fixture.componentRef.setInput('originalMember', null);
        fixture.detectChanges();

        expect(query(fixture.debugElement, '#is-active-input')).toBeFalsy();
      });
    });

    describe('safe-mode notice', () => {
      it('should render if isSafeMode is true', () => {
        fixture.componentRef.setInput('isSafeMode', true);
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-safe-mode-notice')).toBeTruthy();
      });

      it('should not render if isSafeMode is false', () => {
        fixture.componentRef.setInput('isSafeMode', false);
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-safe-mode-notice')).toBeFalsy();
      });
    });

    describe('modification info', () => {
      it('should render if originalMember is defined', () => {
        fixture.componentRef.setInput('originalMember', MOCK_MEMBERS[0]);
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeTruthy();
      });

      it('should not render if originalMember is null', () => {
        fixture.componentRef.setInput('originalMember', null);
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeFalsy();
      });
    });

    describe('restore button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.detectChanges();

        const restoreButton = query(fixture.debugElement, '.restore-button');
        expect(restoreButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        const restoreButton = query(fixture.debugElement, '.restore-button');
        restoreButton.triggerEventHandler('click');

        expect(restoreButton.nativeElement.disabled).toBe(false);
        expect(restoreSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('cancel button', () => {
      it('should be enabled if there are unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });

      it('should also be enabled if there are no unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('submit button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        component.form.setValue(pick(MOCK_MEMBERS[3], MEMBER_FORM_DATA_PROPERTIES));
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be disabled if the form is invalid', () => {
        component.form.setValue({
          ...pick(MOCK_MEMBERS[3], MEMBER_FORM_DATA_PROPERTIES),
          lastName: '', // Invalid - lastName is a required field
        });
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes and the form is valid', () => {
        component.form.setValue(pick(MOCK_MEMBERS[3], MEMBER_FORM_DATA_PROPERTIES));
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(false);
        expect(submitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
