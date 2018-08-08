export class EventSystem {
  constructor() {
    this.queue = {}
  }

  on(evName, callb) {
    if (typeof this.queue[evName] === 'undefined') {
      this.queue[evName] = new Set()
    }

    if (typeof callb === 'function') {
      this.queue[evName].add(callb);
    } else {
      throw new Error('callback passed to on is not a function')
    }
  }

  off(evName, callb) {
    const evCallbs = this.queue[evName]

    if (evCallbs && evCallbs.has(callb)) {
      evCallbs.delete(callb)
    }

    if (evCallbs && evCallbs.size === 0) {
      delete this.queue[evName]
    }
  }

  onlyOnce(evName, callb) {
    const wrappedCallb = ev => {
      callb(ev)
      this.off(evName, callb)
    }

    this.on(evName, wrappedCallb) 
  }

  dispatch(ev) {
    const evType = ev.type
    console.log('VIJ', 'dispatch', 'evType', evType, this.queue[evType])

    if (typeof this.queue[evType] === 'undefined') return

    this.queue[evType].forEach(callb => {
      callb(ev)
    })
  }
}

export const evRouter = new EventSystem()
evRouter.on('TEST', (ev) => {
  console.log('VIJ', 'TEST', 'on', 'ev', ev)
})

let circles = document.querySelectorAll('.grid__circle')
Array.from(circles).forEach(circle => {
  circle.addEventListener('click', (ev) => {
    evRouter.dispatch({ type: 'TEST'})
  })
})

