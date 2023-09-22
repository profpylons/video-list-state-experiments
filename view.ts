import { Video, getVideos } from './videos-list';
import { VideoController, VideoState } from './video-controller';

type ControlledVideoView = {
  video: Video;
  videoController: VideoController;
  relativeIndex: number;
}

const videosState: ControlledVideoView[] = [];
let panelIndex = -1;

const disposeFromIndex = 2; // 1 panel before the current panel
const initializeAtIndex = 2; // 2 panels ahead of the current panel

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
  const direction = newIndex >= panelIndex ? 1 : -1;
  if (panelIndex > -1) {
    // Update the state with the new state of the UI
    videosState.forEach((videoView) => {
      videoView.relativeIndex -= direction;
    });
  }
  prettyPrintState(`####### Scroll ${direction > 0 ? 'Forward' : 'Backward'} To: ViewIndex[${newIndex}] #######`);
  if (panelIndex > -1) videosState[panelIndex].videoController.pause();
  panelIndex = newIndex;

  const toBeInitialized = videosState.filter(videoView => toBeInitializedFilter(videoView, direction));
  console.log(`Initializing at index: [${toBeInitialized.map(videoView => videoView.video.index).join(', ')}]`);
  toBeInitialized.forEach(videoView => videoView.videoController.initialize());

  const toBeDisposed = videosState.filter(videoView => toBeDisposedFilter(videoView, direction))
  console.log(`Disposing at index: [${toBeDisposed.map(videoView => videoView.video.index).join(', ')}]`);
  toBeDisposed.forEach(videoView => videoView.videoController.dispose());

  console.log(`Video(${videosState[newIndex].video.name}) scrolled into view. Attempting to play...`);
  playIfPossible(videosState[newIndex].video);
}

export function onVideoStateChange(state: VideoState, video: Video) {
  console.log(`*** Video(${video.name}) state changed to ${VideoState[state]}`);
  switch (state) {
    case VideoState.Initialized:
      console.log(`Video(${video.name}) is initialized. Attempting to play...`);
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
  const isDormant =  [VideoState.Disposed, VideoState.NotInitialized].includes(videoView.videoController.state);
  if (direction > 0) {
    return videoView.relativeIndex <= initializeAtIndex && videoView.relativeIndex >=0 && isDormant;
  } else {
    return videoView.relativeIndex >= initializeAtIndex * -1 && videoView.relativeIndex <=0 && isDormant;
  }
}

function toBeDisposedFilter(videoView: ControlledVideoView, direction: number) {
  const isDormant =  [VideoState.Disposed, VideoState.NotInitialized].includes(videoView.videoController.state);

  if (direction > 0) {
    return videoView.relativeIndex <= (disposeFromIndex * direction * -1) && !isDormant;
  } else {
    return videoView.relativeIndex >= (disposeFromIndex * direction * -1) && !isDormant;
  }
}
function prettyPrintState(event: string) {
  console.log(`\n${event}`);
  console.log('\t', videosState.map(videoView => `Video(${videoView.video.name}): RelativeIndex[${videoView.relativeIndex}] - ${VideoState[videoView.videoController.state]}`).join('\n\t'));
  console.log('\n');
}
