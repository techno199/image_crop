import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'

const styles = {
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}

class Modal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    /**Occurs when modal background is clicked */
    onOuterClick: PropTypes.func
  }

  backgroundRef = React.createRef()

  handleOuterClick = e => {
    if (e.target === this.backgroundRef.current) {
      this.props.onOuterClick &&
        this.props.onOuterClick(e)
    } 
  }

  render() {
    const { classes, children, open } = this.props
    return (
      <div 
        ref={this.backgroundRef}
        hidden={!open} 
        className={classes.root} 
        onClick={this.handleOuterClick}
      >
        {children}
      </div>
    )
  }
}

const ModalStyled = withStyles(styles)(Modal)

export { ModalStyled as Modal }