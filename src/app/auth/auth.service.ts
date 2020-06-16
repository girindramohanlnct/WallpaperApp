import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private userName: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserName() {
    return this.userName;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(
    name: string,
    emailid: string,
    phone: string,
    password: string,
    profilePic: File
  ) {
    const postData = new FormData();
    postData.append("name", name);
    postData.append("emailid", emailid);
    postData.append("phone", phone);
    postData.append("password", password);
    postData.append("profilePic", profilePic);
    this.http.post("http://localhost:3000/api/user/signup", postData).subscribe(
      () => {
        this.router.navigate(["/login"]);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        userName: string;
      }>("http://localhost:3000/api/user/login", authData)
      .subscribe(
        (response) => {
          this.token = response.token;
          console.log("loged in");
          if (this.token) {
            const expioresInDuration = response.expiresIn;
            this.getAuthTimer(expioresInDuration);
            this.authStatusListener.next(true);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.userName = response.userName;
            console.log("userName ", response.userName);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expioresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(
              this.token,
              expirationDate,
              this.userId,
              response.userName
            );
            this.router.navigate(["/home"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.getAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userName = authInformation.userName;
      this.authStatusListener.next(true);
    }
  }

  getAuthTimer(duration: number) {
    console.log("Setting Timer" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.cleatAuthData();
    this.userId = null;
    this.router.navigate(["/login"]);
  }
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userName: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
  }

  private cleatAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    if (!token || !expirationDate) {
      return;
    }
    return {
      // tslint:disable-next-line: object-literal-shorthand
      userName: userName,
      token: token,
      expirationDate: new Date(expirationDate),
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId,
    };
  }
}
