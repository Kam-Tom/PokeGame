import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { UserService } from "./user.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private userService:UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
    
    if (req.url.endsWith('/user/login') || req.url.endsWith('/user/register')) {
        return next.handle(req);
    }
    const modifiedRequest = req.clone({
        headers: req.headers.append('Authorization',this.userService.Token)
    });

    return next.handle(modifiedRequest);
    }
  }
  