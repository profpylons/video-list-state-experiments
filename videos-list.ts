
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
    name: 'Video Zero',
    url: 'https://somewhere/0'
  },
  {
    index: 1,
    name: 'Video One',
    url: 'https://somewhere/1'
  },
  {
    index: 2,
    name: 'Video Three',
    url: 'https://somewhere/2'
  },
  {
    index: 3,
    name: 'Video Four',
    url: 'https://somewhere/3'
  },
  {
    index: 4,
    name: 'Video Five',
    url: 'https://somewhere/4'
  },
  {
    index: 5,
    name: 'Video Six',
    url: 'https://somewhere/5'
  },
];
