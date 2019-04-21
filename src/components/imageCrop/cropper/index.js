import React, { useRef, useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { SelectionArea } from '../selectionArea';
import update from 'immutability-helper'
import { fixedMoveAreaOffset } from './moveArea';
import { resizeArea } from './resizeArea';

const styles = {
  img: {
    userSelect: 'none'
  },
  imgFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    cursor: 'crosshair'
  }
}

const Cropper = ({
  classes,
  width,
  height,
  rotationDegree,
  imgSrc,
  areaTop,
  areaLeft,
  areaWidth,
  areaHeight,
  onRectUpdate,
  onFadedSpaceClick,
  onDrawArea,
  onDrawAreaEnd,
  onAreaUpdate
}) => {
  // image ref
  const imgRef = useRef(null)

  const handleMouseDown = e => {
    e.preventDefault()
    let drawState = {
      initClientX: e.clientX,
      initClientY: e.clientY,
      isDrawingAllowed: false
    }

    const _onMouseMove = e => {
      if (
        Math.abs(e.clientX - drawState.initClientX) > 4 &&
        Math.abs(e.clientY - drawState.initClientY) > 4
      ) 
        drawState = (update(drawState, { isDrawingAllowed: { $set: true }}))
      if (drawState.isDrawingAllowed) {
        let rect = imgRef.current.getBoundingClientRect()
        // Fix absolute offset to always be inside container
        let clientX = e.clientX - rect.left
        let clientY = e.clientY - rect.top
        if (clientX < 0)
          clientX = 0
        else if (clientX > width)
          clientX = width
        if (clientY < 0)
          clientY = 0
        else if (clientY > height)
          clientY = height
        onDrawArea &&
          onDrawArea({
            initClientX: drawState.initClientX - rect.left,
            initClientY: drawState.initClientY - rect.top,
            clientX,
            clientY
          })
        }
    }

    const _onMouseUp = e => {
      document.removeEventListener('mousemove', _onMouseMove)
      document.removeEventListener('mouseup', _onMouseUp)
      if (!drawState.isDrawingAllowed) {
        let rect = imgRef.current.getBoundingClientRect()
        onFadedSpaceClick &&
          onFadedSpaceClick({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          })
      }
      else {
        onDrawAreaEnd &&
          onDrawAreaEnd(e)
      }
    }

    document.addEventListener('mousemove', _onMouseMove)
    document.addEventListener('mouseup', _onMouseUp)
  }

  const handleHover = useCallback(
    ({
      item,
      initClientOffset,
      currentClientOffset
    }) => {
      let fixedOffset = fixedMoveAreaOffset({
        width,
        height,
        item,
        initClientOffset,
        currentClientOffset,
        imgRef
      })
      onAreaUpdate({
        top: fixedOffset.top,
        left: fixedOffset.left
      })
    }
  )

  const handleTagDrag = useCallback(({
      item,
      currentClientOffset
    }) => {
      resizeArea({
        areaTop,
        areaLeft,
        areaHeight,
        areaWidth,
        width,
        height,
        imgRef,
        item,
        currentClientOffset,
        onAreaUpdate
      })
    }
  )
  // Update image ref on every new image
  useEffect(() => {
    return () => {
      if (imgRef.current) {
        onRectUpdate &&
          onRectUpdate(imgRef)
      }
    };
  }, [imgRef.current])
  // Custom styles
  const innerImageContainerStyle = {
    transform: `rotate(${rotationDegree}deg)`,
    width,
    height
  }
  const imgStyle = {
    width,
    height
  }
  
  return (
    <div style={innerImageContainerStyle}>
      <img
        style={imgStyle}
        className={classes.img}
        src={imgSrc}
        ref={imgRef} 
        alt='Preview' 
        draggable={false}
      />
      <div 
        className={classes.imgFade} 
        onMouseDown={handleMouseDown}
        draggable={false}
      />
      <SelectionArea
        className={classes.area}
        top={areaTop}
        left={areaLeft}
        width={areaWidth}
        height={areaHeight}
        imgWidth={width}
        imgHeight={height}
        src={imgSrc}
        onHover={handleHover}
        handleTagDrag={handleTagDrag}
      />
    </div>
  )
}

const CropperStyled = withStyles(styles)(Cropper)

export { CropperStyled as Cropper }

Cropper.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationDegree: PropTypes.number.isRequired,
  imgSrc: PropTypes.string.isRequired,
  onImageClick: PropTypes.func,
  areaTop: PropTypes.number.isRequired,
  areaLeft: PropTypes.number.isRequired,
  areaWidth: PropTypes.number.isRequired,
  areaHeight: PropTypes.number.isRequired,
  /** Image reference */
  imgRef: PropTypes.object.isRequired,
  onRectUpdate: PropTypes.func,
  /** Called each time area is updated */
  onAreaUpdate: PropTypes.func.isRequired,
  /** Called when empty faded point is clicked. Returns {x, y} absolute coordinates */
  onFadedSpaceClick: PropTypes.func,
  /** Called during drawing area */
  onDrawArea: PropTypes.func,
  /** Called when drawing area is finished */
  onDrawAreaEnd: PropTypes.func,
}