# React Scrollbar 
## Compatibility
---
Currently compatible with **Chrome, Firefox, Edge**, (most likely works on **Safari** but not tested)
**DOES NOT** work on **IE** due to `Object.assign()` (Will fix)

## Installation and Dependencies
---
This scrollbar uses JSX and ES6 syntax, so make sure install the necessary plugins.
If you are using [Babel](https://babeljs.io/), you will need plugins, [react](https://babeljs.io/docs/plugins/preset-react/) and [es2015](https://babeljs.io/docs/plugins/preset-es2015/) 

## Usage
---
The following code is an example with possible prop values: 
```javascript
import ScrollWrapper from '..path/to/react-custom-scrollbar' 

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
    offsetScroll={true}
>
    /* Content goes here        
        <div>Hello World!</div> 
    */
</ScrollWrapper>
```
## Properties
---
#### Inline Style
`wrapperStyle = { Object }`
Inline style for scroll area container
`verticalScrollStyle = { Object }`
Inline style for vertical scrollbar 
`horizontalScrollStyle = { Object }`
Inline style for horizontal scrollbar
`verticalTrackStyle = { Object }`
Inline style for vertical track 
`horizontalTrackStyle = { Object }`
Inline style for horizontal track
#### Class Names
`wrapperClassNames = { String }`
CSS classes for scroll area container 
`verticalScrollClassNames = { String }`
CSS classes for vertical scrollbar
`horizontalScrollClassNames = { String }`
CSS classes for horizontal scrollbar
`verticalTrackClassNames = { String }`
CSS classes for vertical track
`horizontalTrackClassNames = { String }`
CSS classes for horizontal track
#### Visibility
`stayVisible = { Boolean }`
Allow scrollbar (and track) to always stay visible or be able to hide and apply fade options. `(Default: true)`

**Applied only when `keepVisible = {false}`**
`fadeInDuration = { Number }`
Duration to completley fade in after a specified number of milliseconds. `(Default: 0)`
`fadeOutDuration = { Number }`
Duration to comepletely fade out after a spcified number of milliseconds. `(Default: 0)`
`autoFadeOut = { Number }`
Scrollbar (and track) will automatically fade out after a specified number of milliseconds. 

#### Other
`minVerticalLength = { Number }`
Minimum vertical scrollbar length in pixels. `Default: 20`
`minHorizontalLength = { Number }`
Minimum horizontal scrollbar length in pixels. `Default: 20`
`verticalThickness = { String }`
Thickness of vertical scrollbar (e.g. '10px', '1em', '2rem', etc.)
*If value is not given, be sure to define thickness (`width`) with `verticalScrollStyle` or `verticalClassNames`*
`horizontalThickness = { String }`
Thickness of horizontal scrollbar (e.g. '10px', '1em', '2rem', etc.)
*If value is not given, be sure to define thickness (`height`) with `horizontalScrollStyle` or `horizontalClassNames`*
`offsetScroll = { Boolean }`
Scrollbar will hug borders but overlap content if false otherwise, sit outside border of scroll area. `Default: false`

#### Feedback/Questions
---
Any feedback or questions is  greatly appreciated! :)

## License

MIT
