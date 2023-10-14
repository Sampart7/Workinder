import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { PaginatedResult } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;

  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if(page && itemsPerPage) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage)
    }

    return this.http.get<Member[]>(this.baseUrl + "users", {observe: "response", params}).pipe(
      map(response => {
        if (response.body) {
          this.paginatedResult.result = response.body;
        }
        const pagination = response.headers.get("Pagination");
        if (pagination) {
          this.paginatedResult.pagination = JSON.parse(pagination);
        }

        return this.paginatedResult;
      })
    )
  }

  getMember(email: string) {
    return this.http.get<Member>(this.baseUrl + "users/" + email);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + "users", member)
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + "users/set-main-photo/" + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + "users/delete-photo/" + photoId);
  }

  addTag(tagName: string): Observable<any> {
    return this.http.post(this.baseUrl + "users/add-tag", { name: tagName });
  }

  deleteTag(tagId: number): Observable<any> {
    return this.http.delete(this.baseUrl + "users/delete-tag/" + tagId);
  }
}