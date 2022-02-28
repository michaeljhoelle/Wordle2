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
        this.rank = "1 try (╬ಠ益ಠ)";
        break;
      case 2:
        this.rank = "2 tries ( ͠° ͟ʖ ͡°)";
        break;
      case 3:
        this.rank = "3 tries (☞ ͡° ͜ʖ ͡°)☞";
        break;
      case 4:
        this.rank = "4 tries ( ͡° ͜ʖ ͡°)";
        break;
      case 5:
        this.rank = "5 tries ( ಠ ͜ʖಠ)";
        break;
      case 6:
        this.rank = "6 tries (ó﹏ò｡)";
        break;
      case 69:
        this.rank = "nice ( ͡~ ͜ʖ ͡°)"
        break;
      default:
        this.rank = "(╯ ͠° ͟ʖ ͡°)╯┻━┻"
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
    let triesText = this.result.length > 6 ? tries + " tries (╯ ͠° ͟ʖ ͡°)╯┻━┻" : this.rank;
    let out = "Wordle 2\r\n" + triesText + "\r\n"
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
