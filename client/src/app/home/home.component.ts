import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  register = false

  registerToggle() {
    this.register = !this.register
  }

  cancelRegisterToggle(event: boolean) {
    this.register = event
  }
}
