import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { movePreview } from '../../../helpers';
import classNames from 'classnames'

const styles = {
  root: {
    position: 'absolute',
    cursor: 'move'
  },
  imgWrap: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    userSelect: 'none'
  }
}

const getDefaultState = () => ({
  initClientOffset: {
    x: null,
    y: null
  },
  item: {
    top: null,
    right: null,
    bottom: null,
    left: null,
    height: null,
    width: null
  }
})

class SelectionArea extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    /** Describes absolute top offset */
    top: PropTypes.number.isRequired,
    /** Describes absolute left offset */
    left: PropTypes.number.isRequired,
    /** Area width */
    width: PropTypes.number.isRequired,
    /** Area height */
    height: PropTypes.number.isRequired,
    /** Classes to be merged */
    className: PropTypes.string,
    /** Image source */
    src: PropTypes.string.isRequired,
    /** Image width */
    imgWidth: PropTypes.number.isRequired,
    /** Image height */
    imgHeight: PropTypes.number.isRequired,
    onHover: PropTypes.func
  }

  state = getDefaultState()
  areaRef = React.createRef()

  handleMouseDown = e => {
    e.preventDefault()
    let rect = this.areaRef.current.getBoundingClientRect()

    let item = {
      top: rect.top,
      right: rect.right,
      left: rect.left,
      bottom: rect.bottom,
      width: this.props.width,
      height: this.props.height
    }
    

    this.setState({
      initClientOffset: {
        x: e.clientX,
        y: e.clientY
      },
      item
    })

    document.addEventListener('mousemove', this._onMouseMove)
    document.addEventListener('mouseup', this._onMouseUp)
  }

  _onMouseMove = e => {
    const currentClientOffset = {
      x: e.clientX,
      y: e.clientY
    }

    this.props.onHover &&
      this.props.onHover({
        initClientOffset: this.state.initClientOffset,
        currentClientOffset,
        item: this.state.item
      })
  }

  _onMouseUp = e => {
    document.removeEventListener('mousemove', this._onMouseMove)
    document.removeEventListener('mouseup', this._onMouseUp)
  }

  render() {
    const { 
      top,
      left,
      width,
      height,
      classes,
      connectDragPreview,
      connectDragSource,
      className,
      src,
      imgWidth,
      imgHeight,
      onHover,
      ...other
     } = this.props

    const areaStyles = {
      top,
      left,
      width,
      height
    }
    const imgStyles = {
      width: imgWidth,
      height: imgHeight,
      marginTop: -top,
      marginLeft: -left,
    }

    return (
      <div 
        style={areaStyles}
        className={classNames([classes.root, className])}
        ref={this.areaRef}
        draggable={false}
        {...other}
      >
        <div className={classes.imgWrap}>
          <img 
            style={imgStyles}
            src={src}
            draggable={false}
            onMouseDown={this.handleMouseDown}
            alt=''
          />
        </div>
        {this.props.children}
      </div>
    )
  }
}

const SelectionAreaStyled = withStyles(styles)(SelectionArea)

export { SelectionAreaStyled as SelectionArea }