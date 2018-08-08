import * as Redux from 'redux'
import * as ReduxSaga from 'redux-saga'
console.log('VIJ', 'Redux', Redux)
console.log('VIJ', 'ReduxSaga', ReduxSaga)

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

export const Actions = {
  SET_GIFS: 'SET_GIFS'
}

const initialReducer = (state = initialState, action) => {
  console.log('VIJ', 'initialReducer', action)
  /*
  switch (action) {
    case Actions.SET_GIFS:
      return Object.assign({}, state, { 
        gifs: action.data 
      }) 
      break
  }
  */
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

export const GlobalStore = createStore(
  initialReducer,
  initialState,
  applyMiddleware(sagaMiddleware, customMiddleware)
)
sagaMiddleware.run(mySaga)
