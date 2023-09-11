import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  templateUrl: './typewriter.component.html',
  styleUrls: ['./typewriter.component.css']
})
export class TypewriterComponent implements OnInit, OnChanges, OnDestroy {

  @Input() textToShow: string = '';
  currentText = '';
  interval: any;

  constructor() { }

  ngOnInit() {

  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  ngOnChanges() {
    this.currentText = '';
    if (this.textToShow) {
      this.interval = setInterval(() => {
        this.currentText += this.textToShow.charAt(this.currentText.length);
        if (this.currentText.length === this.textToShow.length) {
          clearInterval(this.interval);
          // setTimeout(()=> this.currentText='', 150 * this.getRandomInt(4));
        }
      }, 20);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
