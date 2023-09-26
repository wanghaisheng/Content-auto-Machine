import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { Content } from 'src/app/model/content/content.model';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {
  
  contents: Content[] = [];
  contentLoader$: Observable<boolean>;

  constructor(
    private hubDashboardService: HubDashboardService
  ) { 
    this.contentLoader$ = this.hubDashboardService.contentLoadingObservable$;
   }

  ngOnInit() {
    this.hubDashboardService.getContents().subscribe({
      next: (contents) => {
        this.contents = contents.reverse();
      }
    });
  }
}
