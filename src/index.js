import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRedux from 'react-redux'

console.log('VIJ', 'React', React)
console.log('VIJ', 'ReactDOM', ReactDOM)
console.log('VIJ', 'ReactRedux', ReactRedux)

const { Component, PureComponent, Fragment } = React
const { render } = ReactDOM
const { connect, Provider } = ReactRedux

import * as ThumbsUp from 'thumbsup'

console.log('VIJ', 'ThumbsUp', ThumbsUp)

const { withThumbsupGettersAndSetters } = ThumbsUp

import Mappings from './mappings'
import * as Events from './events'
import * as LocalStore from './store'

console.log('VIJ', 'Mappings', Mappings)
console.log('VIJ', 'Events', Events)
console.log('VIJ', 'Store', Store)

const { GlobalStore } = LocalStore

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

//import Relay from 'react-relay'
/*
Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({ schema })
)
*/

import './../styles/index.scss'

const title = 'My Minimal React Webpack Babel Setup'

const GifsComponent = withThumbsupGettersAndSetters(class extends PureComponent {
  render() {
    let rawState = this.state
    let rawGifs = rawState.gifs

    if (!rawGifs || !rawGifs.data) return null

    const { numCols, numRows } = this.props

    console.log('VIJ', 'GifsComponent', 'render', { rawGifs, rawState, numCols, numRows })

    let gifsData = rawGifs.data

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
        console.log('VIJ', 'render', { gifIdx, length: gifsData })

        if (gifIdx < gifsData.length) {
          colDivs.push(<div className="GifsComponent__square"><img className="GifsComponent__square__img" src={gifsData[gifIdx].images.fixed_width.url}/></div>)
        } else {
          breakAll = true
          break
        }
      }

      rowDivs.push(<div key={i} className="GifsComponent__row">{colDivs}</div>)

      if (breakAll) {
        console.log('VIJ', 'render', { breakAll })
        break
      }
    }

    console.log('VIJ', 'render', { rowDivs })

    return (
      <div className="GifsComponent">
        {rowDivs}
      </div>
    )
  }
}, GlobalStore, Mappings)

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
    console.log('VIJ', 'ControlPanel', 'render')
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
}, GlobalStore, Mappings)

const AppContainer = withThumbsupGettersAndSetters(class extends PureComponent {
  render() {  
    const { state } = this
    console.log('VIJ', 'AppContainer', 'render')
    return (
      <Fragment>
        <ControlPanel/>
        <GifsComponent
          numCols={state.numCols} 
          numRows={state.numRows}
        />
        <PresentationalComponent 
          numCols={state.numCols} 
          numRows={state.numRows}
        />
      </Fragment>
    )
  }
}, GlobalStore, Mappings)

const RelayContainer = class extends PureComponent {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query srcQuery {
            users {
              id
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
          return <div>{props.users[0].id}</div>
        }}
      />
    )
  }
}

render(
  <RelayContainer/>,
  document.getElementById('app')
)
/*
render(
  <Provider store={GlobalStore}>
    <AppContainer/>
  </Provider>,
  document.getElementById('app')
)
*/

/*
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
*/

module.hot.accept();
