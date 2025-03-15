import { HttpInterceptorFn } from '@angular/common/http';

export const tokenHttpIntercepotr: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log(token);
  req = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + token,
    },
  });
  return next(req);
};
