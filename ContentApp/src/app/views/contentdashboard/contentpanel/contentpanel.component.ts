import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-contentpanel',
  templateUrl: './contentpanel.component.html',
  styleUrls: ['./contentpanel.component.css']
})
export class ContentpanelComponent {
  formGroup!: FormGroup<any>;
  
  influencerOptions: SelectItem[] = [
    { label: 'Alex Hormozi', value: 'hormozi' },
    { label: 'Gary Vaynerchuk', value: 'garyv' },
    { label: 'Jordan Belfort', value: 'belfort' }
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

  ngOnInit() {
    this.formGroup = new FormGroup({
      influencer: new FormControl<string | null>(null),
    });
  }
}
