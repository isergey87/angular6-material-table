import {FormGroup} from '@angular/forms';

import {TableDataSource} from './angular6-material-table-data-source';

import cloneDeep from 'lodash.clonedeep';

export class TableElement<T> {
  id: number;
  editing: boolean;
  private _currentData?: T;
  get currentData() {
    //express hack
    return Object.assign(this._currentData, this.validator.getRawValue());
  }

  originalData: T;
  source: TableDataSource<T>;
  validator: FormGroup;

  constructor(init: Partial<TableElement<T>>) {
    Object.assign(this, init);
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
      let formData = {};
      for (let key in this.validator.controls) {
        formData[key] = this.originalData[key];
      }
      this.validator.setValue(formData);
      this.editing = false;
      this.validator.disable();
    }
  }
}
