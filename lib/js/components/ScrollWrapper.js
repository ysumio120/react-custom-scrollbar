"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ScrollBar = require("./ScrollBar");

var _ScrollBar2 = _interopRequireDefault(_ScrollBar);

var _util = require("../util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollWrapper = function (_React$Component) {
  _inherits(ScrollWrapper, _React$Component);

  function ScrollWrapper(props) {
    _classCallCheck(this, ScrollWrapper);

    var _this = _possibleConstructorReturn(this, (ScrollWrapper.__proto__ || Object.getPrototypeOf(ScrollWrapper)).call(this, props));

    _this.state = {
      visibleWidth: 0,
      visibleHeight: 0,
      contentWidth: 0,
      contentHeight: 0,
      rightScrollWidth: 20,
      bottomScrollWidth: 20,
      scrollX: 0,
      scrollY: 0,
      showScroll: false
    };

    _this.fadeOutTimeout = null;
    _this.observer = null;
    _this.update = _this.update.bind(_this);
    _this.setOnLoad = _this.setOnLoad.bind(_this);
    return _this;
  }

  _createClass(ScrollWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoUpdate) {
        this.mutationObserver();
      }

      window.addEventListener('resize', this.update);

      var _util$calcScrollBarWi = _util2.default.calcScrollBarWidth.call(this),
          rightScrollWidth = _util$calcScrollBarWi.rightScrollWidth,
          bottomScrollWidth = _util$calcScrollBarWi.bottomScrollWidth;

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
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.update);
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      this.update();
    }
  }, {
    key: "mutationObserver",
    value: function mutationObserver() {
      var target = this.scrollArea;

      var component = this;

      this.observer = new MutationObserver(function (mutations) {
        component.update();
      });

      var config = { childList: true, subtree: true, attributes: true, characterData: true };

      this.observer.observe(target, config);
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      // Allows browser to repaint first before checking values
      // Without setTimeout, we may get values that lead to unwanted behavior 
      setTimeout(function () {
        var _getVisibleDimen = _this2.getVisibleDimen(),
            visibleWidth = _getVisibleDimen.visibleWidth,
            visibleHeight = _getVisibleDimen.visibleHeight;

        var _getContentDimen = _this2.getContentDimen(),
            contentWidth = _getContentDimen.contentWidth,
            contentHeight = _getContentDimen.contentHeight;

        var _util$calcScrollBarWi2 = _util2.default.calcScrollBarWidth.call(_this2),
            rightScrollWidth = _util$calcScrollBarWi2.rightScrollWidth,
            bottomScrollWidth = _util$calcScrollBarWi2.bottomScrollWidth;

        // *****VERY UNPREDICTABLE AND SITUATIONAL******
        // Workaround to deal with values when zooming in/out
        // Problem mainly occurs when using Chrome (infinite loop when updating values)
        // Factors: no fractional scrollHeight/Width and rounding

        if (Math.abs(_this2.state.contentWidth - contentWidth) > 1) {
          _this2.setState({ contentWidth: contentWidth, rightScrollWidth: rightScrollWidth, bottomScrollWidth: bottomScrollWidth });
        }
        if (Math.abs(_this2.state.contentHeight - contentHeight) > 1) {
          _this2.setState({ contentHeight: contentHeight, rightScrollWidth: rightScrollWidth, bottomScrollWidth: bottomScrollWidth });
        }

        if (_this2.state.visibleWidth !== visibleWidth || _this2.state.visibleHeight !== visibleHeight) {
          _this2.setState({ visibleWidth: visibleWidth, visibleHeight: visibleHeight, rightScrollWidth: rightScrollWidth, bottomScrollWidth: bottomScrollWidth });
        }
      }, 0);
    }
  }, {
    key: "getVisibleDimen",
    value: function getVisibleDimen() {
      var visibleWidth = Math.round(this.scrollAreaContent.getBoundingClientRect().width - this.state.rightScrollWidth);
      var visibleHeight = Math.round(this.scrollAreaContent.getBoundingClientRect().height - this.state.bottomScrollWidth);

      if (visibleWidth < 0) visibleWidth = 0;
      if (visibleHeight < 0) visibleHeight = 0;

      return { visibleWidth: visibleWidth, visibleHeight: visibleHeight };
    }
  }, {
    key: "getContentDimen",
    value: function getContentDimen() {
      var contentWidth = this.scrollAreaContent.scrollWidth;
      var contentHeight = this.scrollAreaContent.scrollHeight;

      return { contentWidth: contentWidth, contentHeight: contentHeight };
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      if (!this.props.keepVisible && this.props.autoFadeOut !== undefined) this.fadeHandler();else {
        this.setState({ showScroll: true });
      }

      this.setState({ scrollY: this.scrollAreaContent.scrollTop, scrollX: this.scrollAreaContent.scrollLeft });
    }
  }, {
    key: "onDragScrollY",
    value: function onDragScrollY(scrollTop) {
      this.scrollAreaContent.scrollTop = scrollTop;
    }
  }, {
    key: "onDragScrollX",
    value: function onDragScrollX(scrollLeft) {
      this.scrollAreaContent.scrollLeft = scrollLeft;
    }
  }, {
    key: "fadeHandler",
    value: function fadeHandler() {
      var _this3 = this;

      var _props = this.props,
          fadeInDuration = _props.fadeInDuration,
          autoFadeOut = _props.autoFadeOut;


      clearTimeout(this.fadeOutTimeout);

      this.setState({ showScroll: true }, function () {
        clearTimeout(_this3.fadeOutTimeout);
        _this3.fadeOutTimeout = setTimeout(function () {
          _this3.setState({ showScroll: false });
        }, fadeInDuration + autoFadeOut);
      });
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter() {
      if (!this.props.keepVisible && this.props.autoFadeOut !== undefined) this.fadeHandler();else {
        this.setState({ showScroll: true });
      }
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave() {
      if (!this.props.keepVisible) this.setState({ showScroll: false });
    }

    // If onLoad handler provided, it will fire along with updating the component

  }, {
    key: "onLoadHandler",
    value: function onLoadHandler(child) {
      if (child.props && child.props.onLoad) {
        child.props.onLoad();
      }
      this.update();
    }

    // Recursively bind onLoad handler to applicable elements (frame, iframe, img, input[type=image]) to fire update()
    // Ensures that the scrollbars will continuously update when content finish loading

  }, {
    key: "setOnLoad",
    value: function setOnLoad(child) {
      var _this4 = this;

      if (child.props && child.props.children) {
        child = _react2.default.cloneElement(child, {
          children: _react2.default.Children.map(child.props.children, this.setOnLoad)
        });
      }

      if (child.type === "frame" || child.type === "iframe" || child.type === "img" || child.type === "input" && child.props.type === "image") {
        return _react2.default.cloneElement(child, { onLoad: function onLoad() {
            _this4.onLoadHandler(child);
          } });
      }

      return child;
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var children = this.props.onLoadUpdate ? _react2.default.Children.map(this.props.children, this.setOnLoad) : this.props.children;

      var wrapperStyle = this.props.wrapperStyle;

      var style = {
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden"
      };

      var contentStyle = {
        width: "calc(100% + " + this.state.rightScrollWidth + "px)",
        height: "calc(100% + " + this.state.bottomScrollWidth + "px)",
        position: "absolute",
        overflow: "scroll"
      };

      return _react2.default.createElement(
        "div",
        { style: wrapperStyle,
          ref: function ref(scrollArea) {
            return _this5.scrollArea = scrollArea;
          },
          className: this.props.wrapperClassNames,
          onMouseEnter: this.onMouseEnter.bind(this),
          onMouseLeave: this.onMouseLeave.bind(this) },
        _react2.default.createElement(
          "div",
          { style: style },
          _react2.default.createElement(
            "div",
            {
              onScroll: this.onScroll.bind(this),
              ref: function ref(scrollAreaContent) {
                return _this5.scrollAreaContent = scrollAreaContent;
              },
              style: contentStyle
            },
            children
          )
        ),
        _react2.default.createElement(_ScrollBar2.default, {
          options: this.props,
          onDragScrollX: this.onDragScrollX.bind(this),
          onDragScrollY: this.onDragScrollY.bind(this),
          visibleWidth: this.state.visibleWidth,
          visibleHeight: this.state.visibleHeight,
          contentWidth: this.state.contentWidth,
          contentHeight: this.state.contentHeight,
          scrollY: this.state.scrollY,
          scrollX: this.state.scrollX,
          showScroll: this.state.showScroll,
          fadeOutTimeout: this.fadeOutTimeout })
      );
    }
  }]);

  return ScrollWrapper;
}(_react2.default.Component);

exports.default = ScrollWrapper;


ScrollWrapper.defaultProps = {
  minVerticalLength: 20,
  minHorizontalLength: 20,
  stayVisible: true,
  fadeInDuration: 0,
  fadeOutDuration: 0,
  offsetScroll: false,
  autoUpdate: false,
  onLoadUpdate: false
};

ScrollWrapper.propTypes = {
  wrapperStyle: _propTypes2.default.object,
  verticalScrollStyle: _propTypes2.default.object,
  horizontalScrollStyle: _propTypes2.default.object,
  verticalTrackStyle: _propTypes2.default.object,
  horizontalTrackStyle: _propTypes2.default.object,
  wrapperClassNames: _propTypes2.default.string,
  verticalScrollClassNames: _propTypes2.default.string,
  horizontalScrollClassNames: _propTypes2.default.string,
  verticalTrackClassNames: _propTypes2.default.string,
  horizontalTrackClassNames: _propTypes2.default.string,
  minVerticalLength: _propTypes2.default.number,
  minHorizontalLength: _propTypes2.default.number,
  verticalThickness: _propTypes2.default.string,
  horizontalThickness: _propTypes2.default.string,
  stayVisible: _propTypes2.default.bool,
  fadeInDuration: _propTypes2.default.number,
  fadeOutDuration: _propTypes2.default.number,
  autoFadeOut: _propTypes2.default.number,
  offsetScroll: _propTypes2.default.bool,
  autoUpdate: _propTypes2.default.bool,
  onLoadUpdate: _propTypes2.default.bool
};