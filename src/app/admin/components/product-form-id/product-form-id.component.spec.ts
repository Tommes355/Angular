import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormIdComponent } from './product-form-id.component';

describe('ProductFormIdComponent', () => {
  let component: ProductFormIdComponent;
  let fixture: ComponentFixture<ProductFormIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFormIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
