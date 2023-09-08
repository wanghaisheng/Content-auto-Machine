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
    const params = {
      client_id: 'v6c4slYJRDGzpwoZY8h_Nw',
      redirect_uri: 'http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fv2%2Fconfig%2Fzoom',
    };
    window.location.href = `https://zoom.us/oauth/authorize?response_type=code&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`;
  }
}
