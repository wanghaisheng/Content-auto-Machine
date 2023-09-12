import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { Content } from 'src/app/model/content/content.model';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';

@Component({
  selector: 'app-contentpanel',
  templateUrl: './contentpanel.component.html',
  styleUrls: ['./contentpanel.component.css']
})
export class ContentpanelComponent implements OnInit {

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

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: HubDashboardService
  ) {

  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      influencer: [''],
      control: [''],
      enhance: [''],
    });
    this.dashboardService.contentLoadingObservable$.subscribe({
      next: (loading) => {
        this.contentLoading = loading;
      }
    });
    this.dashboardService.contentObservable$.subscribe((contentComplete: Content) => {
      this.content = contentComplete.content;
    });
  }
}
