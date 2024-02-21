import { TestBed } from '@angular/core/testing';

import { JHttp } from './jhttp.service';

describe('JHttpService', () => {
  let service: JHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should be synchronized', () => {
  //   expect(service.isSynchronized).toBeTrue();
  // });

});
