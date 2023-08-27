import { AfterContentInit, Component } from '@angular/core';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-anythinghub',
  templateUrl: './anythinghub.component.html',
  styleUrls: ['./anythinghub.component.css']
})
export class AnythinghubComponent implements AfterContentInit {
  blockMode: boolean = false;

  constructor(
    private navigationService: NavigationService,
  ) { }

  ngAfterContentInit(): void {
    this.blockMode = true;
  }
  
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
