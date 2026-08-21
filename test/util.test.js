const { debounce } = require('../lib/util.js')

describe('debounce', () => {
  let clock

  beforeEach(() => {
    clock = []
    global.setTimeout = (fn, delay) => {
      const id = clock.length
      clock.push({ fn, delay, cleared: false })
      return id
    }
    global.clearTimeout = (id) => {
      if (clock[id]) clock[id].cleared = true
    }
  })

  const runPending = () => {
    for (const call of clock) {
      if (!call.cleared) call.fn()
    }
  }

  it('only invokes fn once after the last call within the delay', () => {
    let calls = 0
    const debounced = debounce(10, () => calls++)

    debounced()
    debounced()
    debounced()

    expect(clock.filter((c) => !c.cleared)).to.have.lengthOf(1)
    runPending()
    expect(calls).to.equal(1)
  })

  it('uses the configured delay for every scheduled call', () => {
    const debounced = debounce(42, () => {})
    debounced()
    expect(clock[0].delay).to.equal(42)
  })
})
