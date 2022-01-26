import {Component, HostListener, OnInit} from '@angular/core';
import {WordClient} from "./client/WordClient";
import {WordRowComponent} from "./word-row/word-row.component";
import {WordRow} from "./model/WordRow";
import {LetterboxStyle} from "./model/LetterBox";
import {interval, Subscription, timer} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {WinnerBoxComponent} from "./winner-box/winner-box.component";
import {ScreenType} from "./model/ScreenType";

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
  bottomRowPx: number = 0;
  centerAreaPx: number = 0;
  screenType: ScreenType = ScreenType.desktop;

  ngOnInit(): void {
    if (window.screen.width < 800) {
      this.screenType = ScreenType.mobile;
      this.centerAreaPx = 30;
    }

    let time = localStorage.getItem('lastWinTime');
    let data = localStorage.getItem('data');
    let timeJson: Date;
    if (time != null && data != null) {
      timeJson = new Date(JSON.parse(time));
      if (timeJson < this.getLastResetTime()) {
        this.reset()
      } else {
        this.dDay = this.getNextResetTime();
        let previousWinData: WordRow[] = JSON.parse(data);
        this.rows = previousWinData;
        this.currentRow = previousWinData.length - 1;
        this.getTimeDifference();
        this.displayWinnerMessage();
      }
    } else {
      this.reset()
    }
    this.timeSubscription = interval(1)
      .subscribe(() => { this.getTimeDifference(); });
  }

  reset() {
    this.hideWinnerMessage();
    this.rows = [];
    let newRow = new WordRowComponent();
    newRow.letters = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
    this.rows.push(newRow);
    this.bottomRowPx = 0;
    this.currentChar = 0;
    this.currentRow = 0;
    this.letterStyles = this.getDefaultLetterStyles();

    this.dDay = this.getNextResetTime();
  }

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

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    if (timeDifference < 0) {
      this.reset();
    }
    this.millisecondsToDday = ('00' + (timeDifference % this.milliSecondsInASecond).toString()).slice(-3);
    this.secondsToDday = ('0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString()).slice(-2);
    this.minutesToDday = ('0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString()).slice(-2);
  }

  displayWinnerMessage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      tries: this.currentRow + 1,
      result: this.rows
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
      this.submitWord();
    } else if (event.key === "Backspace") {
      this.removeLetter();
    }
  }

  submitWord() {

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

            localStorage.setItem('data', JSON.stringify(this.rows));
            localStorage.setItem('lastWinTime', JSON.stringify(new Date()));

            this.displayWinnerMessage();
          } else {
            let newRow = new WordRowComponent();
            newRow.letters = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
            if (window.screen.width > 800) {
              this.bottomRowPx += 30;
            }
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
    for (let i = 0; i < 5; i++) {
      if (this.rows[this.currentRow].letters[i].letter == attemptedLetter && result[i] == 2 && i != index) {
        return true;
      }
    }
    return false;
  }

  displayError(msg: string) {
    this.errorMsg = msg;
    this.showError = true;
    if (window.screen.width > 800) {
      this.bottomRowPx -= 10;
    } else {
      this.bottomRowPx -= 20;
    }
    timer(2000).subscribe(() => this.hideError())
  }

  hideError() {
    if (window.screen.width > 800) {
      this.bottomRowPx += 10;
    } else {
      this.bottomRowPx += 20;
    }
    this.showError = false;
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

  getLastResetTime() {
    let now = new Date();
    let minute;
    if (now.getMinutes() > 29) {
      minute = 30;
    } else {
      minute = 0;
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minute, 0, 0)
  }

  getNextResetTime() {
    let now = new Date();
    let minute;
    let hour;
    if (now.getMinutes() > 29) {
      hour = now.getHours() + 1;
      minute = 0;
    } else {
      hour = now.getHours();
      minute = 30;
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0)
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
}
