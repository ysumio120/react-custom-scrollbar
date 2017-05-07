import React from "react"

import PropTypes from 'prop-types'

import ScrollBar from "./ScrollBar"

export default class ScrollWrapper extends React.Component {
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

  //  this.fadeInDelay = null;
    this.fadeOutTimeout = null;
  }

  componentDidMount() {
    const {rightScrollWidth, bottomScrollWidth} = this.calcScrollBarWidth();

    // Initialization
    this.setState({
      visibleWidth: this.scrollAreaContent.clientWidth + rightScrollWidth,
      visibleHeight: this.scrollAreaContent.clientHeight + bottomScrollWidth,
      contentWidth: this.scrollAreaContent.scrollWidth,
      contentHeight: this.scrollAreaContent.scrollHeight,
      rightScrollWidth: rightScrollWidth,
      bottomScrollWidth: bottomScrollWidth      
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {visibleWidth, visibleHeight} = this.getVisibleDimen();
    const {contentWidth, contentHeight} = this.getContentDimen();

    if(this.state.visibleWidth !== visibleWidth || this.state.visibleHeight !== visibleHeight) {
      this.setState({visibleWidth, visibleHeight});
    }
    if(this.state.contentWidth !== this.scrollAreaContent.scrollWidth || this.state.contentHeight !== this.scrollAreaContent.scrollHeight) {
      this.setState({contentWidth, contentHeight});
    }
  }

  calcScrollBarWidth() { 
    // Default Browser ScrollBar Width
    // Chrome, FF, IE ~ 17px  
    // Edge ~ 12px
    // Safari ~ ?
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

  getVisibleDimen() {
    const visibleWidth = this.scrollAreaContent.clientWidth;
    const visibleHeight = this.scrollAreaContent.clientHeight;

    return {visibleWidth, visibleHeight};
  }

  getContentDimen() {
    const contentWidth = this.scrollAreaContent.scrollWidth;
    const contentHeight = this.scrollAreaContent.scrollHeight;

    return {contentWidth, contentHeight};
  }

  onScroll() {
    if(!this.props.keepVisible)
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

  fadeHandler() {
    const {fadeInDuration, autoFadeOut} = this.props;

    clearTimeout(this.fadeOutTimeout);

      this.setState({showScroll: true}, () => {
        clearTimeout(this.fadeOutTimeout);
        this.fadeOutTimeout = setTimeout(() => {
          this.setState({showScroll: false});
        }, fadeInDuration + autoFadeOut);
      });

  }

  render() {

    let wrapperStyle = this.props.wrapperStyle;

    let style = {
      position: "relative",
      height: "100%",
      width: "100%",
      overflow: "hidden"
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
      <div style={wrapperStyle}
        ref={(scrollArea) => this.scrollArea = scrollArea} 
        className={this.props.wrapperClassNames} 
        onMouseEnter={this.fadeHandler.bind(this)}>
      <div style={style}>
        <div 
          onScroll={this.onScroll.bind(this)}
          ref={(scrollAreaContent) => this.scrollAreaContent = scrollAreaContent} 
          style={contentStyle}
        >

            {this.props.children}

        </div>
      </div>
        <ScrollBar
          options={this.props}
          onDragScrollX={this.onDragScrollX.bind(this)}
          onDragScrollY={this.onDragScrollY.bind(this)}
          visibleWidth={this.state.visibleWidth} 
          visibleHeight={this.state.visibleHeight} 
          contentWidth={this.state.contentWidth} 
          contentHeight={this.state.contentHeight}
          scrollY={this.state.scrollY} 
          scrollX={this.state.scrollX}
          showScroll={this.state.showScroll}
          fadeOutTimeout={this.fadeOutTimeout}/>
      </div>
    )
  }
}

ScrollWrapper.defaultProps = {
  minVerticalLength: 20,
  minHorizontalLength: 20,
  verticalThickness: "10px",
  horizontalThickness: "10px",
  keepVisible: true,
  fadeInDuration: 0,
  fadeOutDuration: 0,
  offsetScroll: false
}

ScrollWrapper.propTypes = {
  wrapperStyle: PropTypes.object,
  verticalScrollStyle: PropTypes.object,
  horizontalScrollStyle: PropTypes.object,
  verticalTrackStyle: PropTypes.object,
  horizontalTrackStyle: PropTypes.object,
  wrapperClassNames: PropTypes.string,
  verticalScrollClassNames: PropTypes.string,
  horizontalScrollClassNames: PropTypes.string,
  verticalTrackClassNames: PropTypes.string,
  horizontalTrackClassNames: PropTypes.string,
  minVerticalLength: PropTypes.number,
  minHorizontalLength: PropTypes.number,
  verticalThickness: PropTypes.string,
  horizontalThickness: PropTypes.string,
  keepVisible: PropTypes.bool,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  autoFadeOut: PropTypes.number,
  offsetScroll: PropTypes.bool
}