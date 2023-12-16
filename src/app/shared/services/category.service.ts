import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }


  /*





  getAll() { 
    return this.db.list('/categories', ref => ref.orderByChild('name')) 
      .snapshotChanges()
      .map(categories => { 
        return categories.map(c => ({ 
          key: c.payload.key, 
          val: c.payload.val(), 
        })); 
      });
  }



  */


  getAll() {
    return this.db.list('/categories', ref => ref.orderByChild('name')).valueChanges();
  }



}



