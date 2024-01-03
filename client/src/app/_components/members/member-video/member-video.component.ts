import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import Peer from 'peerjs';
import { Subscription, take } from 'rxjs';
import { User } from 'src/app/models/user';
import { VideoElement } from 'src/app/models/video-ref';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { MembersService } from 'src/app/services/member.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-video',
  standalone: true,
  imports: [CommonModule, TimeagoModule, FormsModule],
  templateUrl: './member-video.component.html',
  styleUrls: ['./member-video.component.scss']
})
export class MemberVideoComponent implements OnInit, OnDestroy {
  @ViewChild("messageForm") messageForm?: NgForm;
  @ViewChild('videoPlayer') localvideoPlayer: ElementRef;
  @ViewChild('remoteVideoPlayer') remoteVideoPlayer: ElementRef;
  @Input() email?: string;
  tempvideos: VideoElement[] = [];
  subscriptions = new Subscription();
  currentUser: User;
  enableVideo = true;
  enableAudio = true;
  myPeer: any;
  stream: any;
  otherMember: any;
  connections: any[] = [];
  remoteStream: any;
  waitingForPeerConnection = false;

  constructor(public messageService: MessageService, private accountService: AccountService,
    private memberService: MembersService) {
      this.accountService.currentUser.subscribe(user => {
        if (user) this.currentUser = user;
      })
     }

  async createLocalStream() {   
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: this.enableVideo, audio: this.enableAudio 
      });
      this.localvideoPlayer.nativeElement.srcObject = this.stream;
      this.localvideoPlayer.nativeElement.load();
      this.localvideoPlayer.nativeElement.play();
  }

  ngOnInit(): void {
    this.memberService.getMember(this.email).subscribe({
      next: member => this.otherMember = member
    });

    this.createLocalStream();

    this.myPeer = new Peer(this.currentUser.knownAs, {
      config: { 'iceServers': [{ urls: "stun:stun.l.google.com:19302"}]},
    });

    // this.messageService.onMessage().subscribe(message => {
    //   if (message === 'disconnect') this.disconnectFromPeer();
    // });

    this.myPeer.on('call', (call: any) => {
      this.handleIncomingCall(call);
    });
  }

  handleIncomingCall(call: any) {
    call.answer(this.stream);
  
    this.connections.push(call);
  
    call.on('stream', (remoteStream: any) => {
      console.log(2, remoteStream)
    });

    this.waitingForPeerConnection = false;
  }

  connectToPeer(peerId: string) {
    this.waitingForPeerConnection = true;

    const call = this.myPeer.call(peerId, this.stream);
    this.connections.push(call);

    call.on('stream', (remoteStream: any) => {
      this.waitingForPeerConnection = false;
      this.remoteStream = remoteStream;

      this.remoteVideoPlayer.nativeElement.srcObject = this.remoteStream;
      this.remoteVideoPlayer.nativeElement.load();
      this.remoteVideoPlayer.nativeElement.play();
    });
  }

  disconnectFromPeer() {
    this.connections.forEach(con => {
      con.close();
    });
    this.connections = [];

    this.messageService.sendMessage(this.otherMember.id, 'disconnect');
  }

  enableOrDisableVideo() {
    this.enableVideo = !this.enableVideo;
    const videoTrack = this.localvideoPlayer.nativeElement.srcObject.getVideoTracks()[0];

    if (videoTrack) videoTrack.enabled = this.enableVideo;
  }

  enableOrDisableAudio() {
    this.enableAudio = !this.enableAudio;
    const audioTrack = this.localvideoPlayer.nativeElement.srcObject.getAudioTracks()[0];
  
    if (audioTrack) audioTrack.enabled = this.enableAudio;
  }

  ngOnDestroy() {
    this.myPeer.disconnect();
    this.messageService.stopHubConnection();
    this.subscriptions.unsubscribe();
  }
}