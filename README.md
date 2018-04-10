# React Custom Scrollbar

React component for implementing customizable scrollbars

## Compatibility

Currently compatible with *(latest versions)* **Chrome, Firefox, Edge, IE**, (**Safari**, most likely works but not tested)    
~~**DOES NOT** work on **IE** due to `Object.assign()`~~ **(Fixed)**  


## Installation and Dependencies

```
npm install --save react-customized-scrollbar
```

## Usage

The following code is an example with available properties and possible values:
```javascript
import ScrollWrapper from 'react-customized-scrollbar'

<ScrollWrapper
    wrapperStyle={{width: "500px", height: "600px"}}
    verticalScrollStyle={{borderRadius: "4px", backgroundColor: "black"}}
    horizontalScrollStyle={{borderRadius: "4px", backgroundColor: "black"}}
    verticalTrackStyle={{borderRadius: "4px", backgroundColor: "lightgrey"}}
    horizontalTrackStyle={{borderRadius: "4px", backgroundColor: "lightgrey"}}
    wrapperClassNames={"scroll-area-wrapper"}
    verticalScrollClassNames={"scrollbar-vertical"}
    horizontalScrollClassNames={"scrollbar-horizontal"}
    verticalTrackClassNames={"track-vertical"}
    horizontalTrackClassNames={"track-horizontal"}
    minVerticalLength={10}
    minHorizontalLength={10}
    verticalThickness={"8px"}
    horizontalThickness={"8px"}
    stayVisible={false}
    fadeInDuration={700}
    fadeOutDuration={600}
    autoFadeOut={300}
    offsetScroll
    autoUpdate
    onLoadUpdate
    autoHeight
>
    /* Content goes here        
        <div>Hello World!</div>
    */
</ScrollWrapper>
```
## Properties

### Inline Style
#### wrapperStyle = { Object }  
Inline style for scroll area container  

#### verticalScrollStyle = { Object }  
Inline style for vertical scrollbar  

#### horizontalScrollStyle = { Object }  
Inline style for horizontal scrollbar  

#### verticalTrackStyle = { Object }  
Inline style for vertical track  

#### horizontalTrackStyle = { Object }  
Inline style for horizontal track  

### Class Names
#### wrapperClassNames = { String }  
CSS classes for scroll area container  

#### verticalScrollClassNames = { String }  
CSS classes for vertical scrollbar  

#### horizontalScrollClassNames = { String }  
CSS classes for horizontal scrollbar  

#### verticalTrackClassNames = { String }  
CSS classes for vertical track  

#### horizontalTrackClassNames = { String }  
CSS classes for horizontal track

### Visibility
#### stayVisible = { Boolean }  
Allow scrollbar (and track) to always stay visible or be able to hide and apply fade options. `(Default: true)`    

#### fadeInDuration = { Number }
***Applied only when `stayVisible = {false}`***
Duration to completley fade in after a specified number of milliseconds. `(Default: 0)`  

#### fadeOutDuration = { Number }
***Applied only when `stayVisible = {false}`***  
Duration to comepletely fade out after a specified number of milliseconds. `(Default: 0)`  

#### autoFadeOut = { Number }  
***Applied only when `stayVisible = {false}`***
Scrollbar (and track) will automatically fade out after a specified number of milliseconds.

### Other Properties
#### minVerticalLength = { Number }  
Minimum vertical scrollbar length in pixels. `Default: 20`  

#### minHorizontalLength = { Number }  
Minimum horizontal scrollbar length in pixels. `Default: 20`  

#### verticalThickness = { String }  
Thickness of vertical scrollbar (e.g. '10px', '1em', '2rem', etc.)  
*If value is not given, be sure to define thickness (`width`) with `verticalScrollStyle` or `verticalClassNames`*  
*Style will be overwritten if thickness already defined in `verticalScrollStyle`*  

#### horizontalThickness = { String }  
Thickness of horizontal scrollbar (e.g. '10px', '1em', '2rem', etc.)  
*If value is not given, be sure to define thickness (`height`) with `horizontalScrollStyle` or `horizontalClassNames`*  
*Style will be overwritten if thickness already defined in `horizontalScrollStyle`*  

#### offsetScroll = { Boolean }  
If set to `true`, scrollbars will sit outside the perimeter of your scroll area.  
Otherwise, hug the edges but overlap the content.  `(Default: false)`  

#### autoUpdate = { Boolean }  
Updates automatically using [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) `(Default: false)`  
Targets `<ScrollWrapper>` and **all its descendants**  
If set to `false`, the scrollbars may not seem visually accurate. However, scrolling or hovering the scroll area should update the scrollbars accordingly.  

#### onLoadUpdate = { Boolean }  
Updates automatically when content such as images finish loading. `(Default: false)`  
If set to `false`, the scrollbars may not seem visually accurate. However, scrolling or hovering the scroll area should update the scrollbars accordingly.  
Supports `<frame>`, `<iframe>`, `<img>`, `<input type="image">`

#### autoHeight = {Boolean}  
If set to `true`, the height of container will be based on the heights of its content. Also, any height defined in `wrapperStyle` and/or `wrapperClassNames` will be overwritten. `(Default: false)`


## Feedback/Questions

Any feedback or questions are  greatly appreciated! :)

## License

MIT
