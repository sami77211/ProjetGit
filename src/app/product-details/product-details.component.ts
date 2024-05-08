import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../Models/Product';
import { ProductsService } from 'src/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: number = 0;
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProductDetails();
    });
  }

  loadProductDetails() {
    this.productService.getProductById(this.productId)
      .subscribe((data: Product[]) => {
        this.product = data[0];
      });
  }

}
