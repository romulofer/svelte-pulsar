const chai = require('chai')
const { createRunner } = require('atom-mocha-test-runner')

global.assert = chai.assert
global.expect = chai.expect

module.exports = createRunner(
  {
    htmlTitle: `svelte-pulsar Package Tests - pid ${process.pid}`,
    reporter: process.env.MOCHA_REPORTER || 'spec',
    overrideTestPaths: [/spec$/, /test/],
  },
  (mocha) => {
    mocha.timeout(parseInt(process.env.MOCHA_TIMEOUT || '5000', 10))

    if (process.env.TEST_JUNIT_XML_PATH) {
      mocha.reporter(require('mocha-junit-and-console-reporter'), {
        mochaFile: process.env.TEST_JUNIT_XML_PATH,
      })
    }
  },
)
