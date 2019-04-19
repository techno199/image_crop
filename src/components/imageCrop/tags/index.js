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
    onTagDrag: PropTypes.func
  }

  state = {
    isDragging: false
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // Huge performance improvement
    if (
      this.props.width === nextProps.width &&
      this.props.height === nextProps.height &&
      this.state.isDragging === nextState.isDragging
    ) return false
    return true
  }

  handleTagDrag = e => {
    this.props.onTagDrag &&
      this.props.onTagDrag(e)
  }

  handleTagDragEnd = e => {
    this.setState({
      isDragging: false
    })
  }

  handleTagDragStart = e => {
    this.setState({
      isDragging: true
    })
  }

  render() {
    const { 
      isDragging
    } = this.state
    let tags = Object.keys(TagTypes).map(type => TagTypes[type])
    
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
