import React, { useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { SelectionArea } from '../selectionArea';
import { Tags } from '../tags';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../../helpers';
import { moveArea } from './moveArea';
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
  connectDropTarget,
  isOver,
  onFadedSpaceClick,
  onAreaUpdate
}) => {
  // image ref
  const imgRef = useRef(null)

  /**Occurs on faded cropper part clicked */
  const handleFadeClick = useCallback(
    (e) => {
      let rect = imgRef.current.getBoundingClientRect()
      onFadedSpaceClick &&
        onFadedSpaceClick({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
    }
  )

  const handleHover = useCallback(
    ({
      width,
      height,
      item,
      initClientOffset,
      currentClientOffset
    }) => {
      moveArea({
        onAreaUpdate,
        width,
        height,
        item,
        initClientOffset,
        currentClientOffset,
        imgRef
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
  
  return connectDropTarget(
    <div style={innerImageContainerStyle}>
      <img
        style={imgStyle}
        className={classes.img}
        src={imgSrc}
        ref={imgRef} 
        alt='Preview' 
      />
      <div 
        className={classes.imgFade} 
        onClick={handleFadeClick}
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
      >
        <Tags 
          width={areaWidth}
          height={areaHeight}
          isDragging={isOver}
        />
      </SelectionArea>
    </div>
  )
}

const CropperHOC = DropTarget(
  [
    ItemTypes.BOX,
    ItemTypes.TAG
  ],
  {
    hover: (props, monitor) => {
      switch (monitor.getItemType()) {
        case ItemTypes.TAG: {
          resizeArea(props, monitor)
        }
        default:
          break;
      }
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })
)(Cropper)

const CropperStyled = withStyles(styles)(CropperHOC)

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
  onFadedSpaceClick: PropTypes.func
}