import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { Paper } from '../paper';
import { ReactComponent as RotateAntiClockwiseIcon } from '../../img/rotate_left.svg'
import { ReactComponent as RotateClockwiseIcon } from '../../img/rotate_right.svg'
import { ReactComponent as CloseIcon } from '../../img/close.svg'
import CatsImg from '../../img/cats.jpg'
import { Button } from '../button';
import styles from './imageCrop.styles'
import { Cropper } from './cropper';
import update from 'immutability-helper'
import { MAX_IMAGE_DIMENSION_LENGHT, MIN_IMAGE_DIMENSION_LENGHT, MIN_IMAGE_CROP_DIMENSION_LENGHT, ErrorTypes, MAX_RESIZE_RATIO, MIN_RESIZE_RATIO, FULL_IMAGE_SELECTION_THRESHOLD, TagTypes } from '../../helpers';

const getDefaultState = () => ({
  /** Defines whether image was loaded and processed */
  isImgSelected: false,
  /** Reference to image DOM */
  imgSrc: null,
  /** Current rotation level */
  imgRotationDegree: 0,
  /** Image rectangle */
  imgRef: React.createRef(),
  /** Calculated width */
  resizedImageWidth: null,
  /** Calculated height */
  resizedImageHeight: null,
  area: {
    top: 0,
    left: 0,
    width: MIN_IMAGE_DIMENSION_LENGHT,
    height: MIN_IMAGE_DIMENSION_LENGHT,
  }
})

class ImageCrop extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    /** Callback on close button clicked */
    onClose: PropTypes.func,
    /** Callback on loading error provided with message */
    onErrorLoadingImage: PropTypes.func
  }

  state = getDefaultState()
  // Component refs
  fileInputRef = React.createRef()
  // Other props
  reader = new FileReader()
  image = new Image()

  componentDidMount = () => {
    // Process each next file loaded to reader
    this.reader.addEventListener('load', () => {
      // Load and preprocess image
      this.image.src = this.reader.result
    }, false)

    // Process given image on load
    this.image.onload = (e) => {
      let originalWidth = this.image.width
      let originalHeight = this.image.height
      
      // Check image aspect ration rules on load
      if (
        originalWidth / originalHeight <= 0.25 ||
        originalWidth / originalHeight >= 3
      ) {
        this.props.onErrorLoadingImage &&
          this.props.onErrorLoadingImage(ErrorTypes.WRONG_IMAGE_ASPECT_RATIO)
        return
      }
      if (
        originalWidth < MIN_IMAGE_DIMENSION_LENGHT ||
        originalHeight < MIN_IMAGE_DIMENSION_LENGHT
      ) {
        this.props.onErrorLoadingImage &&
          this.props.onErrorLoadingImage(ErrorTypes.IMAGE_TOO_SMALL)
        return
      }
      // Resize exaggerated image
      let aspectRatio
      let resizedImageWidth = originalWidth
      let resizedImageHeight = originalHeight
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
      // Set default image center
      let initialAreaTop = resizedImageHeight / 2 - MIN_IMAGE_DIMENSION_LENGHT / 2
      let initialAreaLeft = resizedImageWidth / 2 - MIN_IMAGE_DIMENSION_LENGHT / 2
      let calculatedWidth = Math.min(MIN_IMAGE_DIMENSION_LENGHT, resizedImageWidth)
      let calculatedHeight = Math.min(MIN_IMAGE_DIMENSION_LENGHT, resizedImageHeight)

      // Select entire image if it is small enough
      if (
        resizedImageHeight / resizedImageWidth <= MAX_RESIZE_RATIO &&
        resizedImageHeight / resizedImageWidth >= MIN_RESIZE_RATIO &&
        resizedImageHeight <= MAX_IMAGE_DIMENSION_LENGHT &&
        resizedImageWidth <= FULL_IMAGE_SELECTION_THRESHOLD
      ) {
        initialAreaTop = 0
        initialAreaLeft = 0
        calculatedWidth = resizedImageWidth
        calculatedHeight = resizedImageHeight
      }

      this.setState({
        area: update(this.state.area, {
          top: { $set: initialAreaTop },
          left: { $set: initialAreaLeft },
          width: { $set: calculatedWidth },
          height: { $set: calculatedHeight }
        }),
        resizedImageWidth,
        resizedImageHeight,
        imgSrc: this.image.src,
        isImgSelected: true
      })
    }
  }

  /** Callback on close click */
  handleClose = () => {
    this.props.onClose &&
      this.props.onClose()
  }

  /** Resets selected image */
  handleGoBackClick = () => {
    let defaultState = getDefaultState()
    this.setState({
      ...defaultState
    })
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

  /**
   * Just.
   * Handle.
   * A cat.
   */
  handleCat = () => {
    this.image.src = CatsImg
  }

  /** Transforms image for given degree diff */
  handleRotateClick = deltaDegree => () => {
    this.setState(oldState => ({
      imgRotationDegree: oldState.imgRotationDegree + deltaDegree
    }))
  }

  /** Update selected area properties*/
  updateArea = (area) => {
    this.setState({
      area: update(this.state.area, { $merge: area })
    })
  }
  
  /** Replace current area with new one */
  handleFadedSpaceClick = ({x, y}) => {
    const { 
      resizedImageHeight,
      resizedImageWidth
     } = this.state
    // Fix top offset
    let fixedTop = y - MIN_IMAGE_CROP_DIMENSION_LENGHT / 2
    if (fixedTop < 0)
      fixedTop = 0
    else if (fixedTop > resizedImageHeight - MIN_IMAGE_CROP_DIMENSION_LENGHT)
      fixedTop = resizedImageHeight - MIN_IMAGE_CROP_DIMENSION_LENGHT
    // Fixed left offset
    let fixedLeft = x - MIN_IMAGE_CROP_DIMENSION_LENGHT / 2
    if (fixedLeft < 0)
     fixedLeft = 0
    else if (fixedLeft > resizedImageWidth - MIN_IMAGE_CROP_DIMENSION_LENGHT)
      fixedLeft = resizedImageWidth - MIN_IMAGE_CROP_DIMENSION_LENGHT
    
    this.updateArea({
      top: fixedTop,
      left: fixedLeft,
      width: MIN_IMAGE_CROP_DIMENSION_LENGHT,
      height: MIN_IMAGE_CROP_DIMENSION_LENGHT
    })
  }
  
  /** Update image reference */
  handleCropperRectUpdate = ref => {
    this.setState({
      imgRef: ref
    })
  }

  /** Fires each tick of area drawing */
  handleDrawArea = ({ initClientX, initClientY, clientX, clientY })=> {
    let top, left, width, height
    if (clientX > initClientX)
      if (clientY > initClientY) {
        // SE
        top = initClientY
        left = initClientX
        width = clientX - initClientX
        height = clientY - initClientY
      }
      else {
        // NE
        top = clientY
        left = initClientX
        width = clientX - initClientX
        height = initClientY - clientY
      }
    else
      if (clientY > initClientY) {
        // SW
        top = initClientY
        left = clientX
        width = initClientX - clientX
        height = clientY - initClientY
      }
      else {
        // NW
        top = clientY
        left = clientX
        width = initClientX - clientX
        height = initClientY - clientY
      }
    this.updateArea({
      top,
      left,
      width,
      height
    })
  }

  handleDrawAreaEnd = e => {
    const { 
      resizedImageWidth,
      resizedImageHeight,
      area
    } = this.state
    let left = area.left
    let top = area.top
    let height = area.height
    let width = area.width
    let desiredHeight = Math.max(height, MIN_IMAGE_CROP_DIMENSION_LENGHT)
    // Width we can afford
    let desiredWidth = Math.min(
      resizedImageWidth, 
      Math.min(
          desiredHeight * MAX_RESIZE_RATIO,
          Math.max(
            width,
            MIN_IMAGE_CROP_DIMENSION_LENGHT
          )
        )
    )
    // Keep area inside
    if (left + desiredWidth > resizedImageWidth)
      left = resizedImageWidth - desiredWidth
    if (top + desiredHeight > resizedImageHeight)
      top = resizedImageHeight - desiredHeight
    this.updateArea({
      top,
      left,
      width: desiredWidth,
      height: desiredHeight
    })
  }

  render() {
    const { 
      classes,
      title,
    } = this.props

    const { 
      isImgSelected,
      imgSrc,
      imgRotationDegree,
      area,
      resizedImageHeight,
      resizedImageWidth,
      imgRef
    } = this.state

    // Next code block ensures that image is being rotated 
    // and, if it is, adjusts margin of wrapper
    let imgWidthHeightDelta = 0
    if (imgRef.current) {
      let isRotated = Boolean((imgRotationDegree / 90) % 2)
      
      if (isRotated) {
        imgWidthHeightDelta = Math.abs(
          imgRef.current.clientWidth - 
          imgRef.current.clientHeight
        )
      }
    }

    let outerImageContainerStyle = {
      margin: `${imgWidthHeightDelta / 2 + 35}px auto`,
      width: resizedImageWidth,
      height: resizedImageHeight
    }
    return (
      <Paper className={classes.root}>
        <div className={classes.title}>
          <span className={classes.titleText}>
            {title}
          </span>
          <div className={classes.close}>
            <CloseIcon onClick={this.handleClose}/>
          </div>
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
                draggable={false}
              >
                <Cropper
                  height={resizedImageHeight}
                  width={resizedImageWidth}
                  areaTop={area.top}
                  areaLeft={area.left}
                  areaHeight={area.height}
                  areaWidth={area.width}
                  imgSrc={imgSrc}
                  imgRef={imgRef}
                  rotationDegree={imgRotationDegree}
                  onRectUpdate={this.handleCropperRectUpdate}
                  onAreaUpdate={this.updateArea}
                  onFadedSpaceClick={this.handleFadedSpaceClick}
                  onDrawArea={this.handleDrawArea}
                  onDrawAreaEnd={this.handleDrawAreaEnd}
                />
                <div className={classes.rotationButtons} draggable={false}>
                  <RotateAntiClockwiseIcon
                    className={classes.rotateClockwise}
                    onClick={this.handleRotateClick(-90)}
                  />
                  <RotateClockwiseIcon
                    className={classes.rotateAntiClockwise}
                    onClick={this.handleRotateClick(90)}
                  />
                </div>
              </div>
              <div className={classes.bottomLine} />
              <div className={classes.footer}>
                <Button className={classes.btn}>Сохранить</Button>
                <Button onClick={this.handleGoBackClick}>Назад</Button>
              </div>
            </div>
            ) : (
              <div className={classes.footer}>
                <Button 
                  onClick={this.handleSelectFileClick}
                  className={classes.btn}
                >
                  Выбрать фото
                </Button>
                <Button onClick={this.handleCat}>
                  Выбрать кота
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

const ImageCropStyled = withStyles(styles)(ImageCrop)

export { ImageCropStyled as ImageCrop }