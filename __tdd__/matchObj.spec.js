const matchObj = require('./matchObj');

describe('matchObs', () => {

  it('compare two objects positive', () => {
    var result, sample, candidat;
    sample = {
      propA: 'ok value', propB: 'ok value',
      propObjA: { propA: 'ok value', propB: 'ok value' },
    }
    candidat = {
      propA: 'ok value', propB: 'ok value', additionalPropA: 'any value',
      propObjA: { propA: 'ok value', propB: 'ok value', additionalPropA: 'any value' },
    }

    result = matchObj(sample.propObjA, candidat.propObjA)
    expect(result).toBe(true);

    result = matchObj(sample, candidat)
    expect(result).toBe(true);
  })

  it('compare two objects negative', () => {
    const result = matchObj(
      { propA: 'ok value', propB: 'ok value' },
      { propA: 'ok value', propB: 'BAD value', additionalPropA: 'any value' },
    )
    expect(result).toBe(false);
  })
})