import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import withStyles from 'react-jss'
import { DragSource } from 'react-dnd';
import { ItemTypes, TagTypes } from '../../../helpers';
import { Tag, TAG_WIDTH } from './tag';

const styles = {

}

class Tags extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    /** Selected area width */
    width: PropTypes.number.isRequired,
    /** Selected area height */
    height: PropTypes.number.isRequired,
    /** Hightlight squares when area is being dragged */
    isDragging: PropTypes.bool
  }

  shouldComponentUpdate = (nextProps) => {
    // Huge performance improvement
    if (
      this.props.width === nextProps.width &&
      this.props.height === nextProps.height &&
      this.props.isDragging === nextProps.isDragging
    ) return false
    return true
  }

  render() {
    const { 
      classes,
      className,
      width,
      height,
      connectDragSource,
      isDragging,
      ...other
    } = this.props
    let tags = [
      {
        type: TagTypes.NW,
        top: (- TAG_WIDTH / 2),
        left: (- TAG_WIDTH / 2),
        cursor: 'nw-resize'
      },
      {
        type: TagTypes.N,
        top: - TAG_WIDTH / 2,
        left: width / 2 - TAG_WIDTH / 2,
        cursor: 'n-resize'
      },
      {
        type: TagTypes.NE,
        top: - TAG_WIDTH / 2,
        left: width - TAG_WIDTH / 2,
        cursor: 'ne-resize'
      },
      {
        type: TagTypes.E,
        top: height / 2 - TAG_WIDTH / 2,
        left: width - TAG_WIDTH / 2,
        cursor: 'e-resize'
      },
      {
        type: TagTypes.SE,
        top: height - TAG_WIDTH / 2,
        left: width - TAG_WIDTH / 2,
        cursor: 'se-resize'
      },
      {
        type: TagTypes.S,
        top: height - TAG_WIDTH / 2,
        left: width / 2 - TAG_WIDTH / 2,
        cursor: 's-resize'
      },
      {
        type: TagTypes.SW,
        top: height - TAG_WIDTH / 2,
        left: - TAG_WIDTH / 2,
        cursor: 'sw-resize'
      },
      {
        type: TagTypes.W,
        top: height / 2 - TAG_WIDTH / 2,
        left: - TAG_WIDTH / 2,
        cursor: 'w-resize'
      }
    ]

    return (
      <div {...other}>
        {
          tags.map(({type, ...style}) => (
            <Tag 
              key={type}
              type={type}
              isHighlighted={isDragging}
              style={{...style}}
            />
          ))
        }
      </div>
    )
  }
}

const TagsStyled = withStyles(styles)(Tags)

export { TagsStyled as Tags }
