import React from "react"

export default class ScrollBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false
    }
    // console.log(props.options)
    this.onDragY = this.onDragY.bind(this);
    this.onDragX = this.onDragX.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
  }

  componentDidUpdate() {

  }

  onDragStart(e) {
    e.preventDefault(); // Prevent text selection while dragging

    if(e.target == this.vertical) 
      document.addEventListener("mousemove", this.onDragY);    
    else
      document.addEventListener("mousemove", this.onDragX);

    document.addEventListener("mouseup", this.onDragStop)
    this.setState({
      cursorX: e.pageX, 
      cursorY: e.pageY, 
      isDragging: true, 
      currentScrollTop: this.props.scrollY, 
      currentScrollLeft: this.props.scrollX
    });
  }

  onDragStop(e) {
    document.removeEventListener("mouseup", this.onDragStop)
    document.removeEventListener("mousemove", this.onDragX);
    document.removeEventListener("mousemove", this.onDragY);

    this.setState({isDragging: false})
  }

  onDragX(e) {
    const cursorDiff = e.pageX - this.state.cursorX;
    const scrollBarLengthX = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
    const maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
    const scrollX = cursorDiff / (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    this.props.onDragScrollX(this.state.currentScrollLeft + scrollX);
  }

  onDragY(e) {
    const cursorDiff = e.pageY - this.state.cursorY;
    const scrollBarLengthY = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
    const maxScrollDistY = this.props.visibleHeight - scrollBarLengthY;
    const scrollY = cursorDiff / (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    this.props.onDragScrollY(this.state.currentScrollTop + scrollY);
  }

  calcX() {
    let left, scrollBarLengthX, maxScrollDistX;

    const defaultMin = 20; // unit 'px'
    let {minHorizontalLength} = this.props.options;

    minHorizontalLength = minHorizontalLength && minHorizontalLength > 0 ? minHorizontalLength : defaultMin;

    if(this.props.visibleWidth == 0 || this.props.contentWidth == 0 || this.props.visibleWidth >= this.props.contentWidth) {
      scrollBarLengthX = 0;
      left = 0;
    } 
    else {
      const calcLength = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      scrollBarLengthX = calcLength < minHorizontalLength ? minHorizontalLength : calcLength;
      maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
      if(this.props.visibleHeight < this.props.contentHeight) {
        maxScrollDistX -= this.vertical.offsetWidth;
      }

      left = this.props.scrollX * (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    }

    return {left, scrollBarLengthX};
  }

  calcY() {
    let top, scrollBarLengthY, maxScrollDistY;

    const defaultMin = 20; // unit 'px'
    let {minVerticalLength} = this.props.options;

    minVerticalLength = minVerticalLength && minVerticalLength > 0 ? minVerticalLength : defaultMin;

    if(this.props.visibleHeight == 0 || this.props.contentHeight == 0 || this.props.visibleHeight >= this.props.contentHeight) {
      scrollBarLengthY = 0;
      top = 0;
    }
    else {
      const calcLength = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
      scrollBarLengthY = calcLength < minVerticalLength ? minVerticalLength : calcLength;
      maxScrollDistY = this.props.visibleHeight - scrollBarLengthY;
      if(this.props.visibleWidth < this.props.contentWidth) {
        maxScrollDistY -= this.horizontal.offsetHeight;
      }

      top = this.props.scrollY * (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    }

    return {top, scrollBarLengthY};
  }

  getFadeDuration() {
    const {fadeInDuration, fadeOutDuration, fadeInDelay, fadeOutDelay} = this.props.options;
    let duration = 0;

    if(this.props.showScroll) {
      if(fadeInDuration && fadeInDuration > 0)
        duration = (fadeInDuration / 1000);
    }
    else if(fadeOutDuration && fadeOutDuration > 0){
        duration = (fadeOutDuration / 1000);
    }

    return duration;
  }

  render() {
    const {left, scrollBarLengthX} = this.calcX();
    const {top, scrollBarLengthY} = this.calcY();

    const {verticalClassNames, horizontalClassNames} = this.props.options;

    let containerStyle = {
      position: "relative",
      opacity: this.props.showScroll || this.state.isDragging ? "1.0" : "0.0",
      transition: `opacity ${this.getFadeDuration()}s`
    }

    let yStyle = {
      position: "absolute",
      height: `${scrollBarLengthY}px`,
      width: this.props.options.verticalWidth,
      top: top,
      right: "0",
      backgroundColor: "black",
    }

    let xStyle = {
      position: "absolute",
      width: `${scrollBarLengthX}px`,
      height: this.props.options.horizontalWidth,
      left: left,
      bottom: `${(-1 * this.props.visibleHeight)}px`,
      backgroundColor: "black"
    }

    return (
      <div style={containerStyle}>
        <div className={verticalClassNames} style={yStyle} ref={vertical => this.vertical = vertical} onMouseDown={this.onDragStart.bind(this)}></div>
        <div className={horizontalClassNames} style={xStyle} ref={horizontal => this.horizontal = horizontal} onMouseDown={this.onDragStart.bind(this)}></div>
      </div>
    )
  }
}
