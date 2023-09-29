import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Observable, tap } from 'rxjs';
import { Content } from 'src/app/model/content/content.model';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { MessengerService } from 'src/app/service/messenger.service';
import { SocialAuthService } from 'src/app/service/user/socialauth.service';

@Component({
  selector: 'app-contentpanel',
  templateUrl: './contentpanel.component.html',
  styleUrls: ['./contentpanel.component.css']
})
export class ContentpanelComponent implements OnInit {

  @Input() mediaMode: string = '';
  
  loadingObservable$!: Observable<boolean>;

  formGroup!: FormGroup;
  contentLoading = false;
  content = 'To get started, just go to the left and drop in a youtube link then click submit.';
  promptSubmit = '';
  avatarUrl = '';
  avatarName = '';

  constructor(
    private formBuilder: FormBuilder,
    private hubDashboardService: HubDashboardService,
    private messengerService: MessengerService,
    private socialAuthService: SocialAuthService
  ) { /** */ }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      influencer: [''],
      control: [''],
      enhance: [''],
    });
    this.hubDashboardService.contentLoadingObservable$.subscribe({
      next: (loading) => {
        this.contentLoading = loading;
      }
    });
    this.hubDashboardService.contentObservable$.subscribe((contentComplete: Content) => {
      console.log("🚀 ~ file: contentpanel.component.ts:64 ~ ContentpanelComponent ~ this.hubDashboardService.contentObservable$.subscribe ~ contentComplete:", contentComplete)
      this.content = contentComplete.content.replace('\n', '\n\n');
    });
    this.hubDashboardService.errorObservable$.subscribe({
      next: (error) => {
        this.messengerService.setErrorMessage(error);
        this.content = 'To get started, just go to the left and drop in a youtube link then click submit.';
      }
    });
    this.hubDashboardService.videoDetailsObservable$.subscribe({
      next: (videoDetails) => {
        let waitTime = '';
        try {
          waitTime = (videoDetails.lengthSeconds / 60 / 2).toFixed(2);
        } catch (error) {
          console.log("🚀 ~ file: contentpanel.component.ts:63 ~ ContentpanelComponent ~ ngOnInit ~ error:", error)
        }
        this.content = `Sit tight while we download, transcribe, and generate content from your video.\n\nEstimated time to completion: ${waitTime} minutes.`;
      }
    });
    this.socialAuthService.userAccountObservable$.subscribe((user) => {
      if (user) {
        this.avatarName = user.displayName ?? '';
        this.avatarUrl = user.photoURL ?? '';
      }
    });
    // Kick off
    this.socialAuthService.getUserAccount();
  }
}
