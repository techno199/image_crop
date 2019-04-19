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

/** How many height's can maximum width contain */
export const MAX_RESIZE_RATIO = 1
/** How many height's can minimum width contain */
export const MIN_RESIZE_RATIO = 1/1.5
/** Maximum image markup width or height */
export const MAX_IMAGE_DIMENSION_LENGHT = 604
/** Minimum image markup width or height */
export const MIN_IMAGE_DIMENSION_LENGHT = 200
/** Minimum crop area width or height */
export const MIN_IMAGE_CROP_DIMENSION_LENGHT = 100