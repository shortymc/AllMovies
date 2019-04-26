export class Episode {
  id: number;
  name: string;
  overview: string;
  airDate: string;
  episodeNumber: number;
  seasonNumber: number;
  serieId: number;
  poster: string;
  guestStars: string[];
  crew: string[];
  vote: number;
  vote_count: number;
}

export class Season {
  id: number;
  name: string;
  overview: string;
  airDate: string;
  seasonNumber: number;
  episodeCount: number;
  poster: string;
  episodes: Episode[];
  actors: string[];
  crew: string[];
  images: string[];
  videos: string[];
}
