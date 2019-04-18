import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../../../helpers';
import withStyles from 'react-jss'
import classNames from 'classnames'
import { getEmptyImage } from 'react-dnd-html5-backend'
import update from 'immutability-helper'

export const TAG_WIDTH = 10

const styles = {
  root: {
    width: TAG_WIDTH,
    height: TAG_WIDTH,
    backgroundColor: '#f2f2f2',
    opacity: 0.3,
    position: 'absolute',
    transition: '.1s'
  }
}

class Tag extends Component {
  static propTypes = {
    classes: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    className: PropTypes.object,
    /** Defines tag type */
    type: PropTypes.string.isRequired,
    /** Highlight square */
    isHighlighted: PropTypes.bool
  }

  render() {
    const { 
      connectDragSource,
      connectDragPreview,
      className,
      classes,
      style,
      isHighlighted
    } = this.props
    
    connectDragPreview(getEmptyImage())
    let tagStyle = isHighlighted ? {
      opacity: .7
    } : { }
    return connectDragSource(
      <div
        className={classNames([classes.root, className])}
        style={update(style, {$merge: tagStyle})}
      />
    )
  }
}

const TagHOC = DragSource(
  ItemTypes.TAG,
  {
    beginDrag: props => {
      return {
        type: props.type
      }
    }
  },
  connect => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  })
)(Tag)

const TagStyled = withStyles(styles)(TagHOC)

export { TagStyled as Tag }
