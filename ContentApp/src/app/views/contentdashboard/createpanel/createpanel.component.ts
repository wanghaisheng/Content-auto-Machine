import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-createpanel',
  templateUrl: './createpanel.component.html',
  styleUrls: ['./createpanel.component.css']
})
export class CreatepanelComponent implements OnInit {

  models: { name: string, code: string }[] = [
    { name: 'Quality', code: 'GPT-4' },
    { name: 'Speed', code: 'GPT-3.5turbo' }
  ];
  formGroup!: FormGroup;
  contentLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) {
    
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      url: ['', Validators.pattern(/https?:\/\/.*/)],
      model: [''],
    });
  }

  submitForContent() {
    // if (this.formGroup.valid) {
      this.dashboardService.createContent(
        this.formGroup.value.url, 
        this.formGroup.value.model
      )
    // } else {
    //   console.log('Form is invalid');
    // }
  }
}
