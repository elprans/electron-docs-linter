const path = require('path')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const expect = require('chai').expect
const rimraf = require('rimraf').sync
const keyedArray = require('keyed-array')

describe('CLI', function () {
  this.timeout(10 * 1000)

  it('produces a JSON file', function () {
    rimraf(path.join(__dirname, 'electron.json'))
    execSync(path.join(__dirname, '../cli.js vendor/electron --version=1.2.3 --outfile=test/electron.json'))
    const apis = keyedArray(require('./electron.json'))

    expect(apis).to.be.an('array')
    expect(apis.length).to.be.above(10)

    // check for instanceName property on all classes
    var classes = apis.filter(api => api.type === 'Class')
    expect(classes.length).to.be.above(10)
    expect(classes.every(api => api.instanceName.length > 0)).to.equal(true)

    // clean up
    rimraf(path.join(__dirname, 'electron.json'))
  })

  it('prints errors to STDERR', function (done) {
    exec(path.join(__dirname, '../cli.js test/fixtures/malformed'), function (err, stdout, stderr) {
      if (err) throw err
      expect(stderr).to.include('uh-oh! bad docs')
      expect(stderr).to.include('4 errors found')
      done()
    })
  })
})
