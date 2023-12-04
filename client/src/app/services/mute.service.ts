import { Injectable } from '@angular/core';
import { MuteObject } from '../models/mute';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MuteService {
  private muteMicro: MuteObject;
  private muteCamera: MuteObject;

  private muteMicroSource = new Subject<MuteObject>();
  muteMicro$ = this.muteMicroSource.asObservable();

  private muteCameraSource = new Subject<MuteObject>();
  muteCamera$ = this.muteCameraSource.asObservable();

  constructor() { }

  set Microphone(value: MuteObject) {
    this.muteMicro = value;
    this.muteMicroSource.next(value);
  }

  get Microphone(): MuteObject {
    return this.muteMicro;
  }

  set Camera(value: MuteObject) {
    this.muteCamera = value;
    this.muteCameraSource.next(value);
  }

  get Camera(): MuteObject {
    return this.muteCamera;
  }
}
