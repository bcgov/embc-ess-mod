import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-override-datetime',
  templateUrl: './override-datetime.component.html',
  styleUrls: ['./override-datetime.component.scss']
})
export class OverrideDatetimeComponent implements OnInit {
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;
  @Input() currentDate: string;
  @Input() currentTime: string;
  @Output() collapse = new EventEmitter<boolean>(false);
  @Output() dateTime = new EventEmitter<UntypedFormGroup>(null);
  dateTimeForm: UntypedFormGroup;
  noDate = false;
  noTime = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.createDateTimeForm();
  }

  createDateTimeForm(): void {
    this.dateTimeForm = this.formBuilder.group({
      date: [new Date(), [this.customValidation.validDateValidator()]],
      time: [this.currentTime]
    });
  }

  /**
   * Returns the control of the form
   */
  get datetTimeFormControl(): { [key: string]: AbstractControl } {
    return this.dateTimeForm.controls;
  }

  cancel() {
    this.collapse.emit(true);
  }

  update() {
    if (this.dateTimeForm.get('date').value === null || '') {
      this.noDate = true;
    } else {
      this.noDate = true;
    }

    if (this.dateTimeForm.get('time').value === null || '') {
      this.noTime = true;
    } else {
      this.noTime = true;
    }

    if (this.dateTimeForm.valid) {
      this.dateTime.emit(this.dateTimeForm);
    }
  }
}
