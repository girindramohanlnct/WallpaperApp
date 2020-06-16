import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { mimeType } from "./mime-type.validator";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  imagePreview;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      emailid: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
      phone: new FormControl(null, {
        validators: [Validators.required],
      }),
      profilePic: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ profilePic: file });
    this.form.get("profilePic").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    console.log(
      this.form.value.name,
      this.form.value.emailid,
      this.form.value.phone,
      this.form.value.password,
      this.form.value.profilePic
    );
    if (this.form.invalid) {
      console.log("error");
      return;
    } else {
      this.authService.createUser(
        this.form.value.name,
        this.form.value.emailid,
        this.form.value.phone,
        this.form.value.password,
        this.form.value.profilePic
      );
    }
  }
}
