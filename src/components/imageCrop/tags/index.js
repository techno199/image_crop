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
    let tags = Object.keys(TagTypes).map(type => TagTypes[type])
    
    return (
      <div {...other}>
        {
          tags.map(type => (
            <Tag 
              key={type}
              type={type}
              isHighlighted={isDragging}
            />
          ))
        }
      </div>
    )
  }
}

const TagsStyled = withStyles(styles)(Tags)

export { TagsStyled as Tags }
