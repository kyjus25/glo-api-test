import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {AuthResponse} from '../types/auth-response';


@Component({
  selector: 'app-landing',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private status;
  private interval;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
  ) {


  }

  public checkCreds() {
    this.http.get<AuthResponse>('http:/localhost:5000/authenticate').subscribe(res => {});
    this.listenAuth();
  }

  private listenAuth() {
    clearInterval(this.interval);
    const this1 = this;
    // do an initial get of the status
    this1.http.get<AuthResponse>('http:/localhost:5000/getToken').subscribe(res => {
      this.status = res;
    });
    this.interval = setInterval(function() {
      this1.http.get<AuthResponse>('http:/localhost:5000/getToken').subscribe(res => {
        this1.status = res.token;
        if (this1.status !== 'undefined') {
          // console.log(this1.status);
          this1.router.navigate(['/dashboard']);
          clearInterval(this1.interval);
        }
      });
    }, 10);
  }
}
