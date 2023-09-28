import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Observable, tap } from 'rxjs';
import { Content } from 'src/app/model/content/content.model';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { MessengerService } from 'src/app/service/messenger.service';

@Component({
  selector: 'app-contentpanel',
  templateUrl: './contentpanel.component.html',
  styleUrls: ['./contentpanel.component.css']
})
export class ContentpanelComponent implements OnInit, AfterViewInit {

  @ViewChild('pnl', {static: true}) paneler!: ElementRef<Panel>;
  
  loadingObservable$!: Observable<boolean>;

  formGroup!: FormGroup;
  contentLoading = false;
  content = '';
  
  influencerOptions: SelectItem[] = [
    { label: 'Alex Hormozi', value: 'hormozi' },
    { label: 'Gary Vaynerchuk', value: 'garyv' },
    { label: 'Jordan Belfort', value: 'belfort' },
    { label: 'Jonny West', value: 'west' }
  ];

  controlOptions: SelectItem[] = [
    { label: 'Persuasive headline', value: 'hormozi' },
    { label: 'End with call to action', value: 'garyv' },
    { label: 'Explain it like I\'m five ', value: 'belfort' },
    { label: 'Increase urgency', value: 'belfort' },
    { label: 'Increase scarcity', value: 'belfort' },
    { label: 'Detail the benefits', value: 'belfort' },
    { label: 'Make it more conversational', value: 'belfort' },
    { label: 'Make it more human', value: 'belfort' }
  ];
promptSubmit: any;

  constructor(
    private formBuilder: FormBuilder,
    private hubDashboardService: HubDashboardService,
    private messengerService: MessengerService
  ) { /** */ }

  ngAfterViewInit(): void {
  }

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
    })
  }
}
