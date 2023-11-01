import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent {
  @ViewChild("messageForm") messageForm?: NgForm;
  @Input() email?: string;
  messageContent = "";

  constructor(public messageService: MessageService) { }

  sendMessage(){
    this.messageService.sendMessage(this.email, this.messageContent).then(() => {
      this.messageForm?.reset();
    })
  }

}
