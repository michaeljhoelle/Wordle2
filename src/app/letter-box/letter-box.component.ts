import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LetterBox, LetterboxStyle} from "../model/LetterBox";

@Component({
  selector: 'app-letter-box',
  templateUrl: './letter-box.component.html',
  styleUrls: ['./letter-box.component.css']
})
export class LetterBoxComponent implements OnInit, OnChanges {

  constructor() {}

  @Input()
  letterbox: LetterBox = {
    letter: "",
    style: LetterboxStyle.Empty
  };

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let item in changes) {
    }
  }

}
