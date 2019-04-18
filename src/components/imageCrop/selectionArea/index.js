import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { ItemTypes } from '../../../helpers';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import classNames from 'classnames'
import update from 'immutability-helper'

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
    bottom: 0
  }
}

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
    imgHeight: PropTypes.number.isRequired
  }

  areaRef = React.createRef()

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

    connectDragPreview(getEmptyImage())

    return connectDragSource(
      <div 
        style={areaStyles}
        className={classNames([classes.root, className])}
        ref={this.areaRef}
        {...other}
      >
        <div className={classes.imgWrap}>
          <img 
            style={imgStyles}
            src={src}
          />
        </div>
        {this.props.children}
      </div>
    )
  }
}

const SelectionAreaHOC = DragSource(
  ItemTypes.BOX,
  {
    beginDrag: (props, monitor, component) => {
      let rect = component.areaRef.current.getBoundingClientRect()
      return {
        top: rect.top,
        right: rect.right,
        left: rect.left,
        bottom: rect.bottom,
        width: props.width,
        height: props.height,

      }
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  })
)(SelectionArea)

const SelectionAreaStyled = withStyles(styles)(SelectionAreaHOC)

export { SelectionAreaStyled as SelectionArea }