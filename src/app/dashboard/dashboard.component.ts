import {Component} from '@angular/core';
import {Md5} from 'ts-md5';
import {ActivatedRoute, Router} from '@angular/router';
import {merge} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {User} from '../types/user';
import {MenuItem} from 'primeng/api';
import {Subscription} from 'rxjs/Subscription';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private data: Subscription;
  public user: User;
  public boards;
  public cards;
  public emailMD5;
  public boardMenuItems: MenuItem[] = [];
  public activeBoard;
  public filter = 'none';
  public addCardEnabled = [];
  public addColumnEnabled = false;
  public columnMenuEnabled = [];
  public addCardText = '';
  public addColumnText = '';
  public filterList = [
    {label: 'None', value: 'none'},
    {label: 'My Tasks', value: 'my_tasks'}
  ];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private http: HttpClient,
  ) {

    this.data = combineLatest([
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
      this.getCards();
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

  public getCards() {
    this.cards = [];
    this.boards.forEach(board => {
      this.cards[board.id] = [];
    });
    this.boards.forEach(board => {
      this.http.get('http:/localhost:5000/getCards?boardId=' + board.id).subscribe(cards => {
        Array.prototype.push.apply(this.cards[board.id], cards);
      });
    });
    this.showBoard(this.boards[0].id);
    console.log('cards', this.cards);
  }

  public setAddCard(columnId, method) {
    for (const k in this.addCardEnabled) {
      if (this.addCardEnabled.hasOwnProperty(k)) {
        this.addCardEnabled[k] = false;
      }
    }
    this.addCardText = '';
    if (method) {
      this.addCardEnabled[columnId] = true;
    }
  }

  public setAddColumn(method) {
    this.addColumnEnabled = false;
    this.addColumnText = '';
    if (method) {
      this.addColumnEnabled = true;
    }
  }

  public addCard(columnId) {
    if (this.addCardEnabled[columnId] === undefined) {
      return false;
    } else {
      return !!this.addCardEnabled[columnId];
    }
  }

  public setColumnMenu(columnId, method) {
    for (const k in this.columnMenuEnabled) {
      if (this.columnMenuEnabled.hasOwnProperty(k)) {
        this.columnMenuEnabled[k] = false;
      }
    }
    if (method) {
      this.columnMenuEnabled[columnId] = true;
    }
  }

  public columnMenu(columnId) {
    if (columnId !== 'any') {
      if (this.columnMenuEnabled[columnId] === undefined) {
        return false;
      } else {
        return !!this.columnMenuEnabled[columnId];
      }
    } else {
      let foundEnabled = false;
      for (const k in this.columnMenuEnabled) {
        if (this.columnMenuEnabled.hasOwnProperty(k)) {
          if (this.columnMenuEnabled[k]) {
            foundEnabled = true;
          }
        }
      }
      return foundEnabled;
    }
  }

  public addColumn() {
    return this.addColumnEnabled;
  }

  public addCardHandler(columnId) {
    this.http.post('http:/localhost:5000/createCard?boardId=' + this.activeBoard.id,
      {name: this.addCardText, column_id: columnId}).subscribe(newCard => {
      this.cards[this.activeBoard.id].push(newCard);
      this.setAddCard(null, false);
    });
  }

  public addColumnHandler() {
    this.http.post('http:/localhost:5000/createColumn?boardId=' + this.activeBoard.id,
      {name: this.addColumnText}).subscribe(newColumn => {
      this.activeBoard.columns.push(newColumn);
      this.setAddColumn(false);
    });
  }

  public deleteColumnHandler(columnId) {
    this.http.get('http:/localhost:5000/deleteColumn?boardId='
      + this.activeBoard.id + '&columnId=' + columnId).subscribe(deleteColumn => {
        console.log(deleteColumn);
      this.setColumnMenu(null, false);
    });
  }

  public showBoard(id) {
    this.activeBoard = this.boards.find(board => board.id === id);
  }

  public getCardsByColumn(columnId): any {
    if (this.cards) {
      return this.cards[this.activeBoard.id].filter(card => card.column_id === columnId);
    } else {
      return [];
    }
  }

  public getCardsByBoard(boardId, onlyMe): any {
    if (this.cards) {
      if (onlyMe) {
        const cardsOnlyMe = [];
        this.cards[boardId].forEach(card => {
          card.assignees.forEach(assignee => {
            if (assignee.id === this.user.id) {
              cardsOnlyMe.push(card);
            }
          });
        });
        return cardsOnlyMe;
      } else {
        return this.cards[boardId];
      }
    } else {
      return [];
    }
  }
}


