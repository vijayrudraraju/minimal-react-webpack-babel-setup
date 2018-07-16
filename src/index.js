import React from 'react'
import ReactDOM from 'react-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
import * as ReduxSaga from 'redux-saga'
import 'babel-polyfill'
import * as ThumbsUp from 'thumbsup'

console.log('VIJ', 'ThumbsUp', ThumbsUp)

import './../styles/index.scss'

const title = 'My Minimal React Webpack Babel Setup'

console.log('React', React)
console.log('ReactDOM', ReactDOM)
console.log('Redux', Redux)
console.log('ReactRedux', ReactRedux)
console.log('ReduxSaga', ReduxSaga)

const { createStore, combineReducers, bindActionCreators, compose, applyMiddleware } = Redux
const { render } = ReactDOM
const { connect, Provider } = ReactRedux
const { Component, PureComponent, Fragment } = React
const createSagaMiddleware = ReduxSaga.default
const { call, put, takeOnly, takeEvery, takeLatest } = ReduxSaga.effects

const withThumbsupGettersAndSetters = (WrappedComponent, registeredSchema) => {
  const ThumbsupComponent = class extends Component {
    constructor(props) {
      super(props)

      const thumbsupReducer = (previousState, action) => {
        console.log('VIJ', 'thumbsupReducer', { previousState, action })
        for (const [key, value] of Object.entries(this.props._store)) {
          if (action.type === `SET_${key}`) {
            previousState[key] = action.value
            break
          }
        }
        return Object.assign({}, previousState)
      }
      globalStore.replaceReducer(thumbsupReducer)

      WrappedComponent.prototype.state = {}
      for (const [key, value] of Object.entries(this.props._store)) {
        Object.defineProperty(WrappedComponent.prototype.state, key, { 
          set: (x) => { 
            console.log('VIJ', 'setting', x)
            globalStore.dispatch({ type: `SET_${key}`, value: x })
          },
          get: () => { 
            console.log('VIJ', 'getting', key, this.props._store[key])
            return this.props._store[key] 
          }
        })
        
      }
    }

    render() {
      return (
        <WrappedComponent 
          {...this.props}>
          {this.props.children}
        </WrappedComponent>
      )
    }
  }

  return connect(
    function mapStateToProps(state) {
      return {
        _store: { 
          numCols: state.numCols,
          numRows: state.numRows
        }
      }
    },
    null
    /*
    function mapDispatchToProps(dispatch) {
      return {
        actions: bindActionCreators(actionCreators, dispatch)
      }
    }
    */
  )(ThumbsupComponent)
}

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

  render() {
    return (
      <div className="controls">
      <div className="controls__row">
        <button onClick={() => this.decrementNumCols()}>-</button>Columns<button onClick={() => this.incrementNumCols()}>+</button>
      </div>
      <div className="controls__row">
      <button onClick={() => this.decrementNumRows()}>-</button>Rows<button onClick={() => this.incrementNumRows()}>+</button></div>
      </div>
    )
  }
})

const AppContainer = withThumbsupGettersAndSetters(class extends PureComponent {
  render() {  
    const { state } = this
    console.log('VIJ', 'ContainerComponent', 'render', this)
    return (
      <Fragment>
      <ControlPanel />
      <PresentationalComponent 
        numCols={state.numCols} 
        numRows={state.numRows}
      />
      </Fragment>
    )
  }
})

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

const initialState = {
  numCols: 7,
  numRows: 3
}
const initialReducer = (state = initialState, action) => {
  return state
}

const sagaMiddleware = createSagaMiddleware()
const customMiddleware = store => next => action => {
  console.log('customMiddleware', action)
  next(action)
}

function* mySaga() {
  console.log('mySaga')
}
sagaMiddleware(mySaga)

const globalStore = createStore(
  initialReducer,
  initialState,
  applyMiddleware(sagaMiddleware, customMiddleware)
)

render(
  <Provider store={globalStore}>
    <AppContainer/>
  </Provider>,
  document.getElementById('app')
)

class Event {
  constructor() {
    this.queue = {}
  }

  on(evName, callb) {
    if (typeof this.queue[evName] === 'undefined') {
      this.queue[evName] = []
    }

    this.queue[evName].push(callb);
  }

  dispatch(ev) {
    const evType = ev.type
    console.log('dispatch', 'evType', evType, this.queue[evType])

    if (typeof this.queue[evType] === 'undefined') return

    while (this.queue[evType].length) {
      (this.queue[evType].shift())(ev)
    }
  }
}

const evRouter = new Event()
evRouter.on('TEST', (ev) => {
  console.log('on', 'ev', ev)
})
evRouter.dispatch({ type: 'TEST'})

module.hot.accept();
