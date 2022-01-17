import {Component, Input, OnInit} from '@angular/core';
import {LetterBox, LetterboxStyle} from "../model/LetterBox";

@Component({
  selector: 'app-word-row',
  templateUrl: './word-row.component.html',
  styleUrls: ['./word-row.component.css']
})
export class WordRowComponent implements OnInit {

  constructor() { }

  @Input()
  letters: Array<LetterBox> = ["", "", "", "", ""].map(s => ({letter: s, style: LetterboxStyle.Empty}))
  currentPos: number = 0;

  ngOnInit(): void {
  }

  public addLetter(letter: string) {
    if (this.currentPos < 5) {
      this.letters[this.currentPos++].letter = letter;
    }
  }

  public removeLetter() {
    if (this.currentPos > 0) {
      this.letters[--this.currentPos].letter = "";
    }
  }

}
