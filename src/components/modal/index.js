import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'

const styles = {
  root: {
    display: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: '100vh'
  }
}

class Modal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const { classes, children } = this.props
    return (
      <div className={classes.root}>
        {children}
      </div>
    )
  }
}

const ModalStyled = withStyles(styles)(Modal)

export { ModalStyled as Modal }