import { Component, OnInit } from '@angular/core';
import {SuiModule} from 'ng2-semantic-ui';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  model: any = {};
  error: any;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    let res = this.authService.login({"user": this.model.user, "pass": this.model.password});
    if(!res) {
      this.delay(200);
      this.loading = false;
      this.error = true;
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
