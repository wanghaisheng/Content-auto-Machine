import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ContentComplete } from 'src/app/model/contentresponse.model';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-contentpanel',
  templateUrl: './contentpanel.component.html',
  styleUrls: ['./contentpanel.component.css']
})
export class ContentpanelComponent implements OnInit {

  formGroup!: FormGroup;

  displayContentPanel = false;
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
isContentLoading: any;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) {

  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      influencer: ['']
    });

    this.dashboardService.contentObservable$.subscribe((contentComplete: ContentComplete) => {
      this.displayContentPanel = contentComplete != undefined;
      this.content = contentComplete.content;
    });
  }
}
