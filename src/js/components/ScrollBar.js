import React from "react"

export default class ScrollBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false
    }
    console.log(props.options)
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
    const maxScrollDistX = this.props.visibleWidth - scrollBarLengthX - 8;
    const scrollX = cursorDiff / (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    this.props.onDragScrollX(this.state.currentScrollLeft + scrollX);
  }

  onDragY(e) {
    const cursorDiff = e.pageY - this.state.cursorY;
    const scrollBarLengthY = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
    const maxScrollDistY = this.props.visibleHeight - scrollBarLengthY - 8;
    const scrollY = cursorDiff / (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    this.props.onDragScrollY(this.state.currentScrollTop + scrollY);

  }

  render() {
    const minScrollBarHeight = 20;

    let scrollBarLengthY,
        scrollBarLengthX,
        maxScrollDistY,
        maxScrollDistX,
        top,
        left;

    if(this.props.visibleHeight == 0 || this.props.contentHeight == 0 || this.props.visibleHeight >= this.props.contentHeight) {
      scrollBarLengthY = 0;
      top = 0;
    }
    else {
      scrollBarLengthY = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
      maxScrollDistY = this.props.visibleHeight - scrollBarLengthY;
      if(this.props.visibleWidth >= this.props.contentWidth) {
        maxScrollDistY -= 17;
      }
      else
        maxScrollDistY -= this.props.options.horizontalWidth;

      top = this.props.scrollY * (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    }

    if(this.props.visibleWidth == 0 || this.props.contentWidth == 0 || this.props.visibleWidth >= this.props.contentWidth) {
      scrollBarLengthX = 0;
      left = 0;
    } 
    else {
      scrollBarLengthX = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
      if(this.props.visibleHeight >= this.props.contentHeight) {
        maxScrollDistX -= 17;
      }
      else
        maxScrollDistX -= this.props.options.verticalWidth;

      left = this.props.scrollX * (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    }

    const verticalClassName = this.props.options.verticalClassName || null;
    const horizontalClassName = this.props.options.horizontalClassName || null;

    let containerStyle= {
      opacity: this.props.showScroll || this.state.isDragging ? "1.0" : "0.0",
      transition: "all .4s"
    }

    let yStyle = {
      position: "absolute",
      height: scrollBarLengthY + "px",
      width: this.props.options.verticalWidth + "px",
      top: top,
      right: "0",
      bottom: "0",
      zIndex: "99999",
      backgroundColor: "black",
      borderRadius: "4px",
      cursor: "pointer",
    }

    let xStyle = {
      position: "absolute",
      width: scrollBarLengthX + "px",
      height: this.props.options.horizontalWidth + "px",
      left: left,
      right: "0",
      bottom: "0",
      zIndex: "99999",
      backgroundColor: "black",
      borderRadius: "4px",
      cursor: "pointer",
    }

    return (
      <div style={containerStyle}>
        <div className={verticalClassName} style={yStyle} ref={vertical => this.vertical = vertical} onMouseDown={this.onDragStart.bind(this)}></div>
        <div className={horizontalClassName} style={xStyle} ref={horizontal => this.horizontal = horizontal} onMouseDown={this.onDragStart.bind(this)}></div>
      </div>
    )
  }
}
