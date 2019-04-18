import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'react-jss'
import { Paper } from '../paper';
import { ReactComponent as RotateAntiClockwiseIcon } from '../../img/rotate_left.svg'
import { ReactComponent as RotateClockwiseIcon } from '../../img/rotate_right.svg'
import { Button } from '../button';
import styles from './imageCrop.styles'
import { Cropper } from './cropper';
import update from 'immutability-helper'
import { MAX_IMAGE_DIMENSION_LENGHT, MIN_IMAGE_DIMENSION_LENGHT } from '../../helpers';

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
    /** Image rectangle */
    imgRect: null,
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

  componentWillUpdate = () => {

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
    this.setState({
      area: update(this.state.area, { $merge: area })
    })
  }
  
  handleImageClick = e => {
    console.log(e)
  }

  handleCropperRectUpdate = rect => {
    this.setState({
      imgRect: rect
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
      imgRect
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
                <Cropper
                  height={resizedImageHeight}
                  width={resizedImageWidth}
                  areaTop={area.top}
                  areaLeft={area.left}
                  areaHeight={area.height}
                  areaWidth={area.width}
                  imgSrc={imgSrc}
                  rotationDegree={imgRotationDegree}
                  onImageClick={this.handleImageClick}
                  onRectUpdate={this.handleCropperRectUpdate}
                  rect={imgRect}
                  onAreaUpdate={this.updateArea}
                />
                <div className={classes.rotationButtons}>
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

const ImageCropStyled = withStyles(styles)(ImageCrop)

export { ImageCropStyled as ImageCrop }