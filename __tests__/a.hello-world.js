const waitForTime = ms => new Promise(r => setTimeout(r, ms));

it('a. hello world', async () => {
  await waitForTime(2000)
})
