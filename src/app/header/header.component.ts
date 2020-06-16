import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userName: string;
  private authListnerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    // this.userName = this.authService.getUserName();
    this.authListnerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((userIsAuthenticated) => {
        this.userIsAuthenticated = userIsAuthenticated;
        this.userName = localStorage.getItem("userName");
      });
    console.log("header ", this.userName, this.userIsAuthenticated);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }
}
