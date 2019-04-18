export default {
  root: {
    width: 654,
    display: 'flex',
    flexFlow: 'column'
  },
  title: {
    minHeight: 54,
    paddingLeft: 25,
    paddingRight: 25,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #86838357',
    backgroundColor: '#f2f5f7',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  descriptionWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 35
  },
  cropWrap: {
    padding: '32px 20px 20px',
    display: 'flex',
    justifyContent: 'center'
  },
  outerImage: {
    position: 'relative'
  },
  rotateClockwise: {
    fill: '#ffffff99',
    position: 'absolute',
    bottom: 5,
    right: 24,
    cursor: 'pointer',
    '&:hover': {
      fill: '#fff'
    }
  },
  rotateAntiClockwise: {
    extend: 'rotateClockwise',
    right: 0
  },
  rotationButtons: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  previewImage: {
    userSelect: 'none',
  },
  input: {
    display: 'none'
  },
  bottomLine: {
    borderBottom: '1px solid #86838357'
  },
  saveButton: {
    marginTop: 8
  },
  bottomButtonWrap: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center'
  },
  imgFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.7
  },
  area: {

  }
}
