import { Photo } from './photo';
import { Tag } from './tag';

export interface Member {
    id: number;
    username: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
    tags: Tag[];
  }