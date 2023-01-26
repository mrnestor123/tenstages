// AÑADIR AQUÍ LA WEB

import { Column, Grid, Row } from "./components"

function MainScreen(){
    return {
        view:(vnode)=>{
            return m(Grid,
                m(Row,
                      
                    
                ),
                m(Column,{width:'1-1'}, "PEPEE"),
                
                m(Column,{width:'2-3'}, "GAY"),    
                
            )
        }
    }
}


export {MainScreen}

