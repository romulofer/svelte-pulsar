const { installDiagnosticSuppressor } = require('../lib/diagnostic.js')

const makeConnection = () => {
  let handler = () => {}
  return {
    onPublishDiagnostics(callback) {
      handler = callback
    },
    emit(diag) {
      handler(diag)
    },
  }
}

describe('installDiagnosticSuppressor', () => {
  let observers
  const originalObserve = atom.config.observe

  beforeEach(() => {
    observers = {}
    atom.config.observe = (key, callback) => {
      observers[key] = callback
      callback(true) // all providers enabled by default
      return { dispose() {} }
    }
  })

  afterEach(() => {
    atom.config.observe = originalObserve
  })

  it('suppresses svelte.config.js diagnostics when requested', () => {
    const connection = makeConnection()
    installDiagnosticSuppressor(connection, {
      suppressSvelteConfigDiagnostic: true,
    })

    let received
    connection.onPublishDiagnostics((diag) => (received = diag))
    connection.emit({
      diagnostics: [
        { source: 'svelte', message: 'Error in svelte.config.js: boom' },
        { source: 'svelte', message: 'unrelated warning' },
      ],
    })

    expect(received.diagnostics).to.have.lengthOf(1)
    expect(received.diagnostics[0].message).to.equal('unrelated warning')
  })

  it('does not suppress svelte.config.js diagnostics by default', () => {
    const connection = makeConnection()
    installDiagnosticSuppressor(connection, {
      suppressSvelteConfigDiagnostic: false,
    })

    let received
    connection.onPublishDiagnostics((diag) => (received = diag))
    connection.emit({
      diagnostics: [
        { source: 'svelte', message: 'Error in svelte.config.js: boom' },
      ],
    })

    expect(received.diagnostics).to.have.lengthOf(1)
  })

  it('filters out diagnostics from a disabled provider', () => {
    const connection = makeConnection()
    installDiagnosticSuppressor(connection, {
      suppressSvelteConfigDiagnostic: false,
    })

    observers['svelte-pulsar.enableTsDiagnostics'](false)

    let received
    connection.onPublishDiagnostics((diag) => (received = diag))
    connection.emit({
      diagnostics: [
        { source: 'ts', message: 'type error' },
        { source: 'svelte', message: 'compiler warning' },
      ],
    })

    expect(received.diagnostics).to.have.lengthOf(1)
    expect(received.diagnostics[0].source).to.equal('svelte')
  })
})
