import React, { useRef, useEffect } from 'react'
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
    opacity: 0.7
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
  onImageClick,
  onRectUpdate,
  connectDropTarget,
  isOver
}) => {
  // image ref
  const imgRef = useRef(null)

  const handleImageClick = e => {
    onImageClick &&
      onImageClick(e)
  }
  // Fire callback each time we receive new valid rectangle
  useEffect(() => {
    return () => {
      let rect
      if (imgRef.current) {
        rect = imgRef.current.getBoundingClientRect()
        onRectUpdate &&
          onRectUpdate(rect)
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
        onClick={handleImageClick}
      />
      <div className={classes.imgFade} />
      <SelectionArea
        className={classes.area}
        top={areaTop}
        left={areaLeft}
        width={areaWidth}
        height={areaHeight}
        imgWidth={width}
        imgHeight={height}
        src={imgSrc}
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
      if (!props.rect) return
      switch (monitor.getItemType()) {
        case ItemTypes.BOX:
            moveArea(props, monitor)
          break;
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
  rect: PropTypes.object,
  onRectUpdate: PropTypes.func,
  /** Called each time area is updated */
  onAreaUpdate: PropTypes.func.isRequired
}