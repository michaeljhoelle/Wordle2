import {Component, HostListener, OnInit} from '@angular/core';
import {WordClient} from "./client/WordClient";
import {WordRowComponent} from "./word-row/word-row.component";
import {WordRow} from "./model/WordRow";
import {LetterboxStyle} from "./model/LetterBox";
import {timer} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private wordClient: WordClient) {}
  showError: boolean = false;
  errorMsg: string = "";
  title = "Title";
  rows: WordRow[] = [];
  currentRow: number = 0;
  currentChar: number = 0;
  letterStyles: Map<string, string> = this.getDefaultLetterStyles();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.key);
    if (this.isAlpha(event.key)) {
      this.addLetter(event.key);
    } else if (event.key === "Enter") {
      this.submit();
    } else if (event.key === "Backspace") {
      this.removeLetter();
    }
  }

  submit() {

    if (this.currentChar < 5) {
      this.displayError("Not long enough!");
      return;
    }

    this.wordClient.verifyWord(this.rows[this.currentRow].letters.map(o => o.letter).join('').toLowerCase())
      .subscribe((data: number[]) => {
        let winner: boolean = true;
        if (data.length > 0) {
          let style: LetterboxStyle;
          for (let i = 0; i < 5; i++) {
            switch (data[i]) {
              case 0:
              default:
                style = LetterboxStyle.Wrong;
                this.letterStyles.set(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Wrong)
                winner = false;
                break;
              case 1:
                if (this.letterIsCorrectElsewhere(data, i)) {
                  style = LetterboxStyle.Wrong
                  this.letterStyles.set(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Wrong)
                } else {
                  style = LetterboxStyle.Close;
                  this.letterStyles.set(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Close)
                }
                winner = false;
                break;
              case 2:
                style = LetterboxStyle.Correct;
                this.letterStyles.set(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Correct)
            }
            this.rows[this.currentRow].letters[i].style = style;
          }
          if (winner) {
            this.displayError("LGTM!");
            timer(2000).subscribe(s => this.reset())
          } else {
            let newRow = new WordRowComponent();
            newRow.letters = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
            this.rows.push(newRow);
            this.currentRow++;
            this.currentChar = 0;
          }
        } else {
          this.displayError("Maybe try typing a real word?");
        }
      });
  }

  letterIsCorrectElsewhere(result: number[], index: number) {
    let attemptedLetter = this.rows[this.currentRow].letters[index].letter;
    for (let i = 0; i < 5 && i != index; i++) {
      if (this.rows[this.currentRow].letters[i].letter == attemptedLetter && result[i] == 2) {
        return true;
      }
    }
    return false;
  }

  displayError(msg: string) {
    this.errorMsg = msg;
    this.showError = true;
    timer(2000).subscribe(s => this.showError = false)
  }

  public addLetter(letter: string) {
    if (this.currentChar < 5) {
      this.rows[this.currentRow].letters[this.currentChar++].letter = letter.toUpperCase();
    }
  }

  public removeLetter() {
    if (this.currentChar > 0) {
      this.rows[this.currentRow].letters[--this.currentChar].letter = "";
    }
  }

  ngOnInit(): void {
    let newRow = new WordRowComponent();
    newRow.letters = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
    this.rows.push(newRow);
  }

  isAlpha(str: string) {
    return /^[a-zA-Z]$/.test(str);
  }

  getDefaultLetterStyles() {
    return new Map<string, string>([
      ["A", LetterboxStyle.Empty.toString()],
      ["B", LetterboxStyle.Empty.toString()],
      ["C", LetterboxStyle.Empty.toString()],
      ["D", LetterboxStyle.Empty.toString()],
      ["E", LetterboxStyle.Empty.toString()],
      ["F", LetterboxStyle.Empty.toString()],
      ["G", LetterboxStyle.Empty.toString()],
      ["H", LetterboxStyle.Empty.toString()],
      ["I", LetterboxStyle.Empty.toString()],
      ["J", LetterboxStyle.Empty.toString()],
      ["K", LetterboxStyle.Empty.toString()],
      ["L", LetterboxStyle.Empty.toString()],
      ["M", LetterboxStyle.Empty.toString()],
      ["N", LetterboxStyle.Empty.toString()],
      ["O", LetterboxStyle.Empty.toString()],
      ["P", LetterboxStyle.Empty.toString()],
      ["Q", LetterboxStyle.Empty.toString()],
      ["R", LetterboxStyle.Empty.toString()],
      ["S", LetterboxStyle.Empty.toString()],
      ["T", LetterboxStyle.Empty.toString()],
      ["U", LetterboxStyle.Empty.toString()],
      ["V", LetterboxStyle.Empty.toString()],
      ["W", LetterboxStyle.Empty.toString()],
      ["X", LetterboxStyle.Empty.toString()],
      ["Y", LetterboxStyle.Empty.toString()],
      ["Z", LetterboxStyle.Empty.toString()],
    ])
  }

  reset() {
    this.rows = [];
    let newRow = new WordRowComponent();
    newRow.letters = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
    this.rows.push(newRow);
    this.currentChar = 0;
    this.currentRow = 0;
    this.letterStyles = this.getDefaultLetterStyles();
  }
}
