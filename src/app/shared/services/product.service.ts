import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from 'shared/models/product';
import 'rxjs/add/operator/map'

@Injectable()
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list<Product>('/products');
  }

  get(productId) {
    return this.db.object('/products/' + productId);
  }

  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }
}





/*
  getAll() {
    return this.products=this.db.list('products')
    .snapshotChanges()
    .pipe(map(actions => actions.map(a => {
      const data = a.payload.val();
      const key = a.payload.key;
      console.log(key);
      console.log("ids are working");
      return {key,...data};
    })));
  }
*/







  

/*
  getAll() { 
    return this.db.list<Product>('/products') 
      .snapshotChanges()
      .map(products => { 
        return products.map(c => ({ 
          key: c.payload.key, 
          val: c.payload.val(), 
        })); 
      });
  }
















  getAll() {
    return this.db.list<Product>('/products').valueChanges();
  }  

  getAll() {
    return this.products = this.db.list('products')
      .snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.val();
        const key = a.payload.key;
        console.log(key);
        console.log("ids are working");
        return {key,...data};
      })));
  }



  getAll() {
    return this.db.list('/products/',
    ref => ref.orderByChild('title'))
    .snapshotChanges();
    .map(actions => {
           return actions.map(action => ({
             key: action.key, 
             title: action.payload.val().title,
             imageUrl: action.payload.val().imageUrl,
             price: action.payload.val().price,
             category: action.payload.val().category
           }));
    });
  }


*/



 
