import React from "react"

import ScrollBar from "./ScrollBar"

export default class ScrollArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleWidth: 0,
      visibleHeight: 0,
      contentWidth: 0,
      contentHeight: 0,
      rightScrollWidth: 0,
      bottomScrollWidth: 0,
      scrollX: 0,
      scrollY: 0,
      showScroll: false
    }

    this.fadeInDelay = null;
    this.fadeOutDelay = null;
  }

  componentDidMount() {
    const {rightScrollWidth, bottomScrollWidth} = this.calcScrollBarWidth();
    this.setState({
      visibleWidth: this.scrollAreaContent.clientWidth + rightScrollWidth,
      visibleHeight: this.scrollAreaContent.clientHeight + bottomScrollWidth,
      contentWidth: this.scrollAreaContent.scrollWidth,
      contentHeight: this.scrollAreaContent.scrollHeight,
      rightScrollWidth: rightScrollWidth,
      bottomScrollWidth: bottomScrollWidth      
    })
    // console.log(this.scrollArea.clientWidth);
    // console.log(this.scrollArea.clientHeight);
    // console.log(this.scrollArea.scrollHeight);
    // console.log(this.scrollAreaContent.clientWidth); // visible content width
    // console.log(this.scrollAreaContent.clientHeight); // viisble content height
    // console.log(this.scrollAreaContent.scrollWidth);
    // console.log(this.scrollAreaContent.scrollHeight);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.contentWidth !== this.scrollAreaContent.scrollWidth || this.state.contentHeight !== this.scrollAreaContent.scrollHeight) {
      this.setState({contentWidth: this.scrollAreaContent.scrollWidth, contentHeight: this.scrollAreaContent.scrollHeight})
    }
  }

  calcScrollBarWidth() { 
    // Default Browser ScrollBar Width
    // Chrome, FF, IE ~ 17px
    // Edge ~ 12px
    const computedStyle = window.getComputedStyle(this.scrollAreaContent, null);

    // Will always return in pixels
    let topBorder = computedStyle.getPropertyValue("border-top-width");
    let bottomBorder = computedStyle.getPropertyValue("border-bottom-width");
    let leftBorder = computedStyle.getPropertyValue("border-left-width");
    let rightBorder = computedStyle.getPropertyValue("border-right-width");

    topBorder = parseInt(topBorder.substring(0, topBorder.length-2), 10);
    bottomBorder = parseInt(bottomBorder.substring(0, bottomBorder.length-2), 10);
    leftBorder = parseInt(leftBorder.substring(0, leftBorder.length-2), 10);
    rightBorder = parseInt(rightBorder.substring(0, rightBorder.length-2), 10);

    const rightScrollWidth = this.scrollAreaContent.offsetWidth - this.scrollAreaContent.clientWidth - leftBorder - rightBorder;
    const bottomScrollWidth = this.scrollAreaContent.offsetHeight - this.scrollAreaContent.clientHeight - topBorder - bottomBorder;

    return {rightScrollWidth, bottomScrollWidth};
  }

  onScroll() {
    const {fadeInDuration, fadeInDelay, fadeOutDelay} = this.props;

    this.fadeHandler();

    this.setState({scrollY: this.scrollAreaContent.scrollTop, scrollX: this.scrollAreaContent.scrollLeft})
  }

  onDragScrollY(scrollTop) {
    this.scrollAreaContent.scrollTop = scrollTop;
  }

  onDragScrollX(scrollLeft) {
    this.scrollAreaContent.scrollLeft = scrollLeft;
  }

  paddingRight() {
    if(this.state.visibleHeight < this.state.contentHeight)
      return `${this.state.rightScrollWidth}px`;

    return '0px';
  }

  paddingBottom() {
    if(this.state.visibleWidth < this.state.contentWidth)
      return `${this.state.bottomScrollWidth}px`;

    return '0px';
  }

  onMouseEnter() {

  }

  fadeHandler() {
    const {fadeInDuration, fadeInDelay, fadeOutDelay} = this.props;

    clearTimeout(this.fadeInDelay);
    clearTimeout(this.fadeOutDelay);

    this.fadeInDelay = setTimeout(() => {
      this.setState({showScroll: true}, () => {
        clearTimeout(this.fadeOutDelay);
        console.log("fade in")
        this.fadeOutDelay = setTimeout(() => {
          console.log("fade out")
          this.setState({showScroll: false});
        }, fadeInDuration + fadeOutDelay);
      });

    }, fadeInDelay);
  }

  // onMouseLeave() {
  //   const {fadeInDuration, fadeInDelay, fadeOutDelay} = this.props;

  //   clearTimeout(this.fadeOutDelay);
  //   console.log("leave")
  //   this.fadeOutDelay = setTimeout(() => {
  //     console.log("fade out");
  //     this.setState({showScroll: false});
  //   }, fadeInDuration + fadeOutDelay);
  // }


  render() {

    let style = {
      position: "relative",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      border:"10px solid red"
    }

    const contentStyle = {
      width: "100%",
      height: "100%",
      position: "absolute",
      paddingRight: this.paddingRight(),
      paddingBottom: this.paddingBottom(),
      overflow: "auto"
    }

    return (
      <div ref={(scrollArea) => this.scrollArea = scrollArea} 
        style={style} 
        className={this.props.containerClassName || null} 
        onMouseEnter={this.fadeHandler.bind(this)} 
      >
        <div 
          onScroll={this.onScroll.bind(this)}
          ref={(scrollAreaContent) => this.scrollAreaContent = scrollAreaContent} 
          style={contentStyle}
        >

            {this.props.children}

        </div>
        <ScrollBar
          options={this.props}
          onDragScrollX={this.onDragScrollX.bind(this)}
          onDragScrollY={this.onDragScrollY.bind(this)} 
          visibleWidth={this.state.visibleWidth} 
          visibleHeight={this.state.visibleHeight} 
          contentWidth={this.state.contentWidth} 
          contentHeight={this.state.contentHeight}
          rightScrollWidth={this.state.rightScrollWidth}
          bottomScrollWidth={this.state.bottomScrollWidth}
          scrollY={this.state.scrollY} 
          scrollX={this.state.scrollX}
          showScroll={this.state.showScroll}/>
      </div>
    )
  }
}
