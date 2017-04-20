import React from "react"

export default class ScrollBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }

  }

  componentDidUpdate() {

  }

  onDragStart() {
    document.addEventListener("mousemove", );    

    this.setState({cursorX: e.pageX, cursorY: e.pageY});
  }

  onMouseUp() {
    document.removeEventListener("mousemove", );
  }

  render() {
    const minScrollBarHeight = 20;

    let scrollBarLengthY,
        scrollBarLengthX,
        maxScrollDistY,
        maxScrollDistX,
        top,
        left;

    if(this.props.visibleHeight == 0 || this.props.contentHeight == 0) {
      scrollBarLengthY = 0;
      top = 0;
    }
    else {
      scrollBarLengthY = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
      maxScrollDistY = this.props.visibleHeight - scrollBarLengthY - 10;
      top = this.props.scrollY * (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    }

    if(this.props.visibleWidth == 0 || this.props.contentWidth == 0) {
      scrollBarLengthX = 0;
      left = 0;
    } 
    else {
      scrollBarLengthX = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      maxScrollDistX = this.props.visibleWidth - scrollBarLengthX - 10;
      left = this.props.scrollX * (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    }

    let containerStyle={
      opacity: this.props.showScroll ? "1.0" : "0.0",
      transition: "all .4s"
    }

    let yStyle = {
      position: "absolute",
      height: scrollBarLengthY + "px",
      width: "8px",
      right: "0",
      top: top,
      bottom: "0",
      zIndex: "99999",
      backgroundColor: "black",
      borderRadius: "4px",
      cursor: "pointer",
    }

    let xStyle = {
      position: "absolute",
      width: scrollBarLengthX + "px",
      height: "8px",
      right: "0",
      left: left,
      bottom: "0",
      zIndex: "99999",
      backgroundColor: "black",
      borderRadius: "4px",
      cursor: "pointer",
    }

    return (
      <div style={containerStyle}>
        <div style={yStyle} ref={vertical => this.vertical = vertical} onMouseDown={this.onDragStart.bind(this)}></div>
        <div style={xStyle} ref={horizontal => this.horizontal = horizontal} onMouseDown={this.onDragStart.bind(this)}></div>
      </div>
    )
  }
}
