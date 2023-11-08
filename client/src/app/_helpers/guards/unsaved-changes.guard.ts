import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../../_components/members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from 'src/app/services/confirm.service';

export const unsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  const confirmService = inject(ConfirmService);
  
  if(component.editForm?.dirty) return confirmService.confirm();

  return true;
};
