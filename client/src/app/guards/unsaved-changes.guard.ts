import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../_components/members/member-edit/member-edit.component';

export const unsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  if(component.editForm?.dirty) {
    return confirm("You have unsaved changes");
  }
  return true;
};
