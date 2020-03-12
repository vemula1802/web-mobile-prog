import { Component } from '@angular/core';
import { LocalStorageService } from './app.storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AppComponent {
  title = 'Lab1';
  playerName: string = '';
  private interval: number;
  private tempDirection: number;
  private default_mode = 'classic';
  private isGameOver = false;
  playArea = 28;
  arrows = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };

  colors = {
    GAME_OVER: 'red',
    FRUIT: 'green',
    HEAD: 'red',
    BODY: 'blue',
    BOARD: 'cyan'
  };

  //public all_modes = GAME_MODES;
  public getKeys = Object.keys;
  public board = [];
  public obstacles = [];
  public score = 0;
  public showMenuChecker = false;
  public gameStarted = false;
  public newBestScore = false;
  public best_score = this.localStorageService.retrieve();

  private snake = {
    direction: this.arrows.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  private fruit = {
    x: -1,
    y: -1
  };

  constructor(private localStorageService: LocalStorageService) {
    this.setBoard();
  }

  handleKeyboardEvents(e: KeyboardEvent) {
    if (e.keyCode === this.arrows.LEFT && this.snake.direction !== this.arrows.RIGHT) {
      this.tempDirection = this.arrows.LEFT;
    } else if (e.keyCode === this.arrows.UP && this.snake.direction !== this.arrows.DOWN) {
      this.tempDirection = this.arrows.UP;
    } else if (e.keyCode === this.arrows.RIGHT && this.snake.direction !== this.arrows.LEFT) {
      this.tempDirection = this.arrows.RIGHT;
    } else if (e.keyCode === this.arrows.DOWN && this.snake.direction !== this.arrows.UP) {
      this.tempDirection = this.arrows.DOWN;
    }
  }

  setColors(col: number, row: number): string {
    if (this.isGameOver) {
      return this.colors.GAME_OVER;
    } else if (this.fruit.x === row && this.fruit.y === col) {
      return this.colors.FRUIT;
    } else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
      return this.colors.HEAD;
    } else if (this.board[col][row] === true) {
      return this.colors.BODY;
    }

    return this.colors.BOARD;
  };

  updatePositions(): void {
    let newHead = this.repositionHead();
    let me = this;

    if (this.default_mode === 'classic' && this.boardCollision(newHead)) {
      return this.gameOver();
    }

    if (this.selfCollision(newHead)) {
      return this.gameOver();
    } else if (this.fruitCollision(newHead)) {
      this.eatFruit();
    }

    let oldTail = this.snake.parts.pop();
    this.board[oldTail.y][oldTail.x] = false;

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;

    this.snake.direction = this.tempDirection;

    setTimeout(() => {
      me.updatePositions();
    }, this.interval);
  }

  repositionHead(): any {
    let newHead = Object.assign({}, this.snake.parts[0]);

    if (this.tempDirection === this.arrows.LEFT) {
      newHead.x -= 1;
    } else if (this.tempDirection === this.arrows.RIGHT) {
      newHead.x += 1;
    } else if (this.tempDirection === this.arrows.UP) {
      newHead.y -= 1;
    } else if (this.tempDirection === this.arrows.DOWN) {
      newHead.y += 1;
    }

    return newHead;
  }

  checkObstacles(x, y): boolean {
    let res = false;

    this.obstacles.forEach((val) => {
      if (val.x === x && val.y === y) {
        res = true;
      }
    });

    return res;
  }

  boardCollision(part: any): boolean {
    return part.x === this.playArea || part.x === -1 || part.y === this.playArea || part.y === -1;
  }

  selfCollision(part: any): boolean {
    return this.board[part.y][part.x] === true;
  }

  fruitCollision(part: any): boolean {
    return part.x === this.fruit.x && part.y === this.fruit.y;
  }

  resetFruit(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || this.checkObstacles(x, y)) {
      return this.resetFruit();
    }

    this.fruit = {
      x: x,
      y: y
    };
  }

  eatFruit(): void {
    this.score++;

    let tail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);

    this.snake.parts.push(tail);
    this.resetFruit();

    if (this.score % 5 === 0) {
      this.interval -= 15;
    }
  }

  gameOver(): void {
    alert('Game Over...Score : '+ this.score);
    this.isGameOver = true;
    this.gameStarted = false;
    let me = this;
    console.log('Game over........', this.playerName,this.score, this.best_score);
    if (this.playerName == '') {
      this.playerName = 'Unknown';
    }
    if (this.score > this.best_score.score) {
      console.log('inside......', this.playerName,this.score);
      this.localStorageService.store(this.playerName, this.score);
      this.best_score.score = this.score;
      this.best_score.name = this.playerName;
      this.newBestScore = true;
    }

    setTimeout(() => {
      me.isGameOver = false;
    }, 500);

    this.setBoard();
  }

  randomNumber(): any {
    return Math.floor(Math.random() * this.playArea);
  }

  setBoard(): void {
    this.board = [];

    for (let i = 0; i < this.playArea; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.playArea; j++) {
        this.board[i][j] = false;
      }
    }
  }

  newGame(): void {
    console.log('Mode......',mode);
    var mode = 'classic';
    this.default_mode = mode ;
    this.showMenuChecker = false;
    this.newBestScore = false;
    this.gameStarted = true;
    this.score = 0;
    this.tempDirection = this.arrows.LEFT;
    this.isGameOver = false;
    this.interval = 150;
    this.snake = {
      direction: this.arrows.LEFT,
      parts: []
    };

    for (let i = 0; i < 3; i++) {
      this.snake.parts.push({ x: this.randomNumber() + 2 + i, y: this.randomNumber() });
    }

    this.resetFruit();
    this.updatePositions();
  }
}
