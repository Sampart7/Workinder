import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/userParams';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  genderList = [
    {value: 'all', display: 'All' },
    {value: 'male', display: 'Males'}, 
    {value: 'female', display: "Females"},
    {value: 'another', display: "Anothers"}
  ];
  tagList: string[] = [];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.resetFilters();
  }

  loadMembers() {
    if (!this.userParams) return;
  
    this.memberService.getMembers(this.userParams).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
  
          this.members.forEach(member => {
            if (member.tags) {
              member.tags.forEach(tag => {
                if (!this.tagList.includes(tag.name)) {
                  this.tagList.push(tag.name);
                }
              });
            }
          });
        }
      }
    });
  }

  resetFilters() {
    this.userParams = new UserParams()
    this.loadMembers();
  }

  pageChanged(event: any){
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
