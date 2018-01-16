import TMD from '../TMD';

test('creates header with the right layout', () => {
  const header = TMD.createHeader();
  expect(header).toMatchObject({
    id: 0,
    flags: 0,
    numObjects: 0,
    byteLength: 12,
  });
});
