import { TestBed } from '@angular/core/testing';
import { JConnectivityService } from './connectivity.service';


describe('JConnectivityService', () => {
  let service: JConnectivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JConnectivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if online', () => {
    service.isConnected.subscribe((isOnline) => {
      expect(isOnline).toBeTrue();
    });
  });

  it('should return false if offline', () => {
    service.isConnected.subscribe((isOnline) => {
      expect(isOnline).toBeFalse();
    });
  });
});
