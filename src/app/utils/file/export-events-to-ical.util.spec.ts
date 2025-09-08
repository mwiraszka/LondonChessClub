import { MOCK_EVENTS } from '@app/mocks/events.mock';

import { exportEventsToIcal } from './export-events-to-ical.util';

// Mock DOM APIs
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'Blob', {
  value: jest.fn((content, options) => ({ content, options })),
  writable: true,
});

describe('exportEventsToIcal', () => {
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    mockLink = {
      href: '',
      setAttribute: jest.fn(),
      click: jest.fn(),
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(document.body, 'removeChild').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export events to iCal format', () => {
    const events = MOCK_EVENTS.slice(0, 2);
    const filename = 'test-events.ics';

    const result = exportEventsToIcal(events, filename);

    expect(result).toBe(2);
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', filename);
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should return error when no events provided', () => {
    const result = exportEventsToIcal([], 'test.ics');

    expect(result).toEqual({
      name: 'LCCError',
      message: 'No events available for export',
    });
  });

  it('should handle export errors gracefully', () => {
    const events = MOCK_EVENTS.slice(0, 1);

    // Mock Blob constructor to throw an error
    const originalBlob = window.Blob;
    window.Blob = jest.fn(() => {
      throw new Error('Mock error');
    }) as typeof Blob;

    const result = exportEventsToIcal(events, 'test.ics');

    expect(result).toEqual({
      name: 'LCCError',
      message: 'Unknown error occurred while exporting events to iCal',
    });

    // Restore original Blob
    window.Blob = originalBlob;
  });

  it('should properly escape newlines in event descriptions', () => {
    const mockCreateObjectURL = jest.fn(() => 'mock-url');
    window.URL.createObjectURL = mockCreateObjectURL;

    const eventWithNewlines = {
      ...MOCK_EVENTS[0],
      details: 'Line 1\nLine 2\\nLine 3',
    };

    const result = exportEventsToIcal([eventWithNewlines], 'test.ics');

    expect(result).toBe(1);
    expect(mockCreateObjectURL).toHaveBeenCalled();

    // Check that the blob was created with properly escaped content
    const blobCall = (window.Blob as jest.Mock).mock.calls[0];
    const icalContent = blobCall[0][0];

    // Should contain properly escaped newlines (both actual \n and literal \n should become \\n)
    expect(icalContent).toContain('Line 1\\nLine 2\\nLine 3');
    // Should not contain unescaped newlines
    expect(icalContent).not.toContain('Line 1\nLine 2');
  });
});
