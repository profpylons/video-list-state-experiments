import { Video } from './videos-list';

const seconds = 1000;

export enum VideoState {
  NotInitialized,
  Initializing,
  Initialized,
  Playing,
  Paused,
  Disposed,
  Error,
}

export type StateListener = (state: VideoState, video: Video) => void;

export class VideoController {
  constructor(private readonly video: Video, private readonly stateListener: StateListener) {}

  private _state: VideoState = VideoState.NotInitialized;

  public get state(): VideoState {
    return this._state;
  }

  private setState(state: VideoState) {
    this._state = state;
    this.stateListener(this._state, this.video);
  }

  public async initialize() {
    switch (this._state) {
      case VideoState.NotInitialized:
        case VideoState.Disposed:
        this.setState(VideoState.Initializing);

        //simulate some loading time...
        const waitTime = Math.floor(Math.random() * 0.5 * seconds) + 1 * seconds;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        this.setState(VideoState.Initialized);
        break;
      default:
        console.log(`******* INVALID STATE CHANGE Video(${this.video.index}) cannot be initialized from state ${VideoState[this._state]}`);
        return;
    }
  }

  public async play() {
    switch (this._state) {
      case VideoState.Initialized:
      case VideoState.Paused:
        this.setState(VideoState.Playing);
        break;
      default:
        console.log(`******* INVALID STATE CHANGE Video(${this.video.index}) cannot be played from state ${VideoState[this._state]}`);
        return;
    }
  }

  public pause() {
    switch (this._state) {
      case VideoState.Paused:
        break;
      case VideoState.Playing:
        this.setState(VideoState.Paused);
        break;
      default:
        console.log(`******* INVALID STATE CHANGE Video(${this.video.index}) cannot be paused from state ${VideoState[this._state]}`);
        break;
    }
  }

  public dispose() {
    switch (this._state) {
      case VideoState.NotInitialized:
      case VideoState.Disposed:
        break;
      case VideoState.Initialized:
      case VideoState.Paused:
        this.setState(VideoState.Disposed);
        break;
      default:
        console.log(`******* INVALID STATE CHANGE Video(${this.video.index}) cannot be disposed from state ${VideoState[this._state]}`);
        break;
    }
  }
}
