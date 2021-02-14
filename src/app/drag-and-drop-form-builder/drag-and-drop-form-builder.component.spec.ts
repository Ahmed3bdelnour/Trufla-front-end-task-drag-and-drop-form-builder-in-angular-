import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropFormBuilderComponent } from './drag-and-drop-form-builder.component';

describe('DragAndDropFormBuilderComponent', () => {
  let component: DragAndDropFormBuilderComponent;
  let fixture: ComponentFixture<DragAndDropFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragAndDropFormBuilderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
