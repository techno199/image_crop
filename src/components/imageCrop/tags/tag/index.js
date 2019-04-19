import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TagTypes, movePreview } from '../../../../helpers';
import withStyles from 'react-jss'
import classNames from 'classnames'

export const TAG_WIDTH = 10

const styles = {
  root: {
    width: TAG_WIDTH,
    height: TAG_WIDTH,
    backgroundColor: '#f2f2f2',
    opacity: 0.3,
    position: 'absolute',
    transition: '.1s'
  },
  nw: {
    top: -TAG_WIDTH / 2,
    left: -TAG_WIDTH / 2,
    cursor: 'nw-resize'
  },
  n: {
    top: - TAG_WIDTH / 2,
    left: `calc(50% - ${TAG_WIDTH / 2}px)`,
    cursor: 'n-resize'
  },
  ne: {
    top: -TAG_WIDTH / 2,
    left: `calc(100% - ${TAG_WIDTH / 2}px)`,
    cursor: 'ne-resize'
  },
  e: {
    top: `calc(50% - ${TAG_WIDTH / 2}px)`,
    left: `calc(100% - ${TAG_WIDTH / 2}px)`,
    cursor: 'e-resize'
  },
  se: {
    top: `calc(100% - ${TAG_WIDTH / 2}px)`,
    left: `calc(100% - ${TAG_WIDTH / 2}px)`,
    cursor: 'se-resize'
  },
  s: {
    top: `calc(100% - ${TAG_WIDTH / 2}px)`,
    left: `calc(50% - ${TAG_WIDTH / 2}px)`,
    cursor: 's-resize'
  },
  sw: {
    top: `calc(100% - ${TAG_WIDTH / 2}px)`,
    left: -TAG_WIDTH / 2,
    cursor: 'sw-resize'
  },
  w: {
    top: `calc(50% - ${TAG_WIDTH / 2}px)`,
    left: -TAG_WIDTH / 2,
    cursor: 'w-resize'
  }
}

class Tag extends Component {
  static propTypes = {
    classes: PropTypes.object,
    /** Defines tag type */
    type: PropTypes.string.isRequired,
    /** Highlight square */
    isHighlighted: PropTypes.bool,
    /** Drag callback */
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func
  }

  state = {
    tagName: '',
    item: null,
    initClientOffset: null
  }

  componentDidMount = () => {
    switch (this.props.type){
      case TagTypes.NW:
        this.setState({
          tagName: this.props.classes.nw
        })
        break
      case TagTypes.N:
        this.setState({
          tagName: this.props.classes.n
        })
        break
      case TagTypes.NE:
        this.setState({
          tagName: this.props.classes.ne
        })
        break
      case TagTypes.E:
        this.setState({
          tagName: this.props.classes.e
        })
        break
      case TagTypes.SE:
        this.setState({
          tagName: this.props.classes.se
        })
        break
      case TagTypes.S:
        this.setState({
          tagName: this.props.classes.s
        })
        break
      case TagTypes.SW:
        this.setState({
          tagName: this.props.classes.sw
        })
        break
      case TagTypes.W:
        this.setState({
          tagName: this.props.classes.w
        })
        break
      default: 
        break
    }
  }

  handleDrag = e => {
    const currentClientOffset = {
      x: e.clientX,
      y: e.clientY
    }
    // It returns {0, 0} at last tick
    // so we ignore it
    if (
      currentClientOffset.x === 0 &&
      currentClientOffset.y === 0
    ) return

    this.props.onDrag &&
      this.props.onDrag({
        initClientOffset: this.state.initClientOffset,
        currentClientOffset,
        item: this.state.item
      })
  }

  handleDragStart = e => {
    e.dataTransfer.setDragImage(movePreview, 0, 0)
    let item = {
      type: this.props.type
    }
    this.setState({
      initClientOffset: {
        x: e.clientX,
        y: e.clientY
      },
      item
    })
    this.props.onDragStart &&
      this.props.onDragStart(e)
  }

  handleDragEnd = e => {
    this.props.onDragEnd &&
      this.props.onDragEnd(e)
  }

  render() {
    const { 
      classes,
      isHighlighted,
    } = this.props
    // Replace default stab with empty image
    let hightlightStyle
    if (isHighlighted)
      hightlightStyle = {
        opacity: .7
      }
    
    return (
      <div
        className={classNames([classes.root, this.state.tagName])}
        style={hightlightStyle}
        onDrag={this.handleDrag}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    )
  }
}

const TagStyled = withStyles(styles)(Tag)

export { TagStyled as Tag }
