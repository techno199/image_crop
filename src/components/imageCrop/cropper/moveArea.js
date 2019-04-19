/** Describes the rules for area movement */
export const moveArea = (props, monitor) => {
  // Get container data
  let containerRect = props.rect
  /** Inintial area rect */
  let areaRect = monitor.getItem()
  // Container dimensions
  let containerWidth = props.width
  let containerHeight = props.height
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
    fixedAreaLeftOffset = containerWidth - areaRect.width
  /** Fixed top offset to be rendered */
  let fixedAreaTopOffset = areaAbsoluteOffset.top
  if (areaAbsoluteOffset.top < 0)
    fixedAreaTopOffset = 0
  else if (areaAbsoluteOffset.bottom > containerHeight)
    fixedAreaTopOffset = containerHeight - areaRect.height
  // Move actual area
  props.onAreaUpdate({
    top: fixedAreaTopOffset,
    left: fixedAreaLeftOffset
  })
}