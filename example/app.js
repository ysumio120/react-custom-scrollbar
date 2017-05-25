import React from "react"
import ReactDOM from "react-dom"

import ScrollWrapper from '../lib'

const Root = document.getElementById('root')

let style = {
     position: "relative",
     width:"800px", 
     height:"500px",
     padding: "15px",
     border: "5px solid red",
     margin: "auto"
}

let wrapperStyle = {
      position: "relative",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: "10px"
}

ReactDOM.render(
     <div style={style}>
          <ScrollWrapper
               wrapperStyle={wrapperStyle}
               verticalScrollStyle={{borderRadius: "5px"}}
               horizontalScrollStyle={{borderRadius: "4px", height: "8px"}}
               verticalTrackStyle={{borderRadius: "4px"}}
               horizontalTrackStyle={{borderRadius: "4px"}}
               wrapperClassNames={"scroll-area-wrapper"}
               verticalScrollClassNames={"scrollbar-vertical"}
               horizontalScrollClassNames={"scrollbar-horizontal"}
               verticalTrackClassNames={"track-vertical"}
               horizontalTrackClassNames={"track-horizontal"}
               // minVerticalLength={400}
               // minHorizontalLength={400}
               verticalThickness={"10px"}
               horizontalThickness={"8px"}
               // stayVisible={false}
               fadeInDuration={700}
               fadeOutDuration={600}
               // autoFadeOut={300}
               //offsetScroll={true}
               autoUpdate= {true}
               onLoadUpdate= {true}
          >

               <img src="http://placehold.it/1200x1000"/>
               <img src="http://placehold.it/800x650"/>
               <input type="image" src="http://placehold.it/950x1050"/>
               <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare orci lectus, nec bibendum diam porta ac.
                    In porttitor aliquam est. Nam sapien sem, rhoncus eget molestie non, porttitor vitae purus. Fusce ac ullamcorper
                    nibh, sit amet pharetra tortor. Phasellus vitae viverra ex. Vestibulum massa massa, cursus in nulla congue, 
                    bibendum fringilla neque. Vestibulum vel ex nibh. Donec scelerisque commodo fermentum.

                    Ut nisi lacus, porta id congue ac, egestas sed ante. Etiam semper sapien non consectetur tincidunt. Duis commodo 
                    mattis eros, a euismod nibh feugiat vitae. Aliquam et sollicitudin nisl. Cras fermentum metus mauris, eu malesuada 
                    ipsum imperdiet at. Quisque in commodo libero, et mollis purus. Nam imperdiet bibendum dolor, id hendrerit nisi 
                    efficitur condimentum. Integer odio libero, tincidunt non egestas sed, vestibulum quis nunc. Fusce enim lectus, 
                    molestie eu nibh sit amet, gravida vulputate neque. Ut et tempor erat. Etiam quis elit eu ante congue tempor.

                    Pellentesque suscipit sem non elit porttitor, non imperdiet sapien maximus. Pellentesque quis mi magna. Praesent 
                    efficitur efficitur lorem, id convallis nisi tempor quis. Nam augue sapien, laoreet ut ante a, tincidunt mollis 
                    nibh. Vivamus sit amet lectus dignissim, mattis urna ut, imperdiet neque. Pellentesque eu diam in turpis ultrices 
                    bibendum ut eu orci. Morbi sodales massa mi, ut porttitor nunc blandit id. Mauris suscipit mi in dapibus venenatis. 
                    Morbi eu ex gravida, convallis tellus id, faucibus diam.
                    <div><img src="http://placehold.it/350x550"/></div>
               </div>
          </ScrollWrapper>
     </div>
     , Root);


