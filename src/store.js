import * as Redux from 'redux'
import * as ReduxSaga from 'redux-saga' 
import { reducer as beesReducer, middleware as beesMiddleware } from 'redux-bees'

const { 
  createStore, 
  combineReducers, 
  bindActionCreators, 
  compose, 
  applyMiddleware } = Redux
/*
const { 
  reducer,
  middleware
} = ReduxBees
*/
//console.log('VJ', 'store.js', { beesReducer, beesMiddleware })
const { 
  call, 
  put, 
  takeOnly, 
  takeEvery, 
  takeLatest, 
  all, 
  spawn, 
  take 
} = ReduxSaga.effects
const createSagaMiddleware = ReduxSaga.default

const initialState = {
  nonApiReducer: {
    numCols: 7,
    numRows: 3,
    gifs: [],
    queryInput: '',
    query: ''
  }
}

/*
export const Actions = {
  SET_GIFS: 'SET_GIFS'
}
*/

const initialReducer = (state = initialState, action) => {
  console.log('VJ', 'initialReducer', action)
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
  console.log('VJ', 'customMiddleware', action)
  next(action)
}

function* childSaga() {
  while(true) {
    const action = yield take(act => {
      return act.value
    })
    console.log('VJ', 'childSaga', action)
  }
}
function* mySaga() {
  console.log('VJ', 'mySaga')
  yield all([
    call(childSaga),
  ])
}

export const GlobalStore = createStore(
  combineReducers({ nonApiReducer: initialReducer, beesReducer }),
  initialState,
  applyMiddleware(beesMiddleware(), sagaMiddleware, customMiddleware)
)
sagaMiddleware.run(mySaga)
