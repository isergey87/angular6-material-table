import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidatorService } from './angular6-material-table-validator.service';

@Injectable()
export class DefaultValidatorService implements ValidatorService {

  getRowValidator(): FormGroup {
    return new FormGroup({});
  }
}
