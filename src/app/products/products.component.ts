import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/services/products.service';
import { Product } from '../Models/Product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  listProducts: Product[] = [];
  addProductForm!: FormGroup;
  updateProductForm!: FormGroup;
  product: Product = new Product();
  idProduct: number | undefined;
  image: string = "../../assets/images/Products_images/image_template.png";
  url: string | undefined = '';
  msg: any = '';

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllProducts();
    this.initAddForm();
  }

  public loadAllProducts() {
    this.productService.getAllProducts()
      .subscribe({
        next: (data: Product[]) => {
          this.listProducts = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  public initAddForm() {
    this.addProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      image: ['']
    });
  }

  public onSubmitAdd() {
    const name = this.addProductForm.get('name')?.value;
    const price = this.addProductForm.get('price')?.value;
    const quantity = this.addProductForm.get('quantity')?.value;

    let product = new Product(name, price, quantity, this.image);
    this.productService.registerProduct(product)
      .subscribe({
        next: (data: Product) => {
          console.log("Produit ajouté avec succès");
          this.listProducts.push(data); // Ajouter le nouveau produit à la liste
          this.initAddForm(); // Réinitialiser le formulaire
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  public selectFile(event: any) {
    if (event.target.files[0] || event.target.files[0].length !== 0) {
      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.msg = 'Seules les images sont supportées !';
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.msg = "";
        this.url = reader.result?.toString();
        this.image = this.url || ''; // Mettre à jour l'image avec le contenu du fichier
      }
    }
  }
}
