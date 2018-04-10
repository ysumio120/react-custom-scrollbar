import React from "react"

import PropTypes from 'prop-types'

import ScrollBar from "./ScrollBar"

import util from '../util'

export default class ScrollWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleWidth: 0,
      visibleHeight: 0,
      contentWidth: 0,
      contentHeight: 0,
      rightScrollWidth: 20,
      bottomScrollWidth: 20,
      scrollX: 0,
      scrollY: 0,
      showScroll: false
    }

    this.fadeOutTimeout = null;
    this.observer = null;
    this.update = this.update.bind(this);
    this.setOnLoad = this.setOnLoad.bind(this);
  }

  componentDidMount() {
    if(this.props.autoUpdate) {
      this.mutationObserver();
    }

    window.addEventListener('resize', this.update);
    const {rightScrollWidth, bottomScrollWidth} = util.calcScrollBarWidth.call(this);
    
    // Initialization
    this.setState({
      visibleWidth: Math.round(this.scrollAreaContent.getBoundingClientRect().width - rightScrollWidth),
      visibleHeight: Math.round(this.scrollAreaContent.getBoundingClientRect().height - bottomScrollWidth),
      contentWidth: this.scrollAreaContent.scrollWidth,
      contentHeight: this.scrollAreaContent.scrollHeight,
      rightScrollWidth: rightScrollWidth,
      bottomScrollWidth: bottomScrollWidth      
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
    if(this.observer) {
      this.observer.disconnect();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.update();
  }

  mutationObserver() {
    const target = this.scrollArea;
  
    const component = this;

    this.observer = new MutationObserver((mutations) => {
        component.update();
    });
 
    var config = { childList: true, subtree: true, attributes: true, characterData: true };
 
    this.observer.observe(target, config);
  }

  update() {
    // Allows browser to repaint first before checking values
    // Without setTimeout, we may get values that lead to unwanted behavior 
    setTimeout(() => {

      const {visibleWidth, visibleHeight} = this.getVisibleDimen();
      const {contentWidth, contentHeight} = this.getContentDimen();

      const {rightScrollWidth, bottomScrollWidth} = util.calcScrollBarWidth.call(this);

      // *****VERY UNPREDICTABLE AND SITUATIONAL******
      // Workaround to deal with values when zooming in/out
      // Problem mainly occurs when using Chrome (infinite loop when updating values)
      // Factors: no fractional scrollHeight/Width and rounding

      if(Math.abs(this.state.contentWidth - contentWidth) > 1) {
        this.setState({contentWidth, rightScrollWidth, bottomScrollWidth})
      }
      if(Math.abs(this.state.contentHeight - contentHeight) > 1) {
        this.setState({contentHeight, rightScrollWidth, bottomScrollWidth})
      } 
      
      if(this.state.visibleWidth !== visibleWidth || 
         this.state.visibleHeight !== visibleHeight) 
      {
        this.setState({visibleWidth, visibleHeight, rightScrollWidth, bottomScrollWidth})
      }

    }, 0)

  }

  getVisibleDimen() {
    let visibleWidth = Math.round(this.scrollAreaContent.getBoundingClientRect().width - this.state.rightScrollWidth);
    let visibleHeight = Math.round(this.scrollAreaContent.getBoundingClientRect().height - this.state.bottomScrollWidth);

    if(visibleWidth < 0)
      visibleWidth = 0;
    if(visibleHeight < 0)
      visibleHeight = 0;

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
    let children = this.props.onLoadUpdate ? React.Children.map(this.props.children, this.setOnLoad) : this.props.children;

    let wrapperStyle = this.props.autoHeight ? util.merge(this.props.wrapperStyle, {height: "auto"}) : this.props.wrapperStyle;

    let style = {
      position: "relative",
      height: "100%",
      width: "100%",
      overflow: "hidden"
    }
    
    const { rightScrollWidth, bottomScrollWidth } = this.state;

    const contentStyle = this.props.autoHeight ? 
      {
        marginRight: rightScrollWidth ? `${-1 * rightScrollWidth}px` : 0,
        marginBottom: bottomScrollWidth ? `${-1 * bottomScrollWidth}px` : 0,
        overflow: "scroll"
      }
      :
      {
        width:`calc(100% + ${rightScrollWidth}px)`,
        height:`calc(100% + ${bottomScrollWidth}px)`,
        position: "absolute",
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
  autoUpdate: false,
  onLoadUpdate: false,
  autoHeight: false
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
  autoUpdate: PropTypes.bool,
  onLoadUpdate: PropTypes.bool,
  autoHeight: PropTypes.bool
}