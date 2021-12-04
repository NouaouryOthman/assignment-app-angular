import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService) { }

  email!:string;
  password!:string;


  onSubmit(){
    this.authService.logIn(this.email, this.password);
  }

  ngOnInit(): void {
  }

}
