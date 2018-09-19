import React from 'react'
const { Component, Fragment } = React

import ReactDOM from 'react-dom'
const { render } = ReactDOM

import * as Redux from 'redux'
const { createStore, combineReducers, bindActionCreators, compose, applyMiddleware } = Redux

import * as ReactRedux from 'react-redux'
const { connect, Provider } = ReactRedux

import * as ReduxSaga from 'redux-saga'
const createSagaMiddleware = ReduxSaga.default
const { call, put, takeOnly, takeEvery, takeLatest } = ReduxSaga.effects

import 'babel-polyfill'

import './../styles/index.scss'

const title = 'My Minimal React Webpack Babel Setup'

const PresentationalComponent = ({ numCols, numRows }) => {
  console.log('PresentationalComponent', numCols, numRows)
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

const ControlPanel = ({decrementNumCols, incrementNumCols, decrementNumRows, incrementNumRows}) => {
  console.log('ControlPanel', { decrementNumCols, incrementNumCols, decrementNumRows, incrementNumRows })
  return (
    <div className="controls">
    <div className="controls__row"><button onClick={decrementNumCols}>-</button>Columns<button onClick={incrementNumCols}>+</button></div>
    <div className="controls__row"><button onClick={decrementNumRows}>-</button>Rows<button onClick={incrementNumRows}>+</button></div>
    </div>
  )
}

class ContainerComponent extends Component {  
  render() {
    console.log('render')
    return (
      <Fragment>
      <ControlPanel decrementNumCols={this.props.decrementNumCols} incrementNumCols={this.props.incrementNumCols} decrementNumRows={this.props.decrementNumRows} incrementNumRows={this.props.incrementNumRows}/>
      <PresentationalComponent numCols={this.props.numCols} numRows={this.props.numRows}/>
      </Fragment>
    )
  }
}

const AppContainer = connect(
  function mapStateToProps(state) {
    console.log('AppContainer', state)
    return {
      numCols: state.numCols,
      numRows: state.numRows
    }
  },
  (dispatch) => {
    return bindActionCreators(actions, dispatch)
  }
)(ContainerComponent)

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

const INCR_NUM_COLS = 'INCR_NUM_COLS'
const DECR_NUM_COLS = 'DECR_NUM_COLS'
const INCR_NUM_ROWS = 'INCR_NUM_ROWS'
const DECR_NUM_ROWS = 'DECR_NUM_ROWS'
const actions = {
  incrementNumCols: () => ({ type: INCR_NUM_COLS }),
  decrementNumCols: () => ({ type: DECR_NUM_COLS }),
  incrementNumRows: () => ({ type: INCR_NUM_ROWS }),
  decrementNumRows: () => ({ type: DECR_NUM_ROWS })
}

const initialState = {
  numCols: 7,
  numRows: 3
}
const reducer = (state = initialState, action) => {
  console.log('reducer', action.type)
  switch (action.type) {
    case INCR_NUM_COLS:
      state.numCols++
        break
      case DECR_NUM_COLS:
        state.numCols--
        break
      case INCR_NUM_ROWS:
        state.numRows++
          break
        case DECR_NUM_ROWS:
          state.numRows--
          break
        default:
          break
  }
  return { numCols: state.numCols, numRows: state.numRows }
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

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(sagaMiddleware, customMiddleware)
)

render(
  <Provider store={store}>
    <AppContainer/>
  </Provider>,
  document.getElementById('app')
)

module.hot.accept();
