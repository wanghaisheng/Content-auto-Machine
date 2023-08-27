import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-createpanel',
  templateUrl: './createpanel.component.html',
  styleUrls: ['./createpanel.component.css']
})
export class CreatepanelComponent implements OnInit {
  formGroup!: FormGroup;
  models: { name: string, code: string }[] = [
    { name: 'Quality', code: 'GPT-4' },
    { name: 'Speed', code: 'GPT-3.5turbo' }
  ];

  constructor() {
    
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      title: new FormControl<string | null>(null),
      url: new FormControl<string | null>(null),
      language: new FormControl<string | null>(null),
      ai_model: new FormControl<string | null>(null),
    });
  }
}
