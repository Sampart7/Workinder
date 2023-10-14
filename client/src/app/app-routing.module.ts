import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { HomeComponent } from './_components/home/home.component';
import { MemberListComponent } from './_components/members/member-list/member-list.component';
import { MemberDetailComponent } from './_components/members/member-detail/member-detail.component';
import { MemberEditComponent } from './_components/members/member-edit/member-edit.component';
import { ListsComponent } from './_components/lists/lists.component';
import { MessagesComponent } from './_components/messages/messages.component';

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
