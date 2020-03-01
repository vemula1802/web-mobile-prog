import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    '.background {background:#000000; color: darkred}',
    'li a { color: Blue}',
    'ul.nav a:hover { color: #fffrcc  }'
  ]
})
export class HeaderComponent {
  constructor() {}

}
