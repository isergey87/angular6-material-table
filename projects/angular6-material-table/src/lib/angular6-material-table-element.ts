import {FormGroup} from '@angular/forms';

import {TableDataSource} from './angular6-material-table-data-source';

import cloneDeep from 'lodash.clonedeep';

export class TableElement<T> {
  id: number;
  editing: boolean;
  private _currentData?: T;
  originalData: T;
  source: TableDataSource<T>;
  validator: FormGroup;
  get currentData() {
    //express hack
    if (this.validator) {
      return Object.assign(this._currentData, this.validator.getRawValue());
    } else {
      return this._currentData;
    }
  }

  set currentData(value) {
    this._currentData = value;
    this.fillValidatorFromData();
  }

  constructor(init: Partial<TableElement<T>>) {
    Object.assign(this, init);
    this.fillValidatorFromData();
    if (this.validator) {
      if (this.editing) {
        this.validator.enable();
      } else {
        this.validator.disable();
      }
    }
  }

  fillValidatorFromData(): void {
    if (this.validator) {
      let formData = {};
      for (let key in this.validator.controls) {
        formData[key] = this._currentData[key];
      }
      this.validator.setValue(formData);
    }
  }

  delete(): void {
    this.source.delete(this.id);
  }

  confirmEditCreate(): boolean {
    this.originalData = undefined;
    if (this.id == -1)
      return this.source.confirmCreate(this);
    else
      return this.source.confirmEdit(this);
  }

  startEdit(): void {
    this.originalData = cloneDeep(this.currentData);
    this.editing = true;
    this.validator.enable();
  }

  cancelOrDelete(): void {
    if (this.id == -1 || !this.editing)
      this.delete();
    else {
      this.currentData = this.originalData;
      this.editing = false;
      this.validator.disable();
    }
  }
}
