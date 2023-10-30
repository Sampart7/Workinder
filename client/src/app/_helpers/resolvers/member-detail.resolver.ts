import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/member.service';
 
export const memberDetailResolver: ResolveFn<Member> = (route:ActivatedRouteSnapshot) => {
  return inject(MembersService).getMember(route.paramMap.get('username')!)
};