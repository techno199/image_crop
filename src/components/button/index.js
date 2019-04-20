import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import classNames from 'classnames'

const styles = {
  root: {
    outline: 'none',
    padding: '7px 16px 8px',
    backgroundColor: '#5181b8',
    color: '#fff',
    minWidth: 170,
    borderRadius: 4,
    fontSize: 12.5,
    display: 'flex',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: '#5b88bd'
    },
    '&:active': {
      backgroundColor: '#4872a3',
      paddingTop: 8,
      paddingBottom: 7
    }
  }
}

class Button extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const { 
      classes,
      children,
      className,
      ...other
     } = this.props

    return (
      <button
        className={classNames([classes.root, className])} 
        {...other}
      >
        {children}
      </button>
    )
  }
}

const ButtonStyled = withStyles(styles)(Button)

export { ButtonStyled as Button }