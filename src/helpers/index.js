import movePreviewImage from '../img/empty.svg'

export const ItemTypes = {
  BOX: 'BOX',
  TAG: 'TAG'
}

export const TagTypes = {
  types: {
    NW: 'NW',
    N: 'N',
    NE: 'NE',
    W: 'W',
    E: 'E',
    SW: 'SW',
    S: 'S',
    SE: 'SE'
  },
  /** Check whether given type is edge */
  isEdge(type) {
    return [this.types.NW, this.types.NE, this.types.SW, this.types.SE].indexOf(type) > -1
  },
  /** Check whether given type is pole */
  isPole(type) {
    return [this.types.N, this.types.S].indexOf(type) > -1
  },
  /** Check whether given type is side of world */
  isSide(type) {
    return [this.types.E, this.types.W].indexOf(type) > -1
  },
  /** Get current selected edge region */
  getCurrentEdge(currentType, areaTop, areaLeft, areaWidth, areaHeight, clientX, clientY) {
    let areaMiddleX = areaLeft + areaWidth / 2
    let areaMiddleY = areaTop + areaHeight / 2
    let additionalOffsetX = areaWidth / 3
    let additionalOffsetY = areaHeight / 3
    // Don't ask W.T.F. is this.
    // We just need this to happened.
    switch (currentType) {
      case TagTypes.types.NW:
        areaMiddleX += additionalOffsetX
        areaMiddleY += additionalOffsetY
        break
      case TagTypes.types.NE: 
        areaMiddleX -= additionalOffsetX
        areaMiddleY += additionalOffsetY
        break
      case TagTypes.types.SE:
        areaMiddleX -= additionalOffsetX
        areaMiddleY -= additionalOffsetY
        break
      case TagTypes.types.SW:
        areaMiddleX += additionalOffsetX
        areaMiddleY -= additionalOffsetY
    }
    // Determine which tag we actually need to drag..
    if (clientX > areaMiddleX)
      if (clientY > areaMiddleY)
        return this.types.SE
      else
        return this.types.NE
    else 
      if (clientY > areaMiddleY)
        return this.types.SW
      else
        return this.types.NW
  },
  getCurrentPole(areaTop, areaHeight, clientY) {
    let areaMiddleY = areaTop + areaHeight / 2
    if (clientY > areaMiddleY)
      return this.types.S
    return this.types.N
  },
  getCurrentSide(areaLeft, areaWidth, clientX) {
    let areaMiddleX = areaLeft + areaWidth / 2
    if (clientX > areaMiddleX)
      return this.types.E
    return this.types.W
  }
}

export const ErrorTypes = {
  WRONG_IMAGE_ASPECT_RATIO: 'WRONG_IMAGE_ASPECT_RATIO',
  IMAGE_TOO_SMALL: 'IMAGE_TOO_SMALL'
}

/** MaxPossibleWidth/currentHegiht */
export const MAX_RESIZE_RATIO = 1
/** MinPossibleWidth/currentHeight */
export const MIN_RESIZE_RATIO = 1/1.5
/** Maximum image markup width or height */
export const MAX_IMAGE_DIMENSION_LENGHT = 604
/** Minimum image markup width or height */
export const MIN_IMAGE_DIMENSION_LENGHT = 200
/** Minimum crop area width or height */
export const MIN_IMAGE_CROP_DIMENSION_LENGHT = 100
/** If given image width is less than this value, we select an entire image on load */
export const FULL_IMAGE_SELECTION_THRESHOLD = 300

export const movePreview = new Image()
movePreview.src = movePreviewImage
