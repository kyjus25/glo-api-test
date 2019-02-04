import {Component} from '@angular/core';
import {Md5} from 'ts-md5';
import {ActivatedRoute, Router} from '@angular/router';
import {merge} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {User} from '../types/user';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public user: User;
  public boards;
  public emailMD5;

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {

    combineLatest([
      this.http.get('http:/localhost:5000/getUser'),
      this.http.get('http:/localhost:5000/getBoards'),
    ]).subscribe(([user, boards]) => {
      console.log('user', user);
      console.log('boards', boards);

      this.user = <User>user;
      this.boards = boards;
      this.emailMD5 = Md5.hashStr(this.user.email);
    });
  }
}


