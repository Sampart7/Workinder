import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../models/member';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + "users");
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