import { Component } from '@angular/core';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { SocialAuthService } from 'src/app/service/socialauth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private authService: SocialAuthService) { }

  onZoomAuthentication() {
    
  }
}
