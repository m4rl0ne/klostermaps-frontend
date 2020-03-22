import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailModalComponent } from './map-detail-modal.component';

describe('MapDetailModalComponent', () => {
  let component: MapDetailModalComponent;
  let fixture: ComponentFixture<MapDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
