import {Component, HostListener, OnInit} from '@angular/core';
import {WordClient} from "./client/WordClient";
import {WordRowComponent} from "./word-row/word-row.component";
import {WordRow} from "./model/WordRow";
import {LetterboxStyle} from "./model/LetterBox";
import {interval, Subscription, timer} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {WinnerBoxComponent} from "./winner-box/winner-box.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private wordClient: WordClient, private dialog: MatDialog) {}
  showError: boolean = false;
  errorMsg: string = "";
  title = "Title";
  rows: WordRow[] = [];
  currentRow: number = 0;
  currentChar: number = 0;
  letterStyles: Map<string, string> = this.getDefaultLetterStyles();

  timeSubscription: Subscription = new Subscription();

  public dateNow = new Date();
  public dDay = new Date();
  milliSecondsInASecond = 1000;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference: number = 0;
  public millisecondsToDday: string = "";
  public secondsToDday: string = "";
  public minutesToDday: string = "";

  private getTimeDifference () {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits (timeDifference: number) {
    this.millisecondsToDday = ('00' + (timeDifference % this.milliSecondsInASecond).toString()).slice(-3);
    this.secondsToDday = ('0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString()).slice(-2);
    this.minutesToDday = ('0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString()).slice(-2);
  }

  displayWinnerMessage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      tries: this.currentRow + 1
    };

    this.dialog.open(WinnerBoxComponent, dialogConfig);
  }

  hideWinnerMessage() {
    this.dialog.closeAll();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
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
                this.setLetterStyle(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Wrong)
                winner = false;
                break;
              case 1:
                if (this.letterIsCorrectElsewhere(data, i)) {
                  style = LetterboxStyle.Wrong
                  this.setLetterStyle(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Wrong)
                } else {
                  style = LetterboxStyle.Close;
                  this.setLetterStyle(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Close);
                }
                winner = false;
                break;
              case 2:
                style = LetterboxStyle.Correct;
                this.setLetterStyle(this.rows[this.currentRow].letters[i].letter, LetterboxStyle.Correct)
            }
            this.rows[this.currentRow].letters[i].style = style;
          }
          if (winner) {
            this.displayWinnerMessage();
            timer(this.timeDifference).subscribe(s => this.reset())
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

  setLetterStyle(letter: string, style: LetterboxStyle) {
    if (this.letterStyles.get(letter) != LetterboxStyle.Correct) {
      this.letterStyles.set(letter, style)
    }
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
    this.reset()
    this.timeSubscription = interval(1)
      .subscribe(x => { this.getTimeDifference(); });
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
    this.hideWinnerMessage();
    this.rows = [];
    let newRow = new WordRowComponent();
    newRow.letters = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
    this.rows.push(newRow);
    this.currentChar = 0;
    this.currentRow = 0;
    this.letterStyles = this.getDefaultLetterStyles();

    this.dateNow = new Date();
    this.dDay = new Date(this.dateNow.getFullYear(), this.dateNow.getMonth(), this.dateNow.getDate())
    if (this.dateNow.getMinutes() > 30) {
      this.dDay.setHours(this.dateNow.getHours() + 1)
    } else {
      this.dDay.setHours(this.dateNow.getHours())
      this.dDay.setMinutes(30);
    }
  }
}
