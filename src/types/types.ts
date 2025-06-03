// export interface Alarm {
//   id: string;
//   start: string;
//   end: string;
//   days: string[];
//   enabled: boolean;
// }

// export interface Earthquake {
//   id: string;
//   datetime: string;
//   regionTag: string;
//   title: string;
//   depth: number;
//   magnitude: number;
//   coords: { latitude: number; longitude: number };
// }

export interface Earthquake {
  id: string;
  earthquake_id: string;
  provider: string;
  title: string;
  date: string;
  mag: number;
  depth: number;
  coordinates: [number, number];
  location_tz: string;
}
