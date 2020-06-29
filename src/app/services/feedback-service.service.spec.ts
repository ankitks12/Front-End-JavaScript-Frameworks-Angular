import { TestBed } from '@angular/core/testing';

import { FeedbackServiceService } from './feedback-service.service';

describe('FeedbackServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeedbackServiceService = TestBed.get(FeedbackServiceService);
    expect(service).toBeTruthy();
  });
});
