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

    this.fadeOutTimeout = null;
    this.update = this.update.bind(this);
    this.setOnLoad = this.setOnLoad.bind(this);
  }

  componentDidMount() {
    if(this.props.autoUpdate) {
      this.mutationObserver();
    }

    const {rightScrollWidth, bottomScrollWidth} = this.calcScrollBarWidth();
    
    // Initialization
    this.setState({
      visibleWidth: this.scrollAreaContent.clientWidth,
      visibleHeight: this.scrollAreaContent.clientHeight,
      contentWidth: this.scrollAreaContent.scrollWidth,
      contentHeight: this.scrollAreaContent.scrollHeight,
      rightScrollWidth: rightScrollWidth,
      bottomScrollWidth: bottomScrollWidth      
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.update();
  }

  mutationObserver() {
    const target = this.scrollArea;
  
    const component = this;

    // create an observer instance
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log(mutation.target.scrollHeight);
      });

      component.update();   
    });
 
    // configuration of the observer:
    var config = { childList: true, subtree: true, attributes: true, characterData: true };
 
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
  }

  update() {
    const {visibleWidth, visibleHeight} = this.getVisibleDimen();
    const {contentWidth, contentHeight} = this.getContentDimen();

    const {rightScrollWidth, bottomScrollWidth} = this.calcScrollBarWidth();

    if(this.state.visibleWidth !== visibleWidth || this.state.visibleHeight !== visibleHeight) {
      this.setState({visibleWidth, visibleHeight, rightScrollWidth, bottomScrollWidth})
    }
    if(this.state.contentWidth !== contentWidth || this.state.contentHeight !== contentHeight) {
      this.setState({contentWidth, contentHeight, rightScrollWidth, bottomScrollWidth})
    }
  }

  calcScrollBarWidth() { 
    // Default Browser ScrollBar Width
    // Chrome, FF, IE ~ 17px  
    // Edge ~ 12px
    // Safari ~ ?
    // Opera ~ ?
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
    if(!this.props.keepVisible && this.props.autoFadeOut !== undefined) 
      this.fadeHandler();
    else {
      this.setState({showScroll: true});
    }

    this.setState({scrollY: this.scrollAreaContent.scrollTop, scrollX: this.scrollAreaContent.scrollLeft})
  }

  onDragScrollY(scrollTop) {
    this.scrollAreaContent.scrollTop = scrollTop;
  }

  onDragScrollX(scrollLeft) {
    this.scrollAreaContent.scrollLeft = scrollLeft;
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

  onMouseEnter() {
    if(!this.props.keepVisible && this.props.autoFadeOut !== undefined) 
      this.fadeHandler();
    else {
      this.setState({showScroll: true});
    }
  }

  onMouseLeave() {
    if(!this.props.keepVisible)
      this.setState({showScroll:false})
  }

  // If onLoad handler provided, it will fire along with updating the component
  onLoadHandler(child) {
    if(child.props && child.props.onLoad) {
      child.props.onLoad();
    }
    this.update();
  }

  // Recursively bind onLoad handler to applicable elements (frame, iframe, img, input[type=image]) to fire update()
  // Ensures that the scrollbars will continuously update when content finish loading
  setOnLoad(child) {  
    if(child.props && child.props.children) {
      child = React.cloneElement(child, {
        children: React.Children.map(child.props.children, this.setOnLoad)
      })
    }

    if(child.type === "frame" ||
       child.type === "iframe" ||
       child.type === "img" ||
      (child.type === "input" && child.props.type === "image")) 
    {
      return React.cloneElement(child, { onLoad: () => {this.onLoadHandler(child)} })
    }

    return child;
  }

  render() {

    let children = this.props.autoUpdate ? React.Children.map(this.props.children, this.setOnLoad) : this.props.children;

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
      paddingRight: this.state.rightScrollWidth,
      paddingBottom: this.state.bottomScrollWidth,
      overflow: "scroll"
    }

    return (
      <div style={wrapperStyle}
        ref={(scrollArea) => this.scrollArea = scrollArea} 
        className={this.props.wrapperClassNames} 
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}>
      <div style={style}>
        <div 
          onScroll={this.onScroll.bind(this)}
          ref={(scrollAreaContent) => this.scrollAreaContent = scrollAreaContent} 
          style={contentStyle}
        >

            {children}

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
  stayVisible: true,
  fadeInDuration: 0,
  fadeOutDuration: 0,
  offsetScroll: false,
  autoUpdate: true
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
  stayVisible: PropTypes.bool,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  autoFadeOut: PropTypes.number,
  offsetScroll: PropTypes.bool,
  autoUpdate: PropTypes.bool
}