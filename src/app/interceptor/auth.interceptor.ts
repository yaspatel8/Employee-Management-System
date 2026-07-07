import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  const clonedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: error.error?.message|| 'Your session has expired. Please login again.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: 'OK'
        }).then(() => {
          router.navigate(['/login']);
        });
      }

      return throwError(() => error);
    })
  );
};
