import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../_modules/members/member-edit/member-edit.component';
import { registerRuntimeCompiler } from 'vue';

export const unsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  if(component.editForm?.dirty) {
    return confirm("You have unsaved changes");
  }
  return true;
};
