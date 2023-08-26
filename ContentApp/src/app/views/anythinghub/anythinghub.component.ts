import { Component } from '@angular/core';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-anythinghub',
  templateUrl: './anythinghub.component.html',
  styleUrls: ['./anythinghub.component.css']
})
export class AnythinghubComponent {

  constructor(
    private navigationService: NavigationService,
  ) { }
  
  videotofb() {
    this.navigationService.navigateToDashboard();
  }
  youtubetofb() {
    this.navigationService.navigateToDashboard();
  }
  onCreateClick() {
    this.navigationService.navigateToDashboard();
  }
}
