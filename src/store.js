import * as Redux from 'redux'
import * as ReduxSaga from 'redux-saga'

console.log('Redux', Redux)

const { createStore, combineReducers, bindActionCreators, compose, applyMiddleware } = Redux
const { call, put, takeOnly, takeEvery, takeLatest, all, spawn, take } = ReduxSaga.effects
const createSagaMiddleware = ReduxSaga.default

const initialState = {
  numCols: 7,
  numRows: 3,
  gifs: [],
  queryInput: '',
  query: '',
}

export const actions = {
  SET_GIFS: 'SET_GIFS'
}

const initialReducer = (state = initialState, action) => {
  switch (action) {
    case actions.SET_GIFS:
      return Object.assign({}, state, { 
        gifs: action.data 
      }) 
      break
  }
  return state
}

const sagaMiddleware = createSagaMiddleware()
const customMiddleware = store => next => action => {
  console.log('customMiddleware', action)
  next(action)
}

function* childSaga() {
  while(true) {
    const action = yield take(act => {
      return act.value
    })
    console.log('VIJ', 'childSaga', action)
  }
}
function* mySaga() {
  console.log('mySaga')
  yield all([
    call(childSaga),
  ])
}

export const globalStore = createStore(
  initialReducer,
  initialState,
  applyMiddleware(sagaMiddleware, customMiddleware)
)
sagaMiddleware.run(mySaga)
