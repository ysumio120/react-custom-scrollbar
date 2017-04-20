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
      scrollX: 0,
      scrollY: 0,
      showScroll: false
    }

  }

  componentDidMount() {
    this.setState({
      visibleWidth: this.scrollAreaContent.clientWidth,
      visibleHeight: this.scrollAreaContent.clientHeight,
      contentWidth: this.scrollAreaContent.scrollWidth,
      contentHeight: this.scrollAreaContent.scrollHeight,      
    })
    // console.log(this.scrollArea.clientWidth);
    // console.log(this.scrollArea.clientHeight);
    // console.log(this.scrollAreaContent.clientWidth); // visible content width
    // console.log(this.scrollAreaContent.clientHeight); // viisble content height
    // console.log(this.scrollAreaContent.scrollWidth);
    // console.log(this.scrollAreaContent.scrollHeight);
  }

  onScroll() {
    //if(this.scrollAreaContent.scrollTop + this.state.visibleHeight <= this.state.contentHeight)
      this.setState({scrollY: this.scrollAreaContent.scrollTop, scrollX: this.scrollAreaContent.scrollLeft})
    //if(this.scrollAreaContent.scrollLeft + this.state.visibleWidth <= this.state.contentWidth)
      // this.setState({scrollX: this.scrollAreaContent.scrollLeft})
  }

  onDragScrollY(scrollTop) {
    this.scrollAreaContent.scrollTop = scrollTop;
  }

  onDragScrollX(scrollLeft) {
    this.scrollAreaContent.scrollTop = scrollTop;
  }

  onMouseEnter() {
    this.setState({showScroll: true});
  }

  onMouseLeave() {
    this.setState({showScroll: false});
  }


  render() {
    let style = {
      position: "relative",
      height: "400px",
      width: "600px",
      overflow: "hidden"
    }

    let style1 = {
      width: "100%",
      height: "100%",
      position: "absolute",
      paddingRight:"17px",
      paddingBottom: "17px",
      overflow: "auto"
    }

    return (
      <div ref={(scrollArea) => this.scrollArea = scrollArea} 
        style={style} 
        className="scroll-area" 
        onMouseEnter={this.onMouseEnter.bind(this)} 
        onMouseLeave={this.onMouseLeave.bind(this)}>
        <div 
          onScroll={this.onScroll.bind(this)}
          ref={(scrollAreaContent) => this.scrollAreaContent = scrollAreaContent} 
          className="scroll-area-content" 
          style={style1}
        >

            {this.props.children}

        </div>
        <ScrollBar
          onDragScrollX={this.onDragScrollX}
          onDragScrollY={this.onDragScrollY} 
          visibleWidth={this.state.visibleWidth} 
          visibleHeight={this.state.visibleHeight} 
          contentWidth={this.state.contentWidth} 
          contentHeight={this.state.contentHeight} 
          scrollY={this.state.scrollY} 
          scrollX={this.state.scrollX}
          showScroll={this.state.showScroll}/>
      </div>
    )
  }
}
