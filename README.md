# Video List Player State Experiments

A small demo app to experiment with the minimal implementation for managing a scrollable feed of videos. Loosely based on
Flutter Video controller.

## Getting Started

```bash
git clone git@github.com:profpylons/video-list-state-experiments
cd video-list-state-experiments
npm i
npx ts-node index.ts
```

Code will output the state changes of both the fake sceen as it "scrolls" and the fake video streams as they "load".

## Aims

- only the video in view should be playing at any time, and only if it is `Initialised` (Loaded)
- videos ahead of the scroll should be `Initialised` preemtively, so they can be auto-played as the video comes into view
- videos behind the scroll should be disposed to manage the memory of the list
- when the user reverses the scroll, the preempt/dipose direction should also change.

## Components

`Index` - A fake user interface. It loads the View and scrolls through it with some delays to mimic user behaviour.

`VideoController` - acts a bit like the Flutter video_player controller. Can load videos asynchronously and give a state
for when they are loading, playing or paused.

`View` - pretend flutter widget. It is built and then provides events for when a user scrolls the list. It also listens for
state changes in the videos to decide whether to attempt playing them or not. `relativeIndex` keeps track of the video being
in view or not. `Index(0)` is in view, with positive index being ahead and negative index being behind.

`videoslist` - Just a plain list of videos from an API call

The output looks like this. View index is the zeroth indexed array of videos being scrolled - `ViewIndex[3]` Correspondes to the video
named "Fourth Video". As it scrolls into view, "Third Video" is paused and "Fourth Video" is played because it entered the
view in the state `Initialized`.

```text
####### Scroll To: ViewIndex[3]
	 Video(First Video): RelativeIndex[-3] - Disposed
	Video(Second Video): RelativeIndex[-2] - Paused
	Video(Third Video): RelativeIndex[-1] - Paused
	Video(Fourth Video): RelativeIndex[0] - Initialized
	Video(Fifth Video): RelativeIndex[1] - Initializing
	Video(Sixth Video): RelativeIndex[2] - NotInitialized


*** Video(Sixth Video) state changed to Initializing

State Change: Video(Sixth Video) - Initializing
	 Video(First Video): RelativeIndex[-3] - Disposed
	Video(Second Video): RelativeIndex[-2] - Paused
	Video(Third Video): RelativeIndex[-1] - Paused
	Video(Fourth Video): RelativeIndex[0] - Initialized
	Video(Fifth Video): RelativeIndex[1] - Initializing
	Video(Sixth Video): RelativeIndex[2] - Initializing


*** Video(Second Video) state changed to Disposed

State Change: Video(Second Video) - Disposed
	 Video(First Video): RelativeIndex[-3] - Disposed
	Video(Second Video): RelativeIndex[-2] - Disposed
	Video(Third Video): RelativeIndex[-1] - Paused
	Video(Fourth Video): RelativeIndex[0] - Initialized
	Video(Fifth Video): RelativeIndex[1] - Initializing
	Video(Sixth Video): RelativeIndex[2] - Initializing


*** Video(Fourth Video) state changed to Playing

State Change: Video(Fourth Video) - Playing
	 Video(First Video): RelativeIndex[-3] - Disposed
	Video(Second Video): RelativeIndex[-2] - Disposed
	Video(Third Video): RelativeIndex[-1] - Paused
	Video(Fourth Video): RelativeIndex[0] - Playing
	Video(Fifth Video): RelativeIndex[1] - Initializing
	Video(Sixth Video): RelativeIndex[2] - Initializing

```
