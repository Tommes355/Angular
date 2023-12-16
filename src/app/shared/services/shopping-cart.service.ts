import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from 'shared/models/product';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { take, map } from 'rxjs/operators'
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId)
    .valueChanges()
    // .pipe(map((cart: any) => new ShoppingCart(cart.items)));
    .pipe (map((x: any) => (x) ? new ShoppingCart( x.items) : new ShoppingCart(x)));
  }


  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }


  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }


  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }


  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }


  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }


  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
    } 


  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.$key);
    item$.snapshotChanges().subscribe((item:any) => {
    // item$.take(1).subscribe(item => {
      let quantity = (item.quantity || 0) + change;
      if (quantity === 0) item$.remove();
      else item$.update({
         title: product.title,
         imageUrl: product.imageUrl,
         price: product.price,
         quantity: quantity
      });
    }); 
  }
}






  /*
  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId)
      // .map(x => new ShoppingCart(x.items));
      // .map((x :ShoppingCart) => new ShoppingCart(x.items)));
      .valueChanges().pipe(map(x => new ShoppingCart(x.items)));
      // .valueChanges().pipe(map((x :ShoppingCart) => new ShoppingCart(x.items)));
  }
  */













 /*
  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.$key);
    item$.valueChanges().take(1).subscribe(item => {
      let quantity = (item.quantity || 0) + change;
      if (quantity === 0) item$.remove();
      else item$.update({ 
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: quantity
      });
    });
  }

*/























    /*
  async addToCart(product: Product) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.$key);
    
    item$.valueChanges().subscribe(item => {
      if (item.payload.exists) {
        item$.update({ quantity: item.payload.numChildren() + 1 });
      } else { 
        item$.set({ product: product, quantity: 1 });
      }
    });
  }
  

  async addToCart(product: Product) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.$key);
    item$.valueChanges().subscribe(item => {
      item$.update({ product: product, quantity: (item.quantity || 0) + 1 });
      });
    }
  }

*/