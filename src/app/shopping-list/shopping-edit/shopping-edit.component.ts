import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editSub: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('f') slForm: NgForm;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
   this.editSub = this.slService.startEditing
   .subscribe((index: number)=>{
     this.editedItemIndex = index;
    this.editMode = true;
    this.editedItem = this.slService.getEditIngrident(index);
    this.slForm.setValue({
      name: this.editedItem.name,
      amount: this.editedItem.amount
    })
   });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode === true) {
      this.slService.updateIngrident(this.editedItemIndex, newIngredient);
    }
    else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

 
  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
  }
}
