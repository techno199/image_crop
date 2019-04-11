import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import classNames from 'classnames'

const styles = {
  root: {
    backgroundColor: '#fff',
    borderRadius: 4,
    color: '#000',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
  }
}

class Paper extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const { 
      children,
      classes,
      className,
      ...other
    } = this.props
    
    return (
      <div className={classNames([classes.root, className])} {...other}>
        <React.Fragment>
          {children}
        </React.Fragment>
      </div>
    )
  }
}

const PaperStyled = withStyles(styles)(Paper)

export { PaperStyled as Paper }