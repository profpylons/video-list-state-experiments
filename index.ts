import * as view from './view'

async function simulate() {
  view.Build();

  await waitFor(.1);
  view.onScroll(1);

  await waitFor(2);
  view.onScroll(2);

  await waitFor(.1);
  view.onScroll(3);

  await waitFor(.1);
  view.onScroll(4);

  await waitFor(.1);
  view.onScroll(3);

  await waitFor(2);
}



async function waitFor(seconds: number) {
  return await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

simulate()
.then(() => console.log('done'));
