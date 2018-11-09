import PropTypes from 'prop-types'
import React from 'react'

export default class Gifs extends PureComponent {
  render() {
    let rawState = this.state
    let rawGifs = rawState.gifs

    if (!rawGifs || !rawGifs.data) return null

    const { numCols, numRows } = this.props

    console.log('VIJ', 'render', { rawGifs, rawState, numCols, numRows })

    let gifsData = rawGifs.data

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
}

