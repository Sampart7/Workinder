import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { getPaginatedResult } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread = this.messageThreadSource.asObservable();
  
  constructor(private http: HttpClient) {}

  createHubConnection(user: User, otherEmail: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "message?user=" + otherEmail, {accessTokenFactory: () => user.token})
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("ReceiveMessageThread", messages => this.messageThreadSource.next(messages))

    this.hubConnection.on("UpdatedGroup", (group: Group) => {
      if (group.connections.some(x => x.email == otherEmail)) {
        this.messageThread.pipe(take(1)).subscribe(messages => {
            messages.forEach(message => {
              if (!message.timeRead) message.timeRead = new Date(Date.now())
            })
            this.messageThreadSource.next([...messages]);
          })
      }
    })

    this.hubConnection.on("NewMessage", message => {
      this.messageThread.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message])
      })
    })
  }

  stopHubConnection() {
    if (this.hubConnection) this.hubConnection.stop();
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('Container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(email: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + email);
  }

  async sendMessage(email: string, content: string){
    return this.hubConnection?.invoke("SendMessage", {RecipientEmail: email, content})
      .catch(error => console.log(error));
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
  
}
