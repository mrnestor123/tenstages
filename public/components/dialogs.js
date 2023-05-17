
// DIÁLOGOS DE ALERTA Y CONFIRMACIÓN

import { Button } from "./components.js";


function showAlert(options={}){
    var elem = document.createElement("div")
    elem.style = 'position:fixed;inset:0px;z-index:100000'
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);
    
    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        view:()=> m(AlertDialog,{
            title: options.noTitle ? '' : options.title || 'Error',
            message:options.message, 
            
            close:(e)=> {
                elem.remove()
                options.then ? options.then() :null
            }
        },  options.children ? options.children : null
        )
    })
}

function AlertDialog(){
    return {
        view:(vnode)=>{
            let {title,message, close} = vnode.attrs

            return m("div",{style:"position:fixed;bottom:0;right:0;top:0;left:0;z-index:100000; background-color:rgba(0,0,0,0.5);"},
                m("div", // centered content container 
                    {
                        style:"position:absolute; top:50%; left:50%; transform: translate(-50%, -50%);",
                    },

                    // TODO: CREAR LA TRANSICIÓN SIN SEMANTIC !! 
                    m("div",{style:"border-radius:10px;min-width: 350px;font-size:1.1em; padding:1em;background-color:white; color:black;",class:"uk-animation-scale-up"},
                        /*m("div",{style:"text-align:left"},
                            m(Icon,{icon:'error', color:'red',size:'large'}),
                        ),*/
                        title ? m("h3", title) : null,
                        message ? m("p", message) : null,
                        vnode.children ? vnode.children : null,

                        m(Button,{
                            type:'primary',
                            //style:"border-radius:10px;width:100%;text-align:center;",
                            onclick: close
                        },'OK'
                    )
                )
            ))
        }
    }
}






export {  showAlert}