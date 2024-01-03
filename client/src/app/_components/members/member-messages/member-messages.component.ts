import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { MembersService } from 'src/app/services/member.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  currentUser: User;

  constructor(public messageService: MessageService, private accountService: AccountService) {
      this.accountService.currentUser.subscribe(user => {
        if (user) this.currentUser = user;
      })
     }

  sendMessage(){
    this.messageService.sendMessage(this.email, this.messageContent).then(() => {
      this.messageForm?.reset();
    })
  }
}