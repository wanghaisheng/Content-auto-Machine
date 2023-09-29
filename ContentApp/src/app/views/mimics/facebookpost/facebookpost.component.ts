import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-facebookpost',
  templateUrl: './facebookpost.component.html',
  styleUrls: ['./facebookpost.component.css']
})
export class FacebookpostComponent {

  @Input() bodyContent: string = '';
  @Input() avatarUrl: string = '';
  @Input() avatarName: string = '';
  subtitle = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
