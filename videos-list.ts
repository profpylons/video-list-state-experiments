
export type Video = {
  index: number;
  name: string;
  url: string;
}

export function getVideos(): Video[] {
  return videos;
}

const videos: Video[] = [
  {
    index: 0,
    name: 'First Video',
    url: 'https://somewhere/0'
  },
  {
    index: 1,
    name: 'Second Video',
    url: 'https://somewhere/1'
  },
  {
    index: 2,
    name: 'Third Video',
    url: 'https://somewhere/2'
  },
  {
    index: 3,
    name: 'Fourth Video',
    url: 'https://somewhere/3'
  },
  {
    index: 4,
    name: 'Fifth Video',
    url: 'https://somewhere/4'
  },
  {
    index: 5,
    name: 'Sixth Video',
    url: 'https://somewhere/5'
  },
];
