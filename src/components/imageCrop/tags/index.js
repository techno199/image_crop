import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { TagTypes } from '../../../helpers';
import { Tag } from './tag';

const styles = {

}

class Tags extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    /** Selected area width */
    width: PropTypes.number.isRequired,
    /** Selected area height */
    height: PropTypes.number.isRequired,
    /** Tag dragging callback */
    onTagDrag: PropTypes.func,
    onTagDragStart: PropTypes.func,
    onTagDragEnd: PropTypes.func
  }

  shouldComponentUpdate = nextProps => {
    // Huge performance improvement
    if (
      this.props.width === nextProps.width &&
      this.props.height === nextProps.height &&
      this.props.isDragging === nextProps.isDragging
    ) return false
    return true
  }

  handleTagDrag = e => {
    this.props.onTagDrag &&
      this.props.onTagDrag(e)
  }

  handleTagDragEnd = () => {
    this.props.onTagDragEnd &&
      this.props.onTagDragEnd()
  }

  handleTagDragStart = () => {
    this.props.onTagDragStart &&
      this.props.onTagDragStart()
  }

  render() {
    const { 
      isDragging
    } = this.props
    let tags = Object.keys(TagTypes.types).map(type => TagTypes.types[type])
  
    return (
      <div>
        {
          tags.map(type => (
            <Tag 
              key={type}
              type={type}
              isHighlighted={isDragging}
              onDrag={this.handleTagDrag}
              onDragStart={this.handleTagDragStart}
              onDragEnd={this.handleTagDragEnd}
            />
          ))
        }
      </div>
    )
  }
}

const TagsStyled = withStyles(styles)(Tags)

export { TagsStyled as Tags }
