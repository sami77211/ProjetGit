import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/services/products.service';

import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: any) => void) => fn({
                id: 123 // Example ID for testing
              })
            }
          }
        },
        {
          provide: ProductsService,
          useValue: {} // Mock or real service instance based on your preference
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
