import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCreateOrUpdateComponent } from './map-create-or-update.component';

describe('MapCreateOrUpdateComponent', () => {
  let component: MapCreateOrUpdateComponent;
  let fixture: ComponentFixture<MapCreateOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCreateOrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
