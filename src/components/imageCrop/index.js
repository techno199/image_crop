import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { Paper } from '../paper';
import { ReactComponent as RotateAntiClockwiseIcon } from '../../img/rotate_left.svg'
import { ReactComponent as RotateClockwiseIcon } from '../../img/rotate_right.svg'
import { Button } from '../button';
import styles from './imageCrop.styles'
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../helpers';
import { SelectionArea } from './selectionArea';

const MAX_IMAGE_DIMENSION_LENGHT = 604
const MIN_IMAGE_DIMENSION_LENGHT = 200

class ImageCrop extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func
  }

  state = {
    /** Defines whether image was loaded and processed */
    isImgSelected: false,
    /** Reference to image DOM */
    imgSrc: null,
    /** Current rotation level */
    imgRotationDegree: 0,
    /** Calculated width */
    resizedImageWidth: null,
    /** Calculated height */
    resizedImageHeight: null,
    area: {
      top: 0,
      left: 0,
      width: MIN_IMAGE_DIMENSION_LENGHT,
      height: MIN_IMAGE_DIMENSION_LENGHT,
    },
    imgContainer: {
      width: 0,
      height: 0
    }
  }
  // Component refs
  fileInputRef = React.createRef()
  imgRef = React.createRef()
  // Other props
  reader = new FileReader()
  image = new Image()

  componentDidMount = () => {
    // Process each next file loaded to reader
    this.reader.addEventListener('load', () => {
      // Load image to this.image in order to get original width and height
      this.image.src = this.reader.result

      // this.setState({
      //   imgSrc: this.reader.result
      // }) 
    }, false)

    // Process given image
    this.image.onload = (e) => {
      let originalWidth = this.image.width
      let originalHeight = this.image.height
      
      // Check image aspect ration rules on load
      if (
        originalWidth / originalHeight <= 0.25 ||
        originalWidth / originalHeight >= 3) {
        alert('Image aspect ration must follow next formula: 0.25 < ratio < 3')
        return
      }
      // Check image original width and height rules
      if (
        originalWidth < MIN_IMAGE_DIMENSION_LENGHT ||
        originalHeight < MIN_IMAGE_DIMENSION_LENGHT
      ) {
        alert('Image must be at least 200x200px')
      }
      // Resize exaggerated image
      let aspectRatio
      let resizedImageWidth
      let resizedImageHeight
      if (originalHeight > MAX_IMAGE_DIMENSION_LENGHT) {
        aspectRatio = originalHeight / MAX_IMAGE_DIMENSION_LENGHT
        resizedImageHeight = MAX_IMAGE_DIMENSION_LENGHT
        resizedImageWidth = originalWidth / aspectRatio
      }
      if (resizedImageWidth > MAX_IMAGE_DIMENSION_LENGHT) {
        aspectRatio = resizedImageWidth / MAX_IMAGE_DIMENSION_LENGHT
        resizedImageWidth = MAX_IMAGE_DIMENSION_LENGHT
        resizedImageHeight = resizedImageHeight / aspectRatio
      }
      this.setState({
        resizedImageWidth,
        resizedImageHeight,
        imgSrc: this.image.src,
        isImgSelected: true
      })
    }
  }

  /**
   * Converts loaded image to url and saves to state
   */
  handleSelectedImageChange = e => {
    let file = this.fileInputRef.current.files[0]

    if (file) {
      this.reader.readAsDataURL(file)
    }
  }

  /** Fires event on input[type='file'] when related button is clicked */
  handleSelectFileClick = e => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click()
    }
  }

  /** Transforms image for give degree diff */
  handleRotateClick = deltaDegree => () => {
    this.setState(oldState => ({
      imgRotationDegree: oldState.imgRotationDegree + deltaDegree
    }))
  }

  /** Update selected area properties*/
  updateArea = (area) => {
    this.setState(oldState => {
      let updatedArea = Object.assign(
        {}, 
        oldState.area, 
        area
      )

      return {
        area: updatedArea
      }
    })
  }
  
  handleImageClick = e => {
    console.log(e)
  }

  render() {
    const { 
      classes,
      title,
      connectDropTarget
    } = this.props

    const { 
      isImgSelected,
      imgSrc,
      imgRotationDegree,
      area,
      resizedImageHeight,
      resizedImageWidth
    } = this.state

    // Next code block ensures that image is being rotated 
    // and, if it is, adjusts margin of wrapper
    let imgWidthHeightDelta = 0
    if (this.imgRef.current) {
      let isRotated = Boolean((imgRotationDegree / 90) % 2)
      
      if (isRotated) {
        imgWidthHeightDelta = Math.abs(
          this.imgRef.current.clientWidth - 
          this.imgRef.current.clientHeight
        )
      }
    }

    let outerImageContainerStyle = {
      margin: `${imgWidthHeightDelta / 2 + 35}px auto`,
      width: resizedImageWidth,
      height: resizedImageHeight
    }
    let innerImageContainerStyle = {
      width: resizedImageWidth,
      height: resizedImageHeight
    }
    let imgStyle = {
      transform: `rotate(${imgRotationDegree}deg)`,
      width: resizedImageWidth,
      height: resizedImageHeight
    }
    let rotateClockStyle = { 
      right: imgWidthHeightDelta / 2 + 24,
      bottom: -imgWidthHeightDelta / 2 + 5
    }
    let rotateAntiClockStyle = {
      right: imgWidthHeightDelta / 2,
      bottom: -imgWidthHeightDelta / 2 + 5
    }

    return (
        <Paper className={classes.root}>
          <div className={classes.title}>
            {title}
          </div>
          <div className={classes.cropWrap}>
            {
              isImgSelected ? (
              <div>
                <div className={classes.descriptionWrap}>
                  Выберите область изображения
                </div>
                <div 
                  className={classes.outerImage}
                  style={outerImageContainerStyle}
                >
                  {
                    connectDropTarget(
                      <div 
                        className={classes.imgWrap}
                        style={innerImageContainerStyle}
                      >
                        <img
                          style={imgStyle}
                          className={classes.previewImage}
                          src={imgSrc}
                          ref={this.imgRef} 
                          alt='Preview' 
                          onClick={this.handleImageClick}
                        />
                        <SelectionArea
                          className={classes.area}
                          top={area.top}
                          left={area.left}
                          width={area.width}
                          height={area.height}
                          imgWidth={resizedImageWidth}
                          imgHeight={resizedImageHeight}
                          src={imgSrc}
                        />
                        <div className={classes.imgFade} />
                      </div>
                    )
                  }
                  <RotateAntiClockwiseIcon
                    style = {rotateClockStyle}
                    className={classes.rotateClockwise}
                    onClick={this.handleRotateClick(-90)}
                  />
                  <RotateClockwiseIcon
                    style = {rotateAntiClockStyle}
                    className={classes.rotateAntiClockwise}
                    onClick={this.handleRotateClick(90)}
                  />
                </div>
                <div className={classes.bottomLine} />
                <div className={classes.bottomButtonWrap}>
                  <Button className={classes.saveButton}>Сохранить</Button>
                </div>
              </div>
              ) : (
                <div>
                  <Button onClick={this.handleSelectFileClick}>
                    Выбрать файл
                  </Button>
                  <input 
                    ref={this.fileInputRef} 
                    className={classes.input}
                    type='file' 
                    onChange={this.handleSelectedImageChange} 
                  />
                </div>
              )
            }
          </div>
        </Paper>
    )
  }
}

const ImageCropHOC = DropTarget(
  ItemTypes.BOX,
  {
    hover: (props, monitor, component) => {
      // Get container data
      let containerNode = component.imgRef.current
      let containerRect = containerNode.getBoundingClientRect()
      /** Inintial area rect */
      let areaRect = monitor.getItem()
      // Container dimensions
      let containerWidth = containerRect.right - containerRect.left
      let containerHeight = containerRect.bottom - containerRect.top
      /** Initial cursor location */
      let initOffset = monitor.getInitialClientOffset()
      /** Current offset */
      let currentOffset = monitor.getClientOffset()
      /** Cursor absolute offset */
      let cursorAbsoluteOffset = {
        x: currentOffset.x - containerRect.left,
        y: currentOffset.y - containerRect.top,
      }
      /** Area box absolute offset */
      let areaAbsoluteOffset = {
        left: cursorAbsoluteOffset.x - (initOffset.x - areaRect.left),
        right: cursorAbsoluteOffset.x + (areaRect.right - initOffset.x),
        top: cursorAbsoluteOffset.y - (initOffset.y - areaRect.top),
        bottom: cursorAbsoluteOffset.y + (areaRect.bottom - initOffset.y)
      }
      /** Fixed left offset to be rendered */
      let fixedAreaLeftOffset = areaAbsoluteOffset.left
      if (areaAbsoluteOffset.left < 0)
        fixedAreaLeftOffset = 0
      else if (areaAbsoluteOffset.right > containerWidth)
        fixedAreaLeftOffset = containerWidth - areaRect.width - 1
      /** Fixed top offset to be rendered */
      let fixedAreaTopOffset = areaAbsoluteOffset.top
      if (areaAbsoluteOffset.top < 0)
        fixedAreaTopOffset = 0
      else if (areaAbsoluteOffset.bottom > containerHeight)
        fixedAreaTopOffset = containerHeight - areaRect.height - 1
      // Move actual area
      component.updateArea({
        top: fixedAreaTopOffset,
        left: fixedAreaLeftOffset
      })
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  ImageCrop
)

const ImageCropStyled = withStyles(styles)(ImageCropHOC)

export { ImageCropStyled as ImageCrop }