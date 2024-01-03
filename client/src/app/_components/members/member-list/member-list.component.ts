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
  isLikedPage = false;
  
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
    this.tagList = ["", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Microsoft SQL Server", 
      "Spring", "Django", "Laravel", "Flask", ".NET", "JavaScript", "HTML", "CSS", "SQL", 
      "Python", "TypeScript", "Node.js", "Java", "C#", "PHP", "C++", "C", "Kotlin",
      "Angular", "React", "Ember", "Vue.js"];
    this.selectedTag = null;
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      });
    }
  }
  
  resetFilters() {
      this.userParams = this.memberService.resetUserParams();
      this.loadMembers();
  }

  pageChanged(event: any){
    if (this.userParams.pageNumber && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams)
      this.loadMembers();
    }
  }
}