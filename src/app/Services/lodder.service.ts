import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LodderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;
  private timer: any;

  show() {
    this.requestCount++;

    if (this.requestCount === 1) {
      this.timer = setTimeout(() => {
        this.loadingSubject.next(true);
      }, 100);

    }

  }

  hide() {
    this.requestCount--;

    if (this.requestCount <= 0) {
      this.requestCount = 0;

      clearTimeout(this.timer);
      this.loadingSubject.next(false);
    }
  }
}

