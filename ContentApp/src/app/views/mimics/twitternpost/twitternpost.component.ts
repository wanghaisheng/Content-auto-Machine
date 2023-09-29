import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-twitternpost',
  templateUrl: './twitternpost.component.html',
  styleUrls: ['./twitternpost.component.css']
})
export class TwitternpostComponent {

  @Input() bodyContent: string = '';
  @Input() avatarUrl: string = '';
  @Input() avatarName: string = '';
  subtitle = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

}
