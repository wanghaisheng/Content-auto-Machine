import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { MenuItem } from 'primeng/api';
import { Observable, Subject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  breadcrumbData: Subject<MenuItem[]> = new Subject<MenuItem[]>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fireAuthRepo: FireAuthRepository
  ) {
    /** */
  }

  ngOnInit() {
    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the current route snapshot
        let route = this.activatedRoute.root;
        console.log("🚀 ~ file: navigation.service.ts:29 ~ NavigationService ~ .subscribe ~ route:", route)
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Build breadcrumb data based on route hierarchy
        const breadcrumbData = this.buildBreadcrumb(route);

        // Update breadcrumb data in the service
        this.setBreadcrumbData(breadcrumbData);
      });
  }

  navigateToRoot() {
    this.router.navigate(['']);
  }

  navigateToLogin() {
    this.fireAuthRepo.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  navigateToDashboard() {
    this.router.navigate(['dashboard']);
  }

  // navigateToExtractDetails(id: string = '') {
  //   if (id === '') {
  //     this.router.navigate(['maker/copycat/details']);
  //   } else {
  //     // localStorage.setItem('detailsId', id); for page refresh mid-edit
  //     this.router.navigate(['maker/copycat/details', id]);
  //   }
  // }

  getBreadcrumbData(): Observable<MenuItem[]> {
    return this.breadcrumbData.asObservable();
  }

  setBreadcrumbData(data: { label: string; url: string }[]) {
    this.breadcrumbData.next(data);
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: any[] = []
  ): any[] {
    const label = route.routeConfig ? route.routeConfig.data!['breadcrumb'] : '';
    const path = route.routeConfig ? route.routeConfig.path : '';

    // Don't include empty labels
    const nextUrl = `${url}${path}/`;
    const breadcrumb = {
      label,
      url: nextUrl,
    };

    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadcrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
