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
