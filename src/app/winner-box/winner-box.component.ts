import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {WordRow} from "../model/WordRow";
import {LetterboxStyle} from "../model/LetterBox";

@Component({
  selector: 'app-winner-box',
  templateUrl: './winner-box.component.html',
  styleUrls: ['./winner-box.component.css']
})
export class WinnerBoxComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  rank: string;
  result: WordRow[];

  constructor (
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WinnerBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.result = data.result;
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

  getResult() {
    let tries = this.result.length
    let triesText = this.result.length > 1 ? " tries" : " try";
    let out = "Wordle 2\r\n" + tries + triesText + "\r\n";
    if (tries == 69) {
      out = out.concat("nice\r\n")
    }
    for (let i = 0; i < this.result.length; i++) {
      let str = this.result[i].letters.map(s => {
        switch (s.style) {
          default:
          case LetterboxStyle.Wrong:
            return "⬜"
          case LetterboxStyle.Close:
            return "🟨"
          case LetterboxStyle.Correct:
            return "🟩"
        }
      }).join("") + "\r\n";
      out = out.concat(str)
    }
    return out;
  }

}
