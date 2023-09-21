import { Video, getVideos } from './videos-list';
import { VideoController, VideoState } from './video-controller';

type ControlledVideoView = {
  video: Video;
  videoController: VideoController;
  relativeIndex: number;
}

const videosState: ControlledVideoView[] = [];
let panelIndex = -1;

const disposeAtIndex = -1;
const initializeAtIndex = 2;

export function Build() {
  const videos = getVideos();
  videos.forEach((video, index) => {
    const videoController = new VideoController(video, onVideoStateChange);
    videosState.push({
      video,
      videoController,
      relativeIndex: index,
    });
  });

  onScroll(0);
}

export function onScroll(newIndex: number) {
  const direction = newIndex < panelIndex ? -1 : 1;
  prettyPrintState(`####### Scroll ${direction > 0 ? 'Forward' : 'Backward'} To: ViewIndex[${newIndex}]`);
  if (panelIndex > -1) {
    videosState[panelIndex].videoController.pause();

    // Update the state with the new state of the UI
    videosState.forEach((videoView) => {
      videoView.relativeIndex -= direction;
    });
  }
  panelIndex = newIndex;

  videosState
    .filter(videoView => toBeInitializedFilter(videoView, direction))
    .forEach(videoView => videoView.videoController.initialize());

  videosState
    .filter(videoView => toBeDisposedFilter(videoView, direction))
    .forEach(videoView => videoView.videoController.dispose());

  playIfPossible(videosState[newIndex].video);
}

export function onVideoStateChange(state: VideoState, video: Video) {
  console.log(`*** Video(${video.name}) state changed to ${VideoState[state]}`);
  switch (state) {
    case VideoState.Initialized:
      playIfPossible(video);
      break;
    default:
      break;
  }
  prettyPrintState(`State Change: Video(${video.name}) - ${VideoState[state]}`);
}

function playIfPossible(video: Video) {
  const videoView = videosState.find(videoView => videoView.video.index === video.index);
  if (videoView) {
    if(videoView.relativeIndex === 0 && (videoView.videoController.state === VideoState.Initialized || videoView.videoController.state === VideoState.Paused)) {
      videoView.videoController.play();
      return;
    }
    console.log(`Attempt to play video(${video.name}) DENIED. State: ${VideoState[videoView?.videoController.state]}. Relative index: ${videoView?.relativeIndex}`);
  }
}

function toBeInitializedFilter(videoView: ControlledVideoView, direction: number) {
  return videoView.relativeIndex * direction <= initializeAtIndex && videoView.relativeIndex >= 0 && videoView.videoController.state === VideoState.NotInitialized;
}

function toBeDisposedFilter(videoView: ControlledVideoView, direction: number) {
  return videoView.relativeIndex <= (disposeAtIndex * direction * -1)
}

function prettyPrintState(event: string) {
  console.log(`\n${event}`);
  console.log('\t', videosState.map(videoView => `Video(${videoView.video.name}): RelativeIndex[${videoView.relativeIndex}] - ${VideoState[videoView.videoController.state]}`).join('\n\t'));
  console.log('\n');
}
