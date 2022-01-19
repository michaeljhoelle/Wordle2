import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-winner-box',
  templateUrl: './winner-box.component.html',
  styleUrls: ['./winner-box.component.css']
})
export class WinnerBoxComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  rank: string;

  constructor (
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WinnerBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    switch (data.tries) {
      case 1:
      case 2:
        this.rank =  "pure luck"
        break;
      case 3:
        this.rank = "potentially a great performance, but I’m suspicious"
        break;
      case 4:
      case 5:
        this.rank = "the champions’ zone. true indicator of skill. hard-fought victory, like battling a fish for hours and finally reeling it in"
        break;
      default:
        this.rank = "stupid idiot"
      }
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
