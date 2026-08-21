const cp = require('child_process')
const { EventEmitter } = require('events')

const client = require('../lib/main.js')

describe('SvelteLanguageClient', () => {
  it('reports the svelte grammar scope and identity', () => {
    expect(client.getGrammarScopes()).to.deep.equal(['source.svelte'])
    expect(client.getLanguageName()).to.equal('Svelte')
    expect(client.getServerName()).to.equal('Svelte Language Server')
    expect(client.getConnectionType()).to.equal('ipc')
  })

  describe('_startServerWithNode', () => {
    const originalSpawn = cp.spawn

    afterEach(() => {
      cp.spawn = originalSpawn
    })

    it('spawns the language server with the given Node executable', async () => {
      let spawnCall
      cp.spawn = (command, args, options) => {
        spawnCall = { command, args, options }
        return new EventEmitter()
      }

      await client._startServerWithNode('/usr/bin/node')

      expect(spawnCall.command).to.equal('/usr/bin/node')
      expect(spawnCall.args).to.have.lengthOf(1)
      expect(spawnCall.args[0]).to.match(/svelte-language-server.*server\.js$/)
      expect(spawnCall.options.stdio).to.deep.equal([null, null, null, 'ipc'])
    })

    it('rejects when the Node process fails to start', async () => {
      cp.spawn = () => {
        const child = new EventEmitter()
        setImmediate(() => child.emit('error', new Error('ENOENT')))
        return child
      }

      let caught
      try {
        await client._startServerWithNode('/does/not/exist')
      } catch (err) {
        caught = err
      }

      expect(caught).to.be.an('error')
      expect(caught.message).to.equal('ENOENT')
    })
  })
})
