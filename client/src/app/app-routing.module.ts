import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_modules/home/home.component';
import { MemberDetailComponent } from './_modules/members/member-detail/member-detail.component';
import { ListsComponent } from './_modules/lists/lists.component';
import { MessagesComponent } from './_modules/messages/messages.component';
import { MemberListComponent } from './_modules/members/member-list/member-list.component';
import { authGuard } from './guards/auth.guard';
import { MemberEditComponent } from './_modules/members/member-edit/member-edit.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "", runGuardsAndResolvers: 'always', canActivate: [authGuard], children: [
      {path: "members", component: MemberListComponent},
      {path: "members/:username", component: MemberDetailComponent},
      {path: "member/edit", component: MemberEditComponent, canDeactivate: [unsavedChangesGuard]},
      {path: "lists", component: ListsComponent},
      {path: "messages", component: MessagesComponent}
    ]
  },
  {path: "**", component: HomeComponent, pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
