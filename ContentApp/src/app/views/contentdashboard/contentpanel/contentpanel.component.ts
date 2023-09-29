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
export class ContentpanelComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() mediaMode: string = '';

  @ViewChild('pnl', {static: true}) paneler!: ElementRef<Panel>;
  
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
      }
    });

    this.socialAuthService.userAccountObservable$.subscribe((user) => {
      if (user) {
        this.avatarName = user.displayName ?? '';
        this.avatarUrl = user.photoURL ?? '';
      }
    });
    this.socialAuthService.getUserAccount();
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mediaMode'] && changes['mediaMode'].currentValue) {
    console.log("🚀 ~ file: contentpanel.component.ts:76 ~ ContentpanelComponent ~ ngOnChanges ~ changes['mediaMode'].currentValue:", changes['mediaMode'].currentValue)
    }
  }
}
