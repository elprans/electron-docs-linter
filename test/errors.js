const path = require('path')
const expect = require('chai').expect
const lint = require('..')

var apis

describe('Malformed Docs', function () {
  this.timeout(10 * 1000)

  before(function (done) {
    var docPath = path.join(__dirname, '../test/fixtures/malformed')
    lint(docPath, '1.2.3')
      .then(function (_apis) {
        apis = _apis
        done()
      })
      .catch(function (err) {
        console.error(err)
      })
  })

  it('events', function () {
    var errors = apis.app.errors
    expect(errors.length).to.equal(1)
    expect(errors[0].type).to.equal('Event')
    expect(errors[0].pattern).to.exist
    expect(errors[0].html).to.match(/Event: /)
  })

  it('method parameters', function () {
    var errors = apis.clipboard.errors
    expect(errors.length).to.equal(1)
    expect(errors[0].type).to.equal('parameters')
    expect(errors[0].pattern).to.exist
    expect(errors[0].html).to.equal('<code>type</code>')
    expect(errors[0].markdownGuess).to.equal('`type`')
  })

  it('method parameter subproperties in a constructor', function () {
    var errors = apis.BrowserWindow.errors
    expect(errors.length).to.equal(1)
    expect(errors[0].type).to.equal('parameter subproperties')
    expect(errors[0].filename).to.equal('browser-window.md')
  })

  it('method parameter ENUM values', function () {
    var errors = apis.WebContents.errors
    expect(errors.length).to.equal(2)
    expect(errors[1].type).to.equal('parameter ENUM values')
    expect(errors[1].filename).to.equal('web-contents.md')
    expect(errors[1].html).to.equal('<code>HTMLOnly</code>')
  })

  // TODO: Move this to "index.js" tests when an appropriate PR is merged into Electron
  it('supports return types consisting of multiple types', function () {
    var methodParam = apis.app.methods.setBadgeCount.parameters[0]
    expect(methodParam.type).to.be.a('array')
    expect(methodParam.type.length).to.equal(4)
    expect(methodParam.type).to.deep.equal(['Integer', 'Number', 'Float', 'Struct'])
  })
})
