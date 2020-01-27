import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreateOrUpdateComponent } from './event-create-or-update.component';

describe('EventCreateOrUpdateComponent', () => {
  let component: EventCreateOrUpdateComponent;
  let fixture: ComponentFixture<EventCreateOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCreateOrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
