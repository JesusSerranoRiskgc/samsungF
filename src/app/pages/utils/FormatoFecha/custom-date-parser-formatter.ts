import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split(this.DELIMITER);
      return {
        day: parseInt(dateParts[0], 10),
        month: parseInt(dateParts[1], 10),
        year: parseInt(dateParts[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? `${this.pad(date.day)}${this.DELIMITER}${this.pad(date.month)}${this.DELIMITER}${date.year}` : '';
  }

  private pad(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}