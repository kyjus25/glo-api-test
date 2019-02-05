import {Component} from '@angular/core';
import {Md5} from 'ts-md5';
import {ActivatedRoute, Router} from '@angular/router';
import {merge} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {User} from '../types/user';
import {MenuItem} from 'primeng/api';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public user: User;
  public boards;
  public emailMD5;
  public boardMenuItems: MenuItem[] = [];
  public activeBoard;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private http: HttpClient,
  ) {

    combineLatest([
      this.route.queryParams,
      this.http.get('http:/localhost:5000/getUser'),
      this.http.get('http:/localhost:5000/getBoards'),
    ]).subscribe(([query, user, boards]) => {
      console.log('query', query);
      console.log('user', user);
      console.log('boards', boards);

      this.user = <User>user;
      this.boards = boards;
      this.activeBoard = boards[0];
      this.emailMD5 = Md5.hashStr(this.user.email);

      this.boardMenuItems = [];
      this.boards.forEach(board => {
        const boardItem = {
          id: board.id,
          label: board.name,
          command: (event) => {
            this.showBoard(event.item.id);
          }
        };
        this.boardMenuItems.push(boardItem);
      });
    });
  }

  public showBoard(id) {
    this.activeBoard = this.boards.find(board => board.id === id);
  }
}


