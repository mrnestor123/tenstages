

/// LISTA DE COMPONENTES PARA CREAR MÁS COMPONENTES !!
// TEXTOS Y DEMÁS TAMBIÉN
export { 
    Grid, FlexCol, FlexRow, Container,
    Box, Div, Segment, Tappable, 
    H2, H3, H4, Text,  
    ContainerH, ContainerV, SplitterH,  SplitterV
}


function FlexCol(){
    return {
        view:(vnode)=>{
            let {justifyContent, alignItems} = vnode.attrs


            return m("div",{
                style:{
                    display:'flex',
                    flexDirection:'column',
                    ...vnode.attrs
                }, 
            }, vnode.children)
        }
    }
}

// POR DEFECTO LAS COLUMNAS Y ROWS ESTAN EN EL CENTRO
function FlexRow(){

    return {
        view:(vnode)=>{
            return m("div",{
                style:{
                    display:'flex',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function Grid() {
    let columns = 1
    let lastColumns = 1

    let mobileColumns    
    let tabletColumns    
    let computerColumns

    window.addEventListener("resize",(e)=> {
        if(!mobileColumns && !tabletColumns) return 

        getColumns()

        if(columns != lastColumns) {
            m.redraw()
            lastColumns = columns
        }
    })

    function getColumns() {
        if(mobileColumns && window.innerWidth <= 768){ 
            columns = mobileColumns
        }
        else if(tabletColumns && window.innerWidth <= 992) {
            columns = tabletColumns
        }
        else columns = computerColumns
    }

    return {
        oninit : (vnode)=> {
            if(typeof vnode.attrs.columns == "object") {
                columns = vnode.attrs.columns?.computer
                computerColumns = vnode.attrs.columns?.computer
                mobileColumns = vnode.attrs.columns?.mobile
                tabletColumns = vnode.attrs.columns?.tablet

            }
            else {
                columns = vnode.attrs.columns
                computerColumns = vnode.attrs.columns
            }

            getColumns()
        },
        view : (vnode)=> {
            return m("div",{
                style : {
                    display : "grid",
                    gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
                    ...vnode.attrs,
                }
            },
                vnode.children
            )
        }
    }
}


// UN DIV PARA AÑADIR ESPACIOS
function Box(){

    return {
        view:(vnode)=>{
            return m("div",{
                style:{
                    ...vnode.attrs
                }
            })
        }
    }
}


/*
*
* CONTENEDOR
*
*/
function Div(){
    return {
        view:(vnode)=>{
            return m("div",{
                style:{
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function Tappable(){
    return {
        view:(vnode)=>{
            return m("div",{
                onmouseenter:(e)=>{
                    if(vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => e.target.style[h] = vnode.attrs.hover[h])
                    }
                },
                onmouseleave: (e)=>{
                    if(vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => e.target.style[h] = "")
                    }
                },
                style:{cursor:'pointer'},
                ...vnode.attrs
            }, vnode.children)
        }
    }
}

function Segment(){

    return {
        view:(vnode)=>{
            return m(Div,{
                    padding:'1rem',
                    border:'2px solid #e0e0e0',
                    borderRadius:'1em',
                    ...vnode.attrs
                },
            vnode.children)
        }
    }
}

function Container(){

    return {
        view:(vnode)=>{
            return m(Div,{
                padding:'1em',
                width:'80%',
                margin:'0 auto',
                ...vnode.attrs
            }, vnode.children)
        }

    }

}






/*
*
* TEXTS
*
*/
function H2(){
    return {
        view:(vnode)=>{
            return m("h2",{
                style:{
                    fontFamily:'Poppins',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function H3(){
    return {
        view:(vnode)=>{
            return m("h3",{
                style:{
                    fontFamily:'Poppins',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function H4(){
    return {
        view:(vnode)=>{
            return m("h4",{
                style:{
                    fontFamily:'Poppins',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function Text(){
    return{ 
        view:(vnode)=>{
            return m("p",{
                style:{
                    fontFamily:'Poppins',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function ContainerH() {
    let totalwidth
    let lastwidth
    let width=[]
    let height

    /// !!!! Esto solo la primera vez. Una vez tienen tamaño, no mover, salvo el último.
    function recalculate(children) {
        let last=0
        let previouslast=0
        let assigned=0

        // !!! No ajusta bien el espacio cuando con los primeros segmentos ya se ocupa el 100%

        for(let i=0;i<children.length;i++) {

            // if (children[i]===null) width[i]=0 // Nunca se debe dar este caso
            if (!width[i]) width[i] = 300 // valor inicial

            if (width[i]>0) {
                last=i // El último contenedor ocupado
                assigned += width[i]
            }
        }

        // Eliminamos los espacios que hayan quedado de children que ya no están
        for(let i=children.length; i<width.length;i++) {
            assigned -=width[i]
            width[i]=0 // NO tiene contenido // !!! Mejor recortar el array
        }

        /// !!! hay que averigar si el segmento es nuevo, porque entonces tiene que robar espacio

        // El último ajusta el espacio restante
        if (totalwidth>assigned) {
            console.log("last",last)
            width[last]+=totalwidth-assigned
        }
        else if (totalwidth<assigned ) {

            // console.log("NEGATIVO",totalwidth,totalwidth-assigned,last,width)
            let remaining=assigned-totalwidth
            let j=last-1  // Supondremos que entran por la derecha
            while(remaining>0 && j>=0) {
                if (typeof width[j] !== "undefined") {
                    let cut=remaining>width[j] ? width[j] : remaining
                    width[j] -= cut
                    remaining -= cut
                }
                j--
            }
        }
    }

    return {
        oncreate:({children,dom})=>{
            totalwidth=dom.offsetWidth
            m.redraw() // Ahora que tenemos el tamaño, redibujar
            // recalculate(children) //primer ajuste
            // window.screen.height;
        },
        // onbeforeupdate:(vnode,old)=>{
        //     console.log("ContainerH.onupdate",vnode.children,old)
        // },
        onupdate:(vnode,old)=>{
            totalwidth=vnode.dom.offsetWidth
            // recalculate(vnode.children)

            /// !!! Debería recalcular también cuando cambia algún componente
            // if (totalwidth!==lastwidth) {
            //     // recalculate(vnode.children)
            //     lastwidth=totalwidth
            // }
        },
        oninit:({attrs})=>{
            console.log("oninit")
            height = attrs.height || "100vh"
        },
        view:({children})=>{

            // console.log("ContainerH.onview",children)
            /// Vamos a recalcular cada vez. A ver que pasa

            let notvoid=children.filter(c=>c!==null)
            recalculate(notvoid)

            return m("div",{
                style:`display:inline-flex;overflow:none;width:100%;height:${height};padding:0;`},
                totalwidth
                ? notvoid.map((c,i)=>[
                    m("div",{style:{
                        width:`${width[i]}px`,
                        overflow:"hidden",
                        height:"100%"
                    }},c), // El scroll ha de estar en el hijo

                    i<notvoid.length-1// El último no tiene
                    ? m(SplitterV,{
                        onchange:(e)=>{
                            let max = width[i+1] < e.movementX
                                    ? width[i+1]
                                    : e.movementX < 0 && width[i] < -e.movementX
                                    ? -width[i]
                                    : e.movementX
                            console.log(i,e.movementX,width[i],width[i+1],max)
                            width[i] +=  max
                            width[i+1] -=  max

                            /// !!!! Ajuste. Quitar cuando tengamos una forma mejor de hacerlo. Para que no queden nunca vacios
                            if (width[i+1] === 0) {
                                width[i+1]+=1
                                width[i]-=1
                            }
                            else if (width[i] === 0) {
                                width[i]+=1
                                width[i+1]-=1
                            }
                            /// !!! FIN DEL AJUSTE
                        }
                    })
                    : null
                ])
                : null
            )
        }
    }
}


function ContainerV() {
    let totalheight
    let lastheight
    let height=[]

    function recalculate(children) {
        let last=0
        let assigned=0
        for(let i=0;i<children.length;i++) {
            // valor inicial 200px
            if (typeof height[i] === "undefined") {
                height[i] = children[i]===null ? undefined : 200
            }

            if (height[i]>0) {
                last=i // El último contenedor ocupado
                assigned += height[i]
            }
        }
        // El último ajusta el espacio restante
        if (totalheight>assigned) height[last]+=totalheight-assigned
        else if (totalheight<assigned ) {

            console.log("NEGATIVO",totalheight,totalheight-assigned,last,height)
            let remaining=assigned-totalheight
            let j=last
            while(remaining>0 && j>=0) {
                if (typeof height[j] !== "undefined") {
                    let cut=remaining>height[j] ? height[j] : remaining
                    height[j]-=cut /// Y si no cabe???!!!
                    remaining -= cut
                }
                j--
            }
            console.log(height)
        }
    }

    return {
        oncreate:({children,dom})=>{
            totalheight=dom.offsetHeight
            recalculate(children)
        },
        onupdate:({children,dom})=>{
            totalheight=dom.offsetHeight
            recalculate(children)
            // /// !!! Debería recalcular también cuando cambia algún componente
            // if (totalheight!==lastheight) recalculate(children)
            //     lastheight=totalheight
        },
        view:({children})=>{

            recalculate(children)

            return m("div",{
                ///!!!! 100vw???
                style:"display:flex;flex-direction:column;overflow:none;width:100%;height:100%;padding:0;"},
                children.map((c,i)=>[
                    c!==null
                    ? [
                        m("div",{style:{
                            height:`${height[i]}px`,
                            "overflow":"hidden",
                            "width":"100%"
                        }},c),
                        i<children.length-1
                        ? m(SplitterH,{
                            onchange:(e)=>{
                                let max = e.movementY>0 && height[i+1] < e.movementY
                                        ? height[i+1]
                                        : e.movementY<0 && height[i] < -e.movementY
                                        ? -height[i]
                                        : e.movementY
                                /// !!! Comprobar también condición e.movementY<0
                                // console.log("onchange",height[i],height[i+1],e.movementY,max)
                                height[i] +=  max
                                height[i+1] -=  max
                            }
                        })
                        : null
                    ]
                    :null
                ]))
            }
    }
}


function SplitterH() {
    let selected=false // Esto se puede cambiar por reglas CSS de tailwind onhover
    let onchange
    let active=false

    function drag(e) {
        e.stopPropagation()
        onchange(e)
        m.redraw()
    }

    function stop(e) {
        active=false
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stop);
        m.redraw()
    }

    return {
        oninit: ({attrs}) => {
            //const { position = "left" } = attrs
            if (attrs.onchange) onchange = attrs.onchange
        },
        view: ({attrs})=>{
            return m(".ui",{
                className: selected ? "inverted" : "",
                style:`cursor:ns-resize;height:5px;background:${active||selected?'#00a7e1':'#ddd'}`,
                onmouseenter: () => selected = true,
                onmouseleave: () => selected = false,
                onmousedown: ()=>{
                    active=true
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', stop);
                }
            })
        }
    }
}

//Se puede colocar donde quieras con el atributo position: "top", "bottom", "left", "right".
//Por defecto se coloca a la izquierda.
//Devuelve el evento, así que el tamaño del elemento a modificar se realiza en el callback "onchange"
//ya sea el width (left, right) como el height (top, botttom)
function SplitterV() {
    let selected
    let onchange
    let css = {}
    let barSize = "6px"
    let active=false

    function getCssMode(position) {
        switch (position) {
            case "top": return {
                cursor: "n-resize",
                // width: "100%",
                height: barSize,
                top: "0px"
            };
            case "bottom": return {
                cursor: "n-resize",
                // width: "100%",
                height: barSize,
                bottom: "0px"
            };
            case "left": return {
                cursor: "ew-resize",
                width: barSize,
                // height: "100%",
                // top: "0px",
                // left: `-${barSize}`
            };
            case "right": return {
                cursor: "ew-resize",
                width: barSize,
                // height: "100%",
                // top: "0px",
                // right: `0px`
                //right: `-${barSize}`
            };
        }
    }

    // Si el ratón se mueve sobre un iframe se dejan de recibir eventos.
    // Para corregirlo hay que poner al iframe el style pointer-events:none
    function drag(e) {
        e.stopPropagation()
        e.preventDefault()
        onchange(e)
        m.redraw()
    }

    function stop() {
        //console.log("STOP.STOP.STOP.STOP.STOP.STOP.")
        document.body.style["-webkit-user-select"] = "initial"
        document.body.style["-moz-user-select"] = "initial"
        document.body.style["-ms-user-select"] = "initial"
        document.body.style["user-select"] = "initial"
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stop);
        active=false
        selected=false
        m.redraw()
    }

    return {
        oninit: ({attrs}) => {
            //const { position = "left" } = attrs
            if (attrs.onchange) onchange = attrs.onchange
            if (attrs.barSize) barSize = attrs.barSize
        },
        view: ({attrs}) => {
            const { background = "#ddd", mode = "left" } = attrs
            css = getCssMode(mode)
            return [
                m(".splitter-bar", {
                    onmouseenter: () => selected = true,
                    onmouseleave: () => selected = false,
                    style: {
                        ...css,
                        position: "sticky",  /// PAnel necesita sticky
                         //position: "absolute",
                        "background-color": active ? "#11a7e1" : selected ? "#83d5f2" :  background,
                        "transition" : "0.4s",
                        "border-radius": "2px",
                        // transition: "background-color .7s ease-out .3s",
                        'flex-shrink': 0
                    },
                    onmousedown: (e) => {
                        e.stopPropagation()
                        active=true
                        //console.log("mousedown")
                        document.body.style["-webkit-user-select"] = "none"
                        document.body.style["-moz-user-select"] = "none"
                        document.body.style["-ms-user-select"] = "none"
                        document.body.style["user-select"] = "none"
                        document.addEventListener('mousemove', drag)
                        document.addEventListener('mouseup', stop)
                    }
                })
            ]
        }
    }
}
