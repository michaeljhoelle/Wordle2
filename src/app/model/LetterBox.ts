export interface LetterBox {
  letter: string;
  style: LetterboxStyle;
}

export enum LetterboxStyle {
  Wrong="Wrong",
  Close="Close",
  Correct="Correct",
  Empty="Empty"
}
