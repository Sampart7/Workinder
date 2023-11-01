import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './_helpers/guards/auth.guard';
import { unsavedChangesGuard } from './_helpers/guards/unsaved-changes.guard';
import { HomeComponent } from './_components/home/home.component';
import { MemberListComponent } from './_components/members/member-list/member-list.component';
import { MemberDetailComponent } from './_components/members/member-detail/member-detail.component';
import { MemberEditComponent } from './_components/members/member-edit/member-edit.component';
import { ListsComponent } from './_components/lists/lists.component';
import { MessagesComponent } from './_components/messages/messages.component';
import { memberDetailResolver } from './_helpers/resolvers/member-detail.resolver';
import { MemberVideosComponent } from './_components/members/member-videos/member-videos.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "", runGuardsAndResolvers: 'always', canActivate: [authGuard], children: [
      {path: "members", component: MemberListComponent},
      {path: "members/:username", component: MemberDetailComponent, resolve: {member: memberDetailResolver}},
      {path: "member/edit", component: MemberEditComponent, canDeactivate: [unsavedChangesGuard]},
      {path: "lists", component: ListsComponent},
      {path: "messages", component: MessagesComponent},
      {path: "videos", component: MemberVideosComponent}
    ]
  },
  {path: "**", component: HomeComponent, pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
