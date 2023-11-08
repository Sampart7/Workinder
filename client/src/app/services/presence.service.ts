import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers = this.onlineUsersSource.asObservable();
  
  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "presence", { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error => console.log(error));

      this.hubConnection.on("UserIsOnline", email => this.onlineUsers.pipe(take(1)).subscribe({
        next: emails => this.onlineUsersSource.next([...emails, email])
      }))

      this.hubConnection.on("UserIsOffline", email => this.onlineUsers.pipe(take(1)).subscribe({
        next: emails => this.onlineUsersSource.next(emails.filter(e => e !== email))
      }))

      this.hubConnection.on("GetOnlineUsers", emails => this.onlineUsersSource.next(emails));

      this.hubConnection.on("NewMessageReceived", ({email, knownAs}) => {
          this.toastr.info(knownAs + " has sent a message").onTap.pipe(take(1)).subscribe({
            next: () => this.router.navigateByUrl("/members/" + email + "?tab=Messages")
          })
      })
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }

}
