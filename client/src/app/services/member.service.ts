import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { environment } from 'src/environments/environment';
import { Observable, map, of, take, tap } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userParams = new UserParams();
        this.user = user;
      }
    });
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams() {
    return this.user ? (this.userParams = new UserParams()) : undefined;
  }

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);
  
    let params = new HttpParams();
  
    params = params.append("pageNumber", userParams.pageNumber);
    params = params.append("pageSize", userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('selectedTag', userParams.selectedTag);
    params = params.append('orderBy', userParams.orderBy);
  
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(email: string){
    // const member = [...this.memberCache.values()]
    //   .reduce((arr, elem) => arr.concat(elem.result), [])
    //   .find((member: Member) => member.email === email);

    // if (member) return of(member);

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

  addLike(email: string) {
    return this.http.post(this.baseUrl + "likes/" + email, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number){
    let params = new HttpParams();
  
    params = params.append("pageNumber", pageNumber);
    params = params.append("pageSize", pageSize);
    params = params.append('predicate', predicate);

    return getPaginatedResult<Member[]>(this.baseUrl + "likes", params, this.http)
  }
}