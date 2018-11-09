import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRedux from 'react-redux'
console.log('VJ', 'requiredPath', require.resolve('react-redux'))

const { Component, PureComponent, Fragment } = React
const { render } = ReactDOM
const { connect, Provider } = ReactRedux

//import * as ThumbsUp from 'thumbsup'
const thumbUpWithGettersAndSetters = (WrappedComponent, storeRef = null, registeredSchema = null) => {

  const accessedStateHash = {}
  let isFirstMapStateToPropsCall = true
  
  let renderCount = 0

  let remoteState = {}
  let localState = {
    increment: (key) => {
      console.log('VJ', 'localState->increment', { key })
      storeRef.dispatch({ type: `SET_${key}`, value: ++(storeState.nonApiReducer[key]) })
    },
    decrement: (key) => {
      console.log('VJ', 'localState->decrement', { key })
      storeRef.dispatch({ type: `SET_${key}`, value: --(storeState.nonApiReducer[key]) })
    },
    set: (key, value) => {
      console.log('VJ', 'localState->set', { key }, storeState.nonApiReducer[key])
      storeRef.dispatch({ type: `SET_${key}`, value })
    }
  }

  function addStoreProxy(storeRef) {
    const storeState = storeRef.getState()

    for (const [key, value] of Object.entries(storeState.nonApiReducer)) {
      console.log('VJ', 'addStoreProxy', `${key} == ${value}`)
      Object.defineProperty(localState, key, {
        set: (x) => {
          if (!accessedStateHash[key]) {
            accessedStateHash[key] = true
            storeRef.dispatch({ type: 'UPDATE' })
          }
          console.log('VJ', 'addStoreProxy->setting', `${key} <= ${x}`)
          storeRef.dispatch({ type: `SET_${key}`, value: x })
        },
        get: () => {
          if (!accessedStateHash[key]) {
            accessedStateHash[key] = true
            storeRef.dispatch({ type: 'UPDATE' })
            console.log('VIJ', 'addStoreProxy->getting', `${key}: ${storeState.nonApiReducer[key]}`, 'for', WrappedComponent.name)
          }
          return storeState.nonApiReducer[key]
        }
      })
    }
  }

  function updateReducer(storeRef) {
    const storeState = storeRef.getState()

    const thumbUpReducer = (previousState, action) => {
      for (const [key, value] of Object.entries(storeState.nonApiReducer)) {
        if (action.type === `SET_${key}`) {
          previousState['nonApiReducer'][key] = action.value
          break
        }
      }
      const nextState = Object.assign({}, previousState)
      //console.log('VJ', 'thumbUpReducer', { previousState, action, nextState })
      return nextState
    }
    storeRef.replaceReducer(thumbUpReducer) // triggers a re-render
  }

  const ThumbUpComponent = class extends Component {
    constructor(props) {
      super(props)

      const storeState = storeRef.getState()
      //console.log('VIJ', 'localState->constructor', WrappedComponent.name, { storeState })

      WrappedComponent.prototype.remoteState = remoteState
      WrappedComponent.prototype.localState = {
        increment: (key) => {
          console.log('VJ', 'localState->increment', { key })
          storeRef.dispatch({ type: `SET_${key}`, value: ++(storeState.nonApiReducer[key]) })
        },
        decrement: (key) => {
          console.log('VJ', 'localState->decrement', { key })
          storeRef.dispatch({ type: `SET_${key}`, value: --(storeState.nonApiReducer[key]) })
        },
        set: (key, value) => {
          console.log('VJ', 'localState->set', { key }, storeState.nonApiReducer[key])
          storeRef.dispatch({ type: `SET_${key}`, value })
        }
      }

      addStoreProxy(storeRef)
      updateReducer(storeRef)
    }

    render() {
      renderCount++

      const smartComponent = React.createElement(WrappedComponent, this.props, this.props.children) 
      console.log('VIJ', 'ThumbUpComponent->render', { WrappedComponent, smartComponent }, { renderCount, accessedStateHash })

      /*
      return (
        <WrappedComponent
          {...this.props}>
          {this.props.children}
        </WrappedComponent>
      )
      */
      return smartComponent
    }
  }

  return connect(
    function mapStateToProps(state) {
      console.log('VIJ', 'mapStateToProps', 'for', WrappedComponent.name, { state, accessedStateHash, isFirstMapStateToPropsCall, renderCount, hashLength: Object.keys(accessedStateHash).length })

      let returnedStore = {}
      if (Object.keys(accessedStateHash).length === 0) {
        //returnedStore = state.nonApiReducer
        returnedStore = { numRows: 0 }
        isFirstMapStateToPropsCall = false
      } else {
        Object.keys(accessedStateHash).forEach(key => {
          returnedStore[key] = state.nonApiReducer[key]
        })
      }

      console.log('VIJ', 'mapStateToProps', 'for', WrappedComponent.name, { returnedStore })

      return {
        _store: returnedStore
      }
    },
    function mapDispatchToProps(dispatch) {
      console.log('VJ', 'mapDispatchToProps', 'for', WrappedComponent.name, { dispatch })
      return {
        //actions: bindActionCreators(actionCreators, dispatch)
      }
    }
  )(ThumbUpComponent)

}

import Mappings from './mappings'
import * as Events from './events'
import * as RootStore from './store'

const { GlobalStore } = RootStore

/*
import {
  Environment,
  RecordSource,
  Store
} from 'relay-runtime'
import { 
  graphql,
  QueryRenderer
} from 'react-relay'
import { Network } from 'relay-local-schema'
import schema from './graphql/schema'
const environment = new Environment({
  network: Network.create({ schema }),
  store: new Store(new RecordSource()),
})
*/



import './../styles/index.scss'



const GifsComponent = thumbUpWithGettersAndSetters(class GifsComponent extends PureComponent {
  componentDidMount() {
    console.log('VIJ', 'componentDidMount', 'GifsComponent')
  }

  render() {
    let { gifs } = this.remoteState

    console.log('VIJ', 'render', 'GifsComponent', { remoteState: this.remoteState, localState: this.localState })

    if (!gifs || !gifs.data) return null

    const { numCols, numRows } = this.localState

    let gifsData = gifs.data

    /*
    let gifs = []
    for (let j=0; j<gifsData.length; j++) {
      gifs.push(<div className="GifsComponent__square"><img src={gifsData[j].images.fixed_width.url}/></div>)
    }
    */

    let rowDivs = []
    let breakAll = false

    for (let i=0; i<numRows; i++) {
      let colDivs = []

      for (let j=0; j<numCols; j++) {
        let gifIdx = (i*numCols) + j

        if (gifIdx < gifsData.length) {
          colDivs.push(<div className="GifsComponent__square"><img className="GifsComponent__square__img" src={gifsData[gifIdx].images.fixed_width.url}/></div>)
        } else {
          breakAll = true
          break
        }
      }

      rowDivs.push(<div key={i} className="GifsComponent__row">{colDivs}</div>)

      if (breakAll) {
        console.log('VJ', 'render', { breakAll })
        break
      }
    }

    return (
      <div className="GifsComponent">
        {rowDivs}
      </div>
    )
  }
}, GlobalStore, Mappings)



class CirclesComponent extends PureComponent {
  componentDidMount() {
    console.log('VIJ', 'componentDidMount', 'CirclesComponent')
  }

  render() {
    const { numCols, numRows } = this.props
    console.log('VIJ', 'render', 'CirclesComponent', { props: this.props })
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



const ControlPanel = thumbUpWithGettersAndSetters(class ControlPanel extends PureComponent {
  componentDidMount() {
    console.log('VIJ', 'componentDidMount', 'ControlPanel')
  }

  decrementNumCols() { // decrement('localState', 'numCols')
    this.localState.decrement('numCols')
  }
  incrementNumCols() { // increment('localState', 'numCols')
    //this.localState.numCols = this.localState.numCols + 1
    this.localState.increment('numCols')
  }

  decrementNumRows() { // decrement('localState', 'numRows')
    this.localState.decrement('numRows')
  }
  incrementNumRows() { // increment('localState', 'numRows')
    this.localState.increment('numRows')
  }

  onQueryChange(ev) { // setFromEvent('localState', 'queryInput')
    console.log('VJ', 'onQueryChange', { value: ev.target.value })
    this.localState.set('queryInput', ev.target.value)
  }
  submitQuery(ev) { // setAndCommit('localState', 'query')
    console.log('VJ', 'submitQuery', { value: this.localState.queryInput })
    this.localState.set('queryInput', this.localState.queryInput)
  }

  render() {
    console.log('VIJ', 'render', 'ControlPanel', { localState: this.localState })
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
          <button onClick={(ev) => this.submitQuery(ev)}>Search for {this.localState.queryInput}</button>
        </div>
      </div>
    )
  }
}, GlobalStore, Mappings)



const AppContainer = thumbUpWithGettersAndSetters(class AppContainer extends PureComponent {
  componentDidMount() {
    console.log('VIJ', 'componentDidMount', 'AppContainer')
  }

  render() {  
    //const { localState, globalState } = this
    //console.log('VIJ', 'render', 'AppContainer', { localState, globalState })
    //const { localState, globalState } = this
    console.log('VJ', 'render', 'AppContainer', { props: this.props })
    return (
      <Fragment>
        <ControlPanel/>
        <CirclesComponent 
          //numCols={localState.numCols} 
          //numRows={localState.numRows}
        />
      </Fragment>
    )
  }
}, GlobalStore, Mappings)



render(
  <Provider store={GlobalStore}>
    <AppContainer/>
  </Provider>,
  document.getElementById('app')
)

/*
const RelayContainer = class extends PureComponent {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query srcQuery {
            users {
              id
              email
              displayName
              photoURL 
              uid 
              providerID
              phoneNumber 
            }
          }
        `}
        variables={{}}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>
          }
          if (!props) {
            return <div>Loading...</div>
          }

          console.log('VJ', 'render', { users: props.users })

          let ret = (<div>
            <div>{props.users[0].id}</div>
            <div>{props.users[0].email}</div>
            <div>{props.users[0].displayName}</div>
            <div>{props.users[0].photoURL}</div>
            <div>{props.users[0].uid}</div>
            <div>{props.users[0].providerID}</div>
            <div>{props.users[0].phoneNumber}</div>
          </div>)

          return ret
        }}
      />
    )
  }
}

render(
  <RelayContainer/>,
  document.getElementById('app')
)
*/

module.hot.accept();
