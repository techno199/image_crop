import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'

const styles = {
  root: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, .7)',
    overflow: 'auto'
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
    const { 
      classes, 
      children, 
      open 
    } = this.props

    return open && (
      <div 
        ref={this.backgroundRef}
        className={classes.root} 
        onMouseDown={this.handleOuterClick}
      >
        {children}
      </div>
    )
  }
}

const ModalStyled = withStyles(styles)(Modal)

export { ModalStyled as Modal }