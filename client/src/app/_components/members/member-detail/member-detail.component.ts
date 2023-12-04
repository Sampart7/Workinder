import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/models/member';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
import { PresenceService } from 'src/app/services/presence.service';
import { AccountService } from 'src/app/services/account.service';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  standalone: true,
  imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent],
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild("memberTabs", {static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  user? : User;
  
  constructor(private acountService: AccountService, private route: ActivatedRoute, 
    private messageService: MessageService, public presenceService: PresenceService) {
      this.acountService.currentUser.pipe(take(1)).subscribe({
        next: user => {
          if (user) this.user = user;
        }
      })
    }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data["member"]
    })

    this.route.queryParams.subscribe({
      next: params => params["tab"] && this.selectTab(params["tab"])
    })

    this.getImages()
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection()
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === "Messages" && this.user) {
      this.messageService.createHubConnection(this.user, this.member.email);
    } else {
      this.messageService.stopHubConnection()
    }
  }

  selectTab(heading: string) {
    if (this.member) {
      this.memberTabs.tabs.find(h => h.heading == heading).active = true;
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.email).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  getImages() {
    if(!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))
    }
  }
}
