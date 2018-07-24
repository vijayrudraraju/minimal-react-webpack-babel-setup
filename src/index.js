import React from 'react'
import ReactDOM from 'react-dom'
//import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
//import * as ReduxSaga from 'redux-saga'
import 'babel-polyfill'
import * as ThumbsUp from 'thumbsup'
import Mappings from './mappings'

import './../styles/index.scss'

const title = 'My Minimal React Webpack Babel Setup'

console.log('ThumbsUp', ThumbsUp)
console.log('React', React)
console.log('ReactDOM', ReactDOM)
console.log('ReactRedux', ReactRedux)
//console.log('ReduxSaga', ReduxSaga)

//const { createStore, combineReducers, bindActionCreators, compose, applyMiddleware } = Redux
const { render } = ReactDOM
const { connect, Provider } = ReactRedux
const { Component, PureComponent, Fragment } = React
//const createSagaMiddleware = ReduxSaga.default
//const { call, put, takeOnly, takeEvery, takeLatest, all, spawn, take } = ReduxSaga.effects
const { withThumbsupGettersAndSetters } = ThumbsUp

import * as Store from './store'
const { globalStore } = Store

const GifsComponent = withThumbsupGettersAndSetters(class extends PureComponent {
  render() {
    let gifs = []
    for (let j=0; j<this.state.gifs; j++) {
      gifs.push(<img src={gifs[j].url}/>)
    }
    return (
      <Fragment>
        {gifs}
      </Fragment>
    )
  }
}, globalStore, Mappings)

class PresentationalComponent extends PureComponent {
  render() {
    const { numCols, numRows } = this.props
    let colDivs = []
    for (let j=0; j<numCols; j++) {
      colDivs.push(
        <div key={j} className="grid__col">
        <div className="grid__circle"></div>
        </div>
      )
    }
    let rowDivs = []
    for (let i=0; i<numRows; i++) {
      rowDivs.push(<div key={i} className="grid__row">{colDivs}</div>)
    }
    return (
      <div className="grid">{ rowDivs }</div>
    )
  }
}

const ControlPanel = withThumbsupGettersAndSetters(class extends PureComponent {
  decrementNumCols() {
    this.state.numCols = this.state.numCols - 1
  }
  incrementNumCols() {
    this.state.numCols = this.state.numCols + 1
  }

  decrementNumRows() {
    this.state.numRows = this.state.numRows - 1
  }
  incrementNumRows() {
    this.state.numRows = this.state.numRows + 1
  }

  onQueryChange(ev) {
    this.state.queryInput = ev.target.value
  }
  submitQuery(ev) {
    this.state.query = this.state.queryInput
  }

  render() {
    return (
      <div className="controls">
        <div className="controls__row">
          <button onClick={() => this.decrementNumCols()}>-</button>Columns<button onClick={() => this.incrementNumCols()}>+</button>
        </div>
        <div className="controls__row">
          <button onClick={() => this.decrementNumRows()}>-</button>Rows<button onClick={() => this.incrementNumRows()}>+</button>
        </div>
        <div className="controls__row">
          <input onChange={(ev) => this.onQueryChange(ev)}/>
          <button onClick={(ev) => this.submitQuery(ev)}>Search for {this.state.queryInput}</button>
        </div>
      </div>
    )
  }
}, globalStore, Mappings)

const AppContainer = withThumbsupGettersAndSetters(class extends PureComponent {
  render() {  
    const { state } = this
    console.log('VIJ', 'ContainerComponent', 'render')
    return (
      <Fragment>
        <ControlPanel/>
        <GifsComponent/>
        <PresentationalComponent 
          numCols={state.numCols} 
          numRows={state.numRows}
        />
      </Fragment>
    )
  }
}, globalStore, Mappings)

class Line extends Component {
  getDefaultProps () { return { side: 'root' } }

  getInitialState () { return { rotation: 30 } }

  componentDidMount () { 
    this.updateRotation()
  }

  componentWillUnmount () {
  }

  updateRotation () {
    const opp = 100
    const adj = this.el.offsetWidth
    const rotation = Math.atan(opp / adj)
    this.setState({rotation})
  }

  render () {
    const offsetX = -25
    const offsetY = -25
    const scaleX = this.props.side === 'left' ? -1 : 1
    return <div
    className={'line ' + this.props.side}
    ref={el => this.el = el}
    style={{
      transform: `
      rotate(${this.state.rotation * scaleX}rad)
      translateX(${offsetX * scaleX}px)
      translateY(${offsetY}px)`
    }}
    />
  }
}

render(
  <Provider store={globalStore}>
    <AppContainer/>
  </Provider>,
  document.getElementById('app')
)

class EventSystem {
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
    console.log('dispatch', 'evType', evType, this.queue[evType])

    if (typeof this.queue[evType] === 'undefined') return

    this.queue[evType].forEach(callb => {
      callb(ev)
    })
  }
}

const evRouter = new EventSystem()
evRouter.on('TEST', (ev) => {
  console.log('TEST', 'on', 'ev', ev)
})
let circles = document.querySelectorAll('.grid__circle')
Array.from(circles).forEach(circle => {
  circle.addEventListener('click', (ev) => {
    evRouter.dispatch({ type: 'TEST'})
  })
})

module.hot.accept();
