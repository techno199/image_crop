import { TagTypes, MIN_IMAGE_CROP_DIMENSION_LENGHT, MIN_RESIZE_RATIO, MAX_RESIZE_RATIO } from "../../../helpers";

export const resizeArea = ({
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
}) => {
  let rect = imgRef.current.getBoundingClientRect()
  /** Currently dragged tag type */
  let tagType = item.type
  /** Current offset */
  let currentOffset = currentClientOffset
  /** Cursor absolute offset*/
  let cursorAbsoluteOffset = {
    x: currentOffset.x - rect.left,
    y: currentOffset.y - rect.top,
  }
  // Fix tagType depending on current location
  if (TagTypes.isEdge(tagType))
    tagType = TagTypes.getCurrentEdge(
      tagType,
      areaTop,
      areaLeft,
      areaWidth,
      areaHeight,
      cursorAbsoluteOffset.x,
      cursorAbsoluteOffset.y
    )
  else if (TagTypes.isPole(tagType))
    tagType = TagTypes.getCurrentPole(
      areaTop,
      areaHeight,
      cursorAbsoluteOffset.y
    )
  else 
    tagType = TagTypes.getCurrentSide(
      areaLeft,
      areaWidth,
      cursorAbsoluteOffset.x
    )
  
  // Move around with respect to actually selected tag
  switch (tagType) {
    case TagTypes.types.NW: {
      onAreaUpdate({
        top: areaTop - getFixedTopDelta(areaTop, areaHeight, areaWidth, cursorAbsoluteOffset),
        left: areaLeft - getFixedLeftDelta(areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset),
        width: areaWidth + getFixedLeftDelta(areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset),
        height: areaHeight + getFixedTopDelta(areaTop, areaHeight, areaWidth, cursorAbsoluteOffset)
      })
      break
    }      
    case TagTypes.types.N: {
      onAreaUpdate({
        top: areaTop - getFixedTopDelta(areaTop, areaHeight, areaWidth, cursorAbsoluteOffset),
        height: areaHeight + getFixedTopDelta(areaTop, areaHeight, areaWidth, cursorAbsoluteOffset)
      })
      break
    }
    case TagTypes.types.NE: {
      onAreaUpdate({
        top: areaTop - getFixedTopDelta(areaTop, areaHeight, areaWidth, cursorAbsoluteOffset),
        width: areaWidth - getFixedRightDelta(width, areaLeft, areaHeight, areaWidth, cursorAbsoluteOffset),
        height: areaHeight + getFixedTopDelta(areaTop, areaHeight, areaWidth, cursorAbsoluteOffset)
      })
      break
    }
    case TagTypes.types.E: {
      onAreaUpdate({
        width: areaWidth - getFixedRightDelta(width, areaLeft, areaHeight, areaWidth, cursorAbsoluteOffset)
      })
      break
    }
    case TagTypes.types.SE: {
      onAreaUpdate({
        width: areaWidth - getFixedRightDelta(width, areaLeft, areaHeight, areaWidth, cursorAbsoluteOffset),
        height: areaHeight - getFixedBottomDelta(height, areaTop, areaWidth, areaHeight, cursorAbsoluteOffset)
      })
      break
    }
    case TagTypes.types.S: {
      onAreaUpdate({
        height: areaHeight - getFixedBottomDelta(height, areaTop, areaWidth, areaHeight, cursorAbsoluteOffset)
      })
      break
    }
    case TagTypes.types.SW: {
      onAreaUpdate({
        left: areaLeft - getFixedLeftDelta(areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset),
        height: areaHeight - getFixedBottomDelta(height, areaTop, areaWidth, areaHeight, cursorAbsoluteOffset),
        width: areaWidth + getFixedLeftDelta(areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset)
      })
      break
    }
    case TagTypes.types.W: {
      onAreaUpdate({
        left: areaLeft - getFixedLeftDelta(areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset),
        width: areaWidth + getFixedLeftDelta(areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset)
      })
      break
    }
    default:
      break
  }
}

const getFixedBottomDelta = (height, areaTop, areaWidth, areaHeight, cursorAbsoluteOffset) => {
  // Get possible interval for bottom side
  let bottomAbsoluteOffsetInterval = {
    max: Math.min(
      height,
      areaTop + areaWidth / MIN_RESIZE_RATIO
    ),
    min: Math.max(
      areaTop + areaWidth / MAX_RESIZE_RATIO,
      areaTop + MIN_IMAGE_CROP_DIMENSION_LENGHT
    )
  }
  // Get fixed offset
  let fixedBottomOffset = cursorAbsoluteOffset.y
  if (cursorAbsoluteOffset.y > bottomAbsoluteOffsetInterval.max)
    fixedBottomOffset = bottomAbsoluteOffsetInterval.max
  else if (cursorAbsoluteOffset.y < bottomAbsoluteOffsetInterval.min)
    fixedBottomOffset = bottomAbsoluteOffsetInterval.min
  return areaTop + areaHeight - fixedBottomOffset
}

const getFixedRightDelta = (width, areaLeft, areaHeight, areaWidth, cursorAbsoluteOffset) => {
  // Get possible interval for right side
  let rightAbsoluteOffsetInterval = {
    max: Math.min(
      width,
      areaLeft + areaHeight * MAX_RESIZE_RATIO
    ),
    min: Math.max(
      areaLeft + areaHeight * MIN_RESIZE_RATIO,
      areaLeft + MIN_IMAGE_CROP_DIMENSION_LENGHT
    )
  }
  // Get fixed offset
  let fixedRightOffset = cursorAbsoluteOffset.x
  if (cursorAbsoluteOffset.x > rightAbsoluteOffsetInterval.max)
    fixedRightOffset = rightAbsoluteOffsetInterval.max
  else if (cursorAbsoluteOffset.x < rightAbsoluteOffsetInterval.min)
    fixedRightOffset = rightAbsoluteOffsetInterval.min
  return areaLeft + areaWidth - fixedRightOffset
}

const getFixedLeftDelta = (areaLeft, areaWidth, areaHeight, cursorAbsoluteOffset) => {
  // Get possible interval for left side
  let leftAbsoluteOffsetInterval = {
    max: Math.max(
      0, 
      areaLeft + areaWidth - areaHeight * MAX_RESIZE_RATIO
    ),
    min: Math.min(
      areaLeft + areaWidth - areaHeight * MIN_RESIZE_RATIO,
      areaLeft + areaWidth - MIN_IMAGE_CROP_DIMENSION_LENGHT
    )
  }
  // Get fixed offset based on interval
  let fixedLeftOffset = cursorAbsoluteOffset.x
  if (cursorAbsoluteOffset.x < leftAbsoluteOffsetInterval.max)
    fixedLeftOffset = leftAbsoluteOffsetInterval.max
  else if (cursorAbsoluteOffset.x > leftAbsoluteOffsetInterval.min)
    fixedLeftOffset = leftAbsoluteOffsetInterval.min
  return areaLeft - fixedLeftOffset
}

const getFixedTopDelta = (areaTop, areaHeight, areaWidth, cursorAbsoluteOffset) => {
  // Get possible absolute interval for top side
  let topAbsoluteOffsetInterval = {
    max: Math.max(
      0,
      areaTop + areaHeight - areaWidth / MIN_RESIZE_RATIO
    ),
    min: Math.min(
      areaTop + areaHeight - areaWidth / MAX_RESIZE_RATIO,
      areaTop + areaHeight - MIN_IMAGE_CROP_DIMENSION_LENGHT
    )
  }
  // Get fixed offset based on interval
  let fixedTopOffset = cursorAbsoluteOffset.y
  if (cursorAbsoluteOffset.y < topAbsoluteOffsetInterval.max)
    fixedTopOffset = topAbsoluteOffsetInterval.max
  else if (cursorAbsoluteOffset.y > topAbsoluteOffsetInterval.min)
    fixedTopOffset = topAbsoluteOffsetInterval.min
  return areaTop - fixedTopOffset
}