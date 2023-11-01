import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
@Component({
  selector: 'app-member-videos',
  standalone: true,
  imports: [CommonModule, TimeagoModule, FormsModule],
  templateUrl: './member-videos.component.html',
  styleUrls: ['./member-videos.component.scss']
})
export class MemberVideosComponent {
  
}
