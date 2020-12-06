
const matchObj = (sample, candidat) => {

  const mismatchVal = (s, c) => typeof s === 'object' ? !matchObj(s, c) : s !== c

  for (var k in sample) {
    if(mismatchVal(sample[k], candidat[k])){ return false }
  }

  return true
}

module.exports = matchObj