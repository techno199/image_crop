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

  handleMouseDown = e => {
    e.preventDefault()
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

    document.addEventListener('mousemove', this._onMouseMove)
    document.addEventListener('mouseup', this._onMouseUp)
  }

  _onMouseUp = e => {
    document.removeEventListener('mousemove', this._onMouseMove)
    document.removeEventListener('mouseup', this._onMouseUp)
    this.props.onDragEnd &&
      this.props.onDragEnd(e)
  }

  _onMouseMove = e => {
    const currentClientOffset = {
      x: e.clientX,
      y: e.clientY
    }

    this.props.onDrag &&
      this.props.onDrag({
        initClientOffset: this.state.initClientOffset,
        currentClientOffset,
        item: this.state.item
      })
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
        draggable={false}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      />
    )
  }
}

const TagStyled = withStyles(styles)(Tag)

export { TagStyled as Tag }
