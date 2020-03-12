import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  public store(name: string, score: number) {
    console.log('score in local storagge....', name, score);
    localStorage.setItem('highScore', JSON.stringify({ 'best_score': {'name': name,'score':score} }));
  }

  public retrieve() {
    let storage = this.parse();
    if (!storage) {
      this.store('player1', 0);
      storage = this.parse();
    }

    return storage.best_score;
  }

  private parse() {
    return JSON.parse(localStorage.getItem('highScore'));
  }
}
