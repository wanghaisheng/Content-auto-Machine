import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-linkedinpost',
  templateUrl: './linkedinpost.component.html',
  styleUrls: ['./linkedinpost.component.css']
})
export class LinkedinpostComponent {

  @Input() bodyContent: string = '';
  @Input() avatarUrl: string = '';
  @Input() avatarName: string = '';
  topTitle = 'CEO, Founder, Philanthropist, Investor, Author, Speaker';
  bottomTitle = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

}
