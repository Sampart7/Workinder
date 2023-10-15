import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/userParams';
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
  //user: User | undefined;
  genderList = [
    {value: 'all', display: 'All' },
    {value: 'male', display: 'Males'}, 
    {value: 'female', display: "Females"},
    {value: 'another', display: "Anothers"}
  ];
  tagList: string[] = [];
  selectedTag: string | undefined;

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
    this.tagList = [".NET", "C", "C++", "Java"];
    this.selectedTag = null;
  }

  ngOnInit(): void {
    this.resetFilters();
  }

  loadMembers() {
    if (!this.userParams) return;
  
    this.memberService.getMembers(this.userParams).subscribe({
      next: (response) => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
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