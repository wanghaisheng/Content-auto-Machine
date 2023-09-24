import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  
  filePath: string = '../../../assets/docs/terms-and-conditions-v1.pdf';

  constructor(
    private route: ActivatedRoute
   ) { /** */ }

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const segment = segments[segments.length - 1].path;
        if (segment === 'terms') {
          this.filePath = '../../../assets/docs/terms-and-conditions-v1.pdf';
        } else if (segment === 'privacy') {
          this.filePath = '../../../assets/docs/privacy-policy-v1.pdf';
        } else {
          throw new Error('Invalid route for terms and conditions');
        }
      }
    })
  
  }
}
