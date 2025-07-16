import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { pick } from 'lodash';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { EVENT_FORM_DATA_PROPERTIES } from '@app/constants';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { DialogService } from '@app/services';
import { EventsActions } from '@app/store/events';
import { query } from '@app/utils';
import { generateId } from '@app/utils/common/generate-id.util';

import { EventFormComponent } from './event-form.component';

describe('EventFormComponent', () => {
  let fixture: ComponentFixture<EventFormComponent>;
  let component: EventFormComponent;

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
      imports: [EventFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EventFormComponent);
        component = fixture.componentInstance;

        dialogService = TestBed.inject(DialogService);
        store = TestBed.inject(MockStore);

        component.formData = pick(MOCK_EVENTS[0], EVENT_FORM_DATA_PROPERTIES);
        component.hasUnsavedChanges = false;
        component.originalEvent = null;
        fixture.detectChanges();

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
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    describe('handling form data', () => {
      describe('if form has unsaved changes', () => {
        beforeEach(() => {
          jest.useFakeTimers();

          component.formData = {
            ...pick(MOCK_EVENTS[1], EVENT_FORM_DATA_PROPERTIES),
            eventDate: '2000-01-01T16:00:00.000Z',
          };
          component.hasUnsavedChanges = true;
          component.originalEvent = null;
          fixture.detectChanges();
          component.ngOnInit();

          component.form.patchValue({
            articleId: '',
            eventTime: '6:00 pm',
          });
          fixture.detectChanges();

          jest.clearAllMocks();
          component.ngOnInit();
        });

        afterEach(() => jest.useRealTimers());

        it('should convert value correctly before dispatching formValueChanged action', () => {
          // Run debounce timer to trigger the valueChanges subscription
          jest.runAllTimers();

          expect(dispatchSpy).toHaveBeenCalled();
          const callArgs = dispatchSpy.mock.calls[0][0];
          expect(callArgs.eventId).toBeNull(); // Because originalEvent was null
          expect(callArgs.type).toBe(EventsActions.formValueChanged.type);
        });

        it('should initialize the form with touched values from formData', () => {
          expect(initFormSpy).toHaveBeenCalledTimes(1);
          expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

          for (const property of EVENT_FORM_DATA_PROPERTIES) {
            expect(component.form.controls[property].value).toBe(
              component.formData[property],
            );
            expect(component.form.controls[property].touched).toBe(true);
          }
        });
      });

      describe('if form does not have unsaved changes', () => {
        beforeEach(() => {
          jest.useFakeTimers();

          component.formData = pick(MOCK_EVENTS[2], EVENT_FORM_DATA_PROPERTIES);
          component.hasUnsavedChanges = false;
          component.originalEvent = MOCK_EVENTS[1];
          fixture.detectChanges();
          component.ngOnInit();

          component.form.patchValue({
            articleId: '',
            eventTime: '6:00 pm',
          });
          fixture.detectChanges();

          jest.clearAllMocks();
          component.ngOnInit();
        });

        it('should convert value correctly before dispatching formValueChanged action', () => {
          // Run debounce timer to trigger the valueChanges subscription
          jest.runAllTimers();

          const callArgs = dispatchSpy.mock.calls[0][0];
          expect(callArgs.eventId).toBe(MOCK_EVENTS[1].id); // From originalEvent
          expect(callArgs.type).toBe(EventsActions.formValueChanged.type);
        });

        it('should initialize the form with untouched values from formData', () => {
          expect(initFormSpy).toHaveBeenCalledTimes(1);
          expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

          for (const property of EVENT_FORM_DATA_PROPERTIES) {
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
        component.form.patchValue({ title: '' });
        fixture.detectChanges();

        expect(component.form.controls.title.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({ title: '1000' });
        fixture.detectChanges();

        expect(component.form.controls.title.hasError('required')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({
          title: ' ',
          details: '\t\n',
        });
        fixture.detectChanges();

        expect(component.form.controls.title.hasError('pattern')).toBe(true);
        expect(component.form.controls.details.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({
          title: '🔥',
          details: '123',
        });
        fixture.detectChanges();

        expect(component.form.controls.title.hasError('pattern')).toBe(false);
        expect(component.form.controls.details.hasError('pattern')).toBe(false);
      });
    });
  });

  describe('onRestore', () => {
    beforeEach(() => {
      component.hasUnsavedChanges = true;
      component.originalEvent = MOCK_EVENTS[4];
      fixture.detectChanges();

      component.ngOnInit();

      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should dispatch event form data reset and re-initialize form if dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onRestore();
      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: 'Restore original event data? All changes will be lost.',
            confirmButtonText: 'Restore',
            confirmButtonType: 'warning',
          },
        },
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        EventsActions.eventFormDataReset({ eventId: MOCK_EVENTS[4].id }),
      );
      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

      // Verify formValueChanged was dispatched at least once
      const formValueChangedCalls = dispatchSpy.mock.calls.filter(
        call => call[0].type === EventsActions.formValueChanged.type,
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
      expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.cancelSelected());
    });
  });

  describe('onSubmit', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      component.form.patchValue({ title: '' }); // Invalid - title field is required
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();

      expect(component.form.controls.title.touched).toBe(true);
      expect(component.form.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data if adding a new event', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.formData = pick(MOCK_EVENTS[3], EVENT_FORM_DATA_PROPERTIES);
      component.originalEvent = null;
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Add ${component.formData.title} to schedule?`,
            confirmButtonText: 'Add',
          },
        },
      });
      expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.addEventRequested());
    });

    it('should open confirmation dialog with correct data if updating an event', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.formData = pick(MOCK_EVENTS[3], EVENT_FORM_DATA_PROPERTIES);
      component.originalEvent = MOCK_EVENTS[2];
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Update ${component.originalEvent.title} event?`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventsActions.updateEventRequested({ eventId: MOCK_EVENTS[2].id }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      component.formData = pick(MOCK_EVENTS[3], EVENT_FORM_DATA_PROPERTIES);
      component.originalEvent = null;
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalledWith(EventsActions.addEventRequested());
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        EventsActions.updateEventRequested({ eventId: MOCK_EVENTS[2].id }),
      );
    });
  });

  describe('template rendering', () => {
    describe('modification info', () => {
      it('should render if originalEvent is defined', () => {
        component.originalEvent = MOCK_EVENTS[0];
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).not.toBeNull();
      });

      it('should not render if originalEvent is null', () => {
        component.originalEvent = null;
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeNull();
      });
    });

    describe('restore button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        component.hasUnsavedChanges = false;
        fixture.detectChanges();

        const restoreButton = query(fixture.debugElement, '.restore-button');
        expect(restoreButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes', () => {
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const restoreButton = query(fixture.debugElement, '.restore-button');
        restoreButton.triggerEventHandler('click');

        expect(restoreButton.nativeElement.disabled).toBe(false);
        expect(restoreSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('cancel button', () => {
      it('should be enabled if there are unsaved changes', () => {
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });

      it('should also be enabled if there are no unsaved changes', () => {
        component.hasUnsavedChanges = false;
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('submit button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        component.form.setValue({
          ...pick(MOCK_EVENTS[3], EVENT_FORM_DATA_PROPERTIES),
          articleId: generateId(24),
          eventTime: '6:00 pm',
        });
        component.hasUnsavedChanges = false;
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be disabled if the form is invalid', () => {
        component.form.setValue({
          ...pick(MOCK_EVENTS[3], EVENT_FORM_DATA_PROPERTIES),
          articleId: generateId(24),
          eventTime: '6:00pm', // Invalid - unsupported time format
        });
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes and the form is valid', () => {
        component.form.setValue({
          ...pick(MOCK_EVENTS[3], EVENT_FORM_DATA_PROPERTIES),
          articleId: generateId(24),
          eventTime: '6:00 pm',
        });
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(false);
        expect(submitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
