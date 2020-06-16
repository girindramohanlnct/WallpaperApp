import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { stringify } from "querystring";
import { Image } from "../header/image.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  itemId;
  item: Image[];
  url;
  item1: Image[];
  item2: Image[];
  item3: Image[];
  favItem = [];
  favSet: Set<Image>;
  isFav = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const img = new Image();
    img.crossOrigin = "anonymus";
    let option = {
      header: "https://picsum.photos/",
    };
    this.http
      .get<[Image]>("https://picsum.photos/v2/list?&limit=100")
      .subscribe((items) => {
        this.item = [...items];
        this.http
          .get<[]>("http://localhost:3000/api/user/getFav")
          .subscribe((items1) => {
            if (items1.length > 0) {
              console.log(items1);
              this.favItem = [...items1];
              this.favSet = new Set(this.favItem);
            }
          });
      });
  }

  imageHover(item, id, event) {
    this.itemId = id;
    if (this.favItem.length > 0) {
      for (let i = 0; i < this.favItem.length; i++) {
        let it = this.favItem[i];
        if (it.id == item.id) {
          this.isFav = true;
        }
      }
      //   if (this.favSet.has(item)) {
      //     this.isFav = true;
      //   }
    }
  }
  imageUnHover() {
    this.itemId = "";
  }

  addFavourite(item) {
    console.log("before ", item);
    if (this.favItem.length > 0) {
      for (let i = 0; i < this.favItem.length; i++) {
        let it = this.favItem[i];
        if (it.id == item.id) {
          return;
        }
      }
    }
    console.log(item);
    const imageId = item.id;
    const download_url = item.download_url;
    const height = item.height;
    const width = item.width;
    const author = item.author;
    const url = item.url;
    this.http
      .post("http://localhost:3000/api/user/addFav", {
        imageId,
        download_url,
        height,
        width,
        author,
        url,
      })
      .subscribe((result) => {
        console.log("fav add");
      });
  }
}
