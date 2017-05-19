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
      this.setState({verticalThickness, horizontalThickness});
    }
  }

  onDragStart(e) {
    e.preventDefault(); // Prevent text selection while dragging

    if(e.target == this.verticalScroll) 
      document.addEventListener("mousemove", this.onDragY);    
    else if(e.target == this.horizontalScroll)
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
    return this.verticalTrack.offsetWidth;
  }

  getHorizontalWidth() {
    return this.horizontalTrack.offsetHeight;
  }

  calcX() {
    let left, scrollBarLengthX, maxScrollDistX, offsetX;

    let {minHorizontalLength, offsetScroll} = this.props.options;

    minHorizontalLength = minHorizontalLength > 0 ? minHorizontalLength : 20;

    if(this.props.visibleWidth == 0 || this.props.contentWidth == 0 || this.props.visibleWidth >= this.props.contentWidth) {
      scrollBarLengthX = 0;
      left = 0;
      offsetX = 0;
    } 
    else {
      const calcLength = this.props.visibleWidth * (this.props.visibleWidth / this.props.contentWidth);
      scrollBarLengthX = calcLength < minHorizontalLength ? minHorizontalLength : calcLength;
      scrollBarLengthX = scrollBarLengthX >= this.props.visibleWidth ? this.props.visibleWidth : scrollBarLengthX;
      maxScrollDistX = this.props.visibleWidth - scrollBarLengthX;
      if(!offsetScroll) {
        offsetX = -1 * this.state.horizontalThickness;
        if(scrollBarLengthX > this.props.visibleWidth - this.state.verticalThickness) {
          scrollBarLengthX = this.props.visibleWidth - this.state.verticalThickness;
        }
        if(this.props.visibleHeight < this.props.contentHeight) {
          maxScrollDistX -= this.state.verticalThickness;
        }
      }
      else {
        offsetX = 1;
      }      

      maxScrollDistX = maxScrollDistX < 0 ? 0 : maxScrollDistX;

      left = this.props.scrollX * (maxScrollDistX / (this.props.contentWidth - this.props.visibleWidth));
    }

    return {left, scrollBarLengthX, offsetX};
  }

  calcY() {
    let top, scrollBarLengthY, maxScrollDistY, offsetY;

    let {minVerticalLength, offsetScroll} = this.props.options;

    minVerticalLength = minVerticalLength > 0 ? minVerticalLength : 20;

    if(this.props.visibleHeight == 0 || this.props.contentHeight == 0 || this.props.visibleHeight >= this.props.contentHeight) {
      scrollBarLengthY = 0;
      top = 0;
      offsetY = 0;
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

    let xScrollBar = Object.assign({height: options.horizontalThickness}, options.horizontalScrollStyle, {
      position: "absolute", 
      width: `${scrollBarLengthX}px`,
      left: left
    });


    let xTrack = Object.assign({height: options.horizontalThickness}, options.horizontalTrackStyle, {
      position: "absolute",
      width: `${this.props.visibleWidth - (!options.offsetScroll  && scrollBarLengthY > 0 ? this.state.verticalThickness : 0)}px`,
      left: "0",
      top: `${(this.props.visibleHeight + offsetX)}px`
    });

    xTrack = scrollBarLengthX <= 0 ? Object.assign(xTrack, {height: 0}) : xTrack;

    let yScrollBar = Object.assign({width: options.verticalThickness}, options.verticalScrollStyle, {
      position: "absolute",
      height: `${scrollBarLengthY}px`,
      top: top,
      right: "0"
    });

    let yTrack = Object.assign({width: options.verticalThickness}, options.verticalTrackStyle, {
      position: "absolute",
      height: `${this.props.visibleHeight - (!options.offsetScroll  && scrollBarLengthX > 0 ? this.state.horizontalThickness : 0)}px`,
      top: "0",
      right: `${(offsetY)}px`
    });
    
    yTrack = scrollBarLengthY <= 0 ? Object.assign(yTrack, {width: 0}) : yTrack;

    return (
      <div style={containerStyle}>
        <div style={yTrack} ref={verticalTrack => this.verticalTrack = verticalTrack} className={options.verticalTrackClassNames} onMouseEnter={this.onScrollBarEnter.bind(this)} onMouseLeave={this.onScrollBarLeave.bind(this)}>
          <div className={options.verticalScrollClassNames} 
            style={yScrollBar} 
            ref={verticalScroll => this.verticalScroll = verticalScroll}
            onMouseDown={this.onDragStart.bind(this)}>
          </div>
        </div>
        <div style={xTrack} ref={horizontalTrack => this.horizontalTrack = horizontalTrack} className={options.horizontalTrackClassNames} onMouseEnter={this.onScrollBarEnter.bind(this)} onMouseLeave={this.onScrollBarLeave.bind(this)}>
          <div 
            className={options.horizontalScrollClassNames} 
            style={xScrollBar} 
            ref={horizontalScroll => this.horizontalScroll = horizontalScroll} 
            onMouseDown={this.onDragStart.bind(this)}>
          </div>
        </div>
      </div>
    )
  }
}
