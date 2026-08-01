export interface RoomBed {
  type: string;      // 'Veliki bračni krevet' / 'Krevet za 1 osobu'
  count: number;
}

export interface Room {
  id: string;
  name: string;       // HR naziv — 'Dvokrevetna soba s balkonom'
  nameEn: string;     // EN naziv
  descriptionHr: string;
  descriptionEn: string;
  guests: number;
  beds: RoomBed[];
  sizeM2: number;

  hasBalcony: boolean;
  amenities: string[];
  amenitiesEn: string[];
  heroImage: string;
  gallery: string[];
}

export interface RentalUnit {
  id: string;
  name: string;
  taglineHr: string;
  taglineEn: string;
  descriptionHr: string;
  descriptionEn: string;
  longDescriptionHr: string;
  longDescriptionEn: string;
  addressHr: string;
  addressEn: string;
  heroImage: string;
  gallery: string[];
  rooms: Room[];
}
