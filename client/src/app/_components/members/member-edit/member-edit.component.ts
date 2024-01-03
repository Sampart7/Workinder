import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  member!: Member;
  user: User | null = null;
  @ViewChild("editForm") editForm: NgForm | undefined;
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  newTagName: string = '';
  availableTags: string[] = ["", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Microsoft SQL Server", 
    "Spring", "Django", "Laravel", "Flask", ".NET", "JavaScript", "HTML", "CSS", "SQL", 
    "Python", "TypeScript", "Node.js", "Java", "C#", "PHP", "C++", "C", "Kotlin",
    "Angular", "React", "Ember", "Vue.js"];

  constructor(private accountService: AccountService, 
    private memberService: MembersService, 
    private toastr: ToastrService, 
    private router: Router) { 
      this.accountService.currentUser.pipe(take(1)).subscribe({
        next: user => this.user = user
      });
  }
  
  ngOnInit(): void {
    this.loadMember();
  }

  addTag() {
    if (!this.newTagName || this.member.tags.some(tag => tag.name === this.newTagName)) {
      this.toastr.error('Unselected or duplicate tag');
      return;
    }
  
    this.memberService.addTag(this.newTagName).subscribe((response) => {
        this.member.tags.push(response);
        this.newTagName = '';
        this.loadMember();
      });
  }

  deleteTag(tagId: number) {
    this.memberService.deleteTag(tagId).subscribe(() => {
        this.member.tags = this.member.tags.filter(tag => tag.id !== tagId)
      });
  }

  loadMember() {
    if(!this.user) return;
    this.memberService.getMember(this.user.email).subscribe({
      next: member => this.member = member
    })
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
        this.loadMember();
      }
    })
  }
}