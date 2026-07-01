import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LodderService } from '../Services/lodder.service';


export const lodderInterceptor: HttpInterceptorFn = (req, next) => {

  const loader = inject(LodderService);

  loader.show();

  return next(req).pipe(
    finalize(() => {
      loader.hide();
    })
  );
};
