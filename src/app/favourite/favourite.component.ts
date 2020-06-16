import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Image } from "../header/image.model";
import { Favourite } from "./fav.model";

@Component({
  selector: "app-fav",
  templateUrl: "./favourite.component.html",
  styleUrls: ["./favourite.component.css"],
})
export class FavouriteComponent implements OnInit {
  favItems: Favourite[];
  private authListnerSubs: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<{ favs: [] }>("http://localhost:3000/api/user/getFav")
      .subscribe((items) => {
        // console.log(items.favs);
        this.favItems = [...items.favs];
        console.log(this.favItems);
      });
  }
}
