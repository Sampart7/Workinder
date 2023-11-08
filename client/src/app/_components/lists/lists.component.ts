import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { MembersService } from 'src/app/services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  members: Member[] | undefined;
  predicate = "liked";
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;
  likes: number = 0;

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.membersService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination
        this.likes = response.result.length;
      }
    })
  }

  pageChanged(event: any){
    if (this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }

}
