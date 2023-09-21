import * as view from './view'



// Time            0----+----1----+----2----+----3----+----4----+----5----+----6----+----7----+----8----+----9
//
// Video Lifetime
//   loads         0---------| xxxxxxxxxxxxxxxxxxxxxxxx
//                 1---------|      xxxxxxxxxxxxxxxxxxx
//                 2---------|       xx2---------|
//                  3---------|
//                                  4---------|
//                                   5--xxxxxxxxxxxxxxx
// Time            0----+----1----+----2----+----3----+----4----+----5----+----6----+----7----+----8----+----9
//   Load(0)       .
//   Scrolls(1)     ................
//   Scrolls(2)                     .
//   Scrolls(3)                      .
//   Scrolls(4)                       .
//   Scrolls(3)                        ................
// Time            0----+----1----+----2----+----3----+----4----+----5----+----6----+----7----+----8----+----9
//   (0)plays      x
//   (1)plays       xxxxxxxxxxx11111
//   (2)plays                       2
//   (3)plays                        3 3333333333333333
//   (4)plays                         x
//   (5)plays

async function simulate() {
  view.Build();
  await waitFor(.1);

  view.onScroll(1);
  await waitFor(1.5);

  view.onScroll(2);
  await waitFor(.1);

  view.onScroll(3);
  await waitFor(.1);

  view.onScroll(4);
  await waitFor(.1);

  view.onScroll(3);
  await waitFor(1.5);
}



async function waitFor(seconds: number) {
  return await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

simulate()
.then(() => console.log('done'));
