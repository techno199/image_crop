import movePreviewImage from '../img/empty.svg'

export const ItemTypes = {
  BOX: 'BOX',
  TAG: 'TAG'
}

export const TagTypes = {
  NW: 'NW',
  N: 'N',
  NE: 'NE',
  W: 'W',
  E: 'E',
  SW: 'SW',
  S: 'S',
  SE: 'SE'
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
