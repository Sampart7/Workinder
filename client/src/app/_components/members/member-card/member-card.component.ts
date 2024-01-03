import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/member.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  @Input() member: Member | undefined;
  @Input() isLikedPage: boolean = false;
  @Output() likeDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presenceService: PresenceService, private router: Router) { }

  addLike(member: Member){
    this.memberService.addLike(member.email).subscribe({
      next: () => this.toastr.success('You have liked ' + member.knownAs),
      error: () => this.toastr.error("You already liked this user")
    })
  }

  deleteLike(id: number) {
    this.memberService.deleteLike(id).subscribe(() => this.likeDeleted.emit())
  }
}
