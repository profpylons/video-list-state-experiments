import { Video } from './videos-list';

const seconds = 1000;

export enum VideoState {
  NotInitialized,
  Initializing,
  Initialized,
  Playing,
  Paused,
  Disposed,
}

type StateTransition = {
  from: VideoState;
  to: VideoState;
  resulting?: VideoState;
};

const transitions: StateTransition[] = [
  {from: VideoState.NotInitialized, to: VideoState.NotInitialized},
  {from: VideoState.NotInitialized, to: VideoState.Initializing},
  {from: VideoState.NotInitialized, to: VideoState.Disposed},

  {from: VideoState.Initializing, to: VideoState.Initializing},
  {from: VideoState.Initializing, to: VideoState.Initialized},
  {from: VideoState.Initializing, to: VideoState.Disposed},
  {from: VideoState.Initializing, to: VideoState.Paused, resulting: VideoState.Initializing},

  {from: VideoState.Initialized, to: VideoState.Initialized},
  {from: VideoState.Initialized, to: VideoState.Playing},
  {from: VideoState.Initialized, to: VideoState.Paused},
  {from: VideoState.Initialized, to: VideoState.Disposed},

  {from: VideoState.Playing, to: VideoState.Playing},
  {from: VideoState.Playing, to: VideoState.Paused},
  {from: VideoState.Playing, to: VideoState.Disposed},

  {from: VideoState.Paused, to: VideoState.Paused},
  {from: VideoState.Paused, to: VideoState.Playing},
  {from: VideoState.Paused, to: VideoState.Disposed},

  {from: VideoState.Disposed, to: VideoState.Disposed},
  {from: VideoState.Disposed, to: VideoState.Initializing},
  {from: VideoState.Disposed, to: VideoState.Paused, resulting: VideoState.Disposed},
];

export type StateListener = (state: VideoState, video: Video) => void;

export class VideoController {
  constructor(private readonly video: Video, private readonly stateListener: StateListener) {}

  private _state: VideoState = VideoState.NotInitialized;

  public get state(): VideoState {
    return this._state;
  }

  private setState(state: VideoState) {
    const transition = transitions.find(t => t.from === this._state && t.to === state);
    const previous = this._state;
    if (!transition) {
      console.log(`******* INVALID STATE CHANGE Video(${this.video.index}) cannot be changed from state ${VideoState[this._state]} to ${VideoState[state]}`);
      return;
    }
    if (transition.resulting) {
      this._state = transition.resulting;
      if (previous !== transition.resulting) {
        this.stateListener(this._state, this.video);
      }
    } else {
      this._state = state;
      if (previous !== this._state) {
        this.stateListener(this._state, this.video);
      }
    }
  }

  public async initialize() {
    console.log(`Video(${this.video.name}) initializing...`);
    this.setState(VideoState.Initializing);
    setTimeout(() => this.setState(VideoState.Initialized), 1 * seconds);
  }

  public async play() {
    this.setState(VideoState.Playing);
  }

  public pause() {
    this.setState(VideoState.Paused);
  }

  public dispose() {
    this.setState(VideoState.Disposed);
  }
}
