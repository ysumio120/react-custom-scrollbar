import React from "react"

export default class ScrollBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      isHovering: false,
      verticalThickness: 0,
      horizontalThickness: 0
    }

    this.onDragY = this.onDragY.bind(this);
    this.onDragX = this.onDragX.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.fadeOutTimeout = this.props.fadeOutTimeout;
  }

  componentDidUpdate(prevProps, prevState) {
    const verticalThickness = this.getVerticalWidth();
    const horizontalThickness = this.getHorizontalWidth();

    if(this.state.verticalThickness !== verticalThickness || this.state.horizontalThickness !== horizontalThickness) {
      console.log("update")
      this.setState({verticalThickness, horizontalThickness});
    }
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

  getVerticalWidth() {
    return this.vertical.offsetWidth;
  }

  getHorizontalWidth() {
    return this.horizontal.offsetHeight;
  }

  calcX() {
    let left, scrollBarLengthX, maxScrollDistX, offsetX;

    const defaultMin = 20; // unit 'px'
    let {minHorizontalLength, offsetScroll} = this.props.options;

    //minHorizontalLength = minHorizontalLength && minHorizontalLength > 0 ? minHorizontalLength : defaultMin;

    if(this.props.visibleWidth == 0 || this.props.contentWidth == 0 || this.props.visibleWidth >= this.props.contentWidth) {
      scrollBarLengthX = 0;
      left = 0;
    } 
    else {
      const calcLength = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      scrollBarLengthX = calcLength < minHorizontalLength ? minHorizontalLength : calcLength;
      scrollBarLengthX = scrollBarLengthX >= this.props.visibleWidth ? this.props.visibleWidth : scrollBarLengthX;
      maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
      if(!offsetScroll) {
        offsetX = 0;
        if(scrollBarLengthX > this.props.visibleWidth - this.state.verticalThickness) {
          scrollBarLengthX = this.props.visibleWidth - this.state.verticalThickness;
        }
        if(this.props.visibleHeight < this.props.contentHeight) {
          maxScrollDistX -= this.state.verticalThickness;
        }
      }
      else {
        maxScrollDistX += 1;
        offsetX = -1 * this.state.horizontalThickness - 1;
      }      

      maxScrollDistX = maxScrollDistX < 0 ? 0 : maxScrollDistX;

      left = this.props.scrollX * (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    }
    return {left, scrollBarLengthX, offsetX};
  }

  calcY() {
    let top, scrollBarLengthY, maxScrollDistY, offsetY;

    const defaultMin = 20; // unit 'px'
    let {minVerticalLength, offsetScroll} = this.props.options;

    //minVerticalLength = minVerticalLength && minVerticalLength > 0 ? minVerticalLength : defaultMin;

    if(this.props.visibleHeight == 0 || this.props.contentHeight == 0 || this.props.visibleHeight >= this.props.contentHeight) {
      scrollBarLengthY = 0;
      top = 0;
    }
    else {
      const calcLength = this.props.visibleHeight * (this.props.visibleHeight / this.props.contentHeight);
      scrollBarLengthY = calcLength < minVerticalLength ? minVerticalLength : calcLength;
      scrollBarLengthY = scrollBarLengthY >= this.props.visibleHeight ? this.props.visibleHeight : scrollBarLengthY;
      maxScrollDistY = this.props.visibleHeight - scrollBarLengthY;
      if(!offsetScroll) {
        offsetY = 0;
        if(scrollBarLengthY > this.props.visibleHeight - this.state.horizontalThickness) {
          scrollBarLengthY = this.props.visibleHeight - this.state.horizontalThickness;
        }
        if(this.props.visibleWidth < this.props.contentWidth) {
          maxScrollDistY -= this.state.horizontalThickness;
        }
      }
      else {
        scrollBarLengthY += 1;
        offsetY = -1 * this.state.verticalThickness - 1;
      }

      maxScrollDistY = maxScrollDistY < 0 ? 0 : maxScrollDistY;

      top = this.props.scrollY * (maxScrollDistY / (this.props.contentHeight - this.props.visibleHeight));
    }

    return {top, scrollBarLengthY, offsetY};
  }

  getFadeDuration() {
    const {fadeInDuration, fadeOutDuration} = this.props.options;
    let duration = 0;

    if(this.props.showScroll || this.state.isHovering) {
      if(fadeInDuration && fadeInDuration > 0)
        duration = (fadeInDuration / 1000);
    }
    else if(fadeOutDuration && fadeOutDuration > 0){
        duration = (fadeOutDuration / 1000);
    }

    return duration;
  }

  onScrollBarEnter(e) {
    if(!this.props.options.stayVisible) {
      clearTimeout(this.fadeOutTimeout);
      this.setState({isHovering: true});
    }
  }

  onScrollBarLeave(e) {
    if(!this.props.options.stayVisible) {
      clearTimeout(this.fadeOutTimeout);
      this.fadeOutTimeout = setTimeout(() => {
        this.setState({isHovering: false});      
      }, this.props.options.autoFadeOut);
    }
  }

  render() {

    const {left, scrollBarLengthX, offsetX} = this.calcX();
    const {top, scrollBarLengthY, offsetY} = this.calcY();

    const options = this.props.options;

    let containerStyle = {
      position: "relative",
      top: `${(-1 * this.props.visibleHeight)}px`,
      opacity: (this.props.showScroll || this.state.isHovering || this.state.isDragging) ? 
                "1.0" : options.stayVisible ? 
                  "1.0": "0.0",
      transition: `opacity ${this.getFadeDuration()}s`
    }

    let xScrollBar = Object.assign(options.horizontalScrollStyle, {
      position: "absolute",
      width: `${scrollBarLengthX}px`,
      height: options.horizontalThickness,
      left: left,
      backgroundColor: "black"
    });

    let xTrack = Object.assign(options.horizontalTrackStyle, {
      position: "absolute",
      width: `${this.props.visibleWidth - (!options.offsetScroll ? this.state.verticalThickness : 0)}px`,
      height: options.horizontalThickness,
      left: "0",
      bottom: "0",
      bottom: `${(-1 * this.props.visibleHeight + offsetX)}px`
    });

    let yScrollBar = Object.assign(options.verticalScrollStyle, {
      position: "absolute",
      height: `${scrollBarLengthY}px`,
      width: options.verticalThickness,
      top: top,
      right: "0",
      "backgroundColor": "black"
    });

    let yTrack = Object.assign(options.verticalTrackStyle, {
      position: "absolute",
      height: `${this.props.visibleHeight - (!options.offsetScroll ? this.state.horizontalThickness : 0)}px`,
      width: options.verticalThickness,
      top: "0",
      right: `${(offsetY)}px`
    });
    

    return (
      <div style={containerStyle}>
        <div style={yTrack} className={options.verticalTrackClassNames} onMouseEnter={this.onScrollBarEnter.bind(this)} onMouseLeave={this.onScrollBarLeave.bind(this)}>
          <div className={options.verticalScrollClassNames} 
            style={yScrollBar} 
            ref={vertical => this.vertical = vertical} 
            onMouseDown={this.onDragStart.bind(this)}>
          </div>
        </div>
        <div style={xTrack} className={options.horizontalTrackClassNames} onMouseEnter={this.onScrollBarEnter.bind(this)} onMouseLeave={this.onScrollBarLeave.bind(this)}>
          <div 
            className={options.horizontalScrollClassNames} 
            style={xScrollBar} 
            ref={horizontal => this.horizontal = horizontal} 
            onMouseDown={this.onDragStart.bind(this)}>
          </div>
        </div>
      </div>
    )
  }
}
