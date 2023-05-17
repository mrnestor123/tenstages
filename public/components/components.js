/**
// Componentes genéricos de UIkit para mithrilJS

/**
 * Componente Grid de UIkit
 * @param { String } size  small | medium | large
 * @param { String } rowgap  small | medium | large | collapse
 * @param { String } columngap  small | medium | large | collapse
 * @param { Boolean } divider true | false
 * @param { Boolean } match true | false
 * @param { Boolean } center true | false
 * @param { Boolean } verticalalign true | false
 * @param { String } childWidth 1-1 | 1-2 | 1-3 | 1-4 | 1-5 | 1-6 | 2-3 | 2-5 | 3-4 | 3-5 | 4-5 | 5-6
 * @param { Boolean } sortable  true | false
 * @param { String } align  left | center | right
 * @param { Boolean } masonry  true | false
*/
function Grid() {
    let clase = ''
    return {
        oninit: (vnode) => {

            let { divider, match, rowgap, columngap, size, center, align, sortable, verticalalign, childWidth } = vnode.attrs

            clase = (match ? ' uk-grid-match' : '') +
                    (size ? ' uk-grid-' + size : '') +
                    (center ? ' uk-flex-center ' : '') +
                    (rowgap ? ' uk-grid-row-' + rowgap : '') +
                    (verticalalign ? 'uk-flex-middle' : '') + 
                    (columngap ? ' uk-grid-column-' + columngap : '') +
                    (divider ? ' uk-grid-divider' : '') +
                    (align ? ' uk-align-' + align : '') + 
                    (childWidth ? ' uk-child-width-' + childWidth : '')

            //Mejorable
            sortable = sortable ? ['uk-sortable', "handle: .uk-card"] : [undefined, undefined]
        },
        view: (vnode) => {
            return m("div", {
                'uk-grid': vnode.attrs.masonry ? 'masonry:true' : '',
                class: clase,
                style: vnode.attrs.style,
                'uk-sortable': vnode.attrs.sortable ? "handle: " + vnode.attrs.sortable : undefined
            }, vnode.children)
        }

    }

}

/**
 * Componente Row de UIkit
 */
function Row() {
    return {
        view: (vnode) => {
            return m(".uk-width-1-1.uk-flex.uk-flex-row", vnode.attrs, vnode.children)

        }
    }
}

/**
 * Componente Flex de UIkit
 * @param {Boolean} inline true | false
 * @param {String} horizAlign left | center | right | around | between
 * @param {String} vertAlign stretch | top | middle | bottom
 * @param {String} direction row | column | row-reverse | column-reverse
 * @param {String} wrap wrap | nowrap | wrap-reverse
 */
function Flex() {
    let clase = '';
    return {
        oninit: (vnode) => {
            let { inline, hAlign, vAlign, direction, wrap, width } = vnode.attrs
            clase = (inline ? 'uk-flex-inline' : 'uk-flex') +
                (hAlign ? ' uk-flex-' + hAlign : '') +
                (vAlign ? ' uk-flex-' + vAlign : '') +
                (direction ? ' uk-flex-' + direction : '') +
                (width ? ' uk-width-' + width : '')  +
                (wrap ? ' uk-flex-' + wrap : '')
        },
        view: (vnode) => {
            return m(`.uk-flex ${clase}`, vnode.attrs, vnode.children)
        }
    }
}

/**
 * Componente Column de UIkit
 * @param { String } width 1-1 | 1-2 | 1-3 | 1-4 | 1-5 | 1-6 | 2-3 | 2-5 | 3-4 | 3-5 | 4-5 | 5-6
 */
function Column() {
    return {
        view: (vnode) => {
            //no queremos que salga en los atributos. !!mejorable
            let width = vnode.attrs.width;
            delete vnode.attrs.width;
            return m(`.uk-width-${width}`, vnode.attrs, vnode.children)

        }
    }
}

/**
 * Componente Card de UIkit
 * @param { String } type  default | primary | secondary 
 * @param { String } size  small | large
 * @param { Boolean } hover true | false
 */
function Card() {
    return {
        view: (vnode) => {
            let { type, size, hover } = vnode.attrs
            return m('.uk-card ' +
                (type ? 'uk-card-' + type + ' ' : 'uk-card-default ') +
                (size ? 'uk-card-' + size + ' ' : '') +
                (hover ? 'uk-card-hover' : ''), vnode.attrs, vnode.children)

        }
    }
}

/**
 * Componente CardBody de UIkit
 */
function CardBody() {
    return {
        view: (vnode) => {
            return m(".uk-card-body", vnode.attrs, vnode.children)
        }
    }
}

/**
 * Componente CardMedia de UIkit
 * @param { String } position  top | bottom
 */
function CardMedia() {
    return {
        view: (vnode) => {
            return m(`.uk-card-media-${vnode.attrs.position || 'top'}`, vnode.attrs, vnode.children)
        }
    }
}

/**
 * Componente CardHeader de UIkit
 */
function CardHeader() {
    return {
        view: (vnode) => {
            return m(`div.uk-card-header`, vnode.attrs, vnode.children)
        }
    }
}

/**
 * Componente CardFooter de UIkit
 */
function CardFooter() {
    return {
        view: (vnode) => {
            return m(`div.uk-card-footer`, vnode.attrs, vnode.children)
        }
    }
}

/**
 * Componente CardTitle de UIkit
 * @param { String } size  small | large
 * Fala pegarle un repaso brutal
 */
function TextField() {
    let types = {
        "textarea": { class: "uk-textarea" },
        "input": { class: "uk-input", type: "text" },
        "password": { class: "uk-input", type: "password" },
        "number": { class: "uk-input", type: "number" },
        'time': { class: 'uk-input', type:'time'},
        'checkbox': { class: 'uk-checkbox', type:'checkbox'},
        'date': {class:'uk-input',type:'date'}
    }

    return {
        view: (vnode) => {
            let { data, id, name, type = 'input', oninput, style, rows } = vnode.attrs
            return type != "textarea" ?                  
                    m("input",
                    {
                        class: type ? types[type].class : types['input'].class,
                        //style: style || '',
                        id: id || undefined,
                        type: type ? types[type].type : 'text',
                        value: data[name],
                        width: vnode.attrs.width || undefined,
                        autocomplete: "off",
                        oninput: (e) => {
                            if(type =='checkbox'){ data[name] = e.target.checked}
                            else if (type == "number") { data[name] = Number(e.target.value) }
                            else { data[name] = e.target.value; }
                            
                            if (oninput) oninput(e)
                        },
                    }
                ) :
                m("textarea",
                    {
                        class: types[type].class,
                        style: style || '',
                        rows: rows || "2",
                        value: data[name],
                        oninput: (e) => { data[name] = e.target.value; if (oninput) oninput(e) },
                    }
                )
        }
    }
}

/**
 * Componente Button de UIkit
 * @param { String } type  default | primary | secondary
 * @param { String } size  small | large
 * @param { String } width  1-1 | 1-2 | 1-3 | 1-4 | 1-5 | 1-6 | 2-3 | 2-5 | 3-4 | 3-5 | 4-5 | 5-6
 * @param { Boolean } disabled true | false
 */
function Button() {
    let clase = '';
    return {
        oninit: (vnode) => {
            clase = 'button.uk-button ' 
                + (vnode.attrs.type ? 'uk-button-' + vnode.attrs.type + ' ' : '')
                + (vnode.attrs.size ? 'uk-button-' + vnode.attrs.size + ' ' : '')
                + (vnode.attrs.width ? 'uk-width-' + vnode.attrs.width + ' ' : '')
        },
        view: (vnode) => {
            return m(clase, {
                style: vnode.attrs.style || undefined,
                class: vnode.attrs.class || undefined,
                onclick: vnode.attrs.onclick || undefined,
                'uk-toggle': vnode.attrs.target ? `target:${vnode.attrs.target}` : undefined
            }, vnode.children)
        }
    }
}

//children es un array de ['value':'x', 'label':1], tmb puede no llevar value y ser solo las labels [1,2,3,4]
function Select() {
    let data, name;

    let selectedoption = null

    return {
        oninit: (vnode) => {
        },
        view: (vnode) => {
            data = vnode.attrs.data
            name = vnode.attrs.name

            return m("select.uk-select",
                {
                    onchange: (e) => {
                        if(data && name != undefined){
                            data[name] = e.target.value;
                            if (data[name].startsWith('[object')) {
                                data[name] = vnode.children[e.target.selectedIndex].value
                            }
                        }
                        vnode.attrs.onchange ? vnode.attrs.onchange(e) : null
                    },
                    value:  data && name != undefined ? data[name] || ''  : '',
                },
                [

                     vnode.children.map((child, i) => {
                        if (child.value) {
                            return m("option", { value: child.value }, child.label)
                        } else {
                            return m("option", child)
                        }
                    })
                ]
            )
        }
    }
}

/**
 * Componente Section de UIkit
 * @param { String } type  default | primary | secondary | muted
 * @param { String } size  xsmall | small | large | xlarge
 * @param { String } width  1-1 | 1-2 | 1-3 | 1-4 | 1-5 | 1-6 | 2-3 | 2-5 | 3-4 | 3-5 | 4-5 | 5-6
 * @param { String } style  style inline
 */
function Section() {
    let clase = 'uk-section'
    return {
        oninit: (vnode) => {
            clase += (vnode.attrs.type ? ' uk-section-' + vnode.attrs.type : ' uk-section-default')
                + (vnode.attrs.width ? 'uk-width-' + vnode.attrs.width + ' ' : '')
        },
        view: (vnode) => {
            return m("div",
                {
                    class: clase,
                    // LE  AÑADIMOS UN BOX-SHADOW Y LE  QUITAMOS EL PADDING
                    style:"border-radius:10px;box-shadow: 0 5px 15px rgba(0,0,0,.08); padding:0px!important;" + vnode.attrs.style || ''  + ';'
                }, m(Padding, 
                    vnode.children
                )
            )
        }
    }
}

/**
 * Componente Padding de UIkit
 * @param { String } size  small | large
 */
function Padding() {
    let clase = ''

    return {
        oninit: (vnode) => {
            clase = (vnode.attrs.size ? 'uk-padding-' + vnode.attrs.size : 'uk-padding')
        },
        view: (vnode) => {
            return m("div",
                { class: clase },
                vnode.children
            )
        }
    }
}

function CardBadge() {
    return {
        view: (vnode) => {
            return m("div.uk-card-badge.uk-label", vnode.attrs, vnode.children)
        }
    }
}

function Modal() {
    let clase = ''
    return {
        oninit: (vnode) => {

        },
        view: (vnode) => {
            return m("div", {
                id: vnode.attrs.id,
                'uk-modal': true
            }, m(".uk-modal-dialog",
                {
                    class: vnode.attrs.center ? 'uk-margin-auto-vertical' : ''
                },
                vnode.children
            ))
        }

    }
}

function ModalBody() {

    return {
        view: (vnode) => {
            return m(".uk-modal-body", vnode.attrs, vnode.children)
        },
    }
}

function ModalHeader() {
    return {
        view: (vnode) => {
            return m(".uk-modal-header", vnode.attrs, m(".uk-modal-title", vnode.children))
        }
    }
}

function ModalFooter() {
    return {
        view: (vnode) => {
            return m(".uk-modal-footer", vnode.attrs, vnode.children)
        }
    }
}

function ModalClose() {
    return {
        view: (vnode) => {
            return m()
        }
    }
}

/**
 * Componente container de UIkit
 * @param {String} size tiny | small | medium | large | huge
 */
function Container() {
    let size = '';

    return {
        oninit: (vnode) => {
            switch(vnode.attrs.size) {
                case 'tiny':
                    size = '.uk-container-xsmall'; break;
                case 'small':
                    size = '.uk-container-small'; break;
                case 'medium':
                    size = '.uk-container-large'; break;
                case 'large':
                    size = '.uk-container-xlarge'; break;
                case 'huge':
                    size = '.uk-container-expand'; break;
                default:
                    size = '';
            }
        },
        view: (vnode) => {
            return m(`.uk-container${size}`, vnode.attrs, vnode.children)
        }
    }
}

function Form() {
    //Para el futuro
    let types = ["uk-form-stacked", 'uk-form-horizontal']


    return {
        view: (vnode) => {
            return m("form", vnode.attrs, vnode.children)
        }
    }
}

function FormLabel() {

    return {
        view: (vnode) => {
            return m("label.uk-form-label", vnode.attrs, vnode.children)
        }
    }
}


//Hacer un componente de TEXT


/*
    guarda el html interior dentro del objeto data[name]
*/
function TextEditor() {

    let html = true
    let imgdata={}
    let isLocalized=false
    let text

    let topbuttons = [
        {
            placeholder: 'Styles',
            multiple: true,
            buttons: [
                { 'label': 'B', active: false, 'pressed': 'bold', icon: 'bold' },
                { 'label': 'I', active: false, 'pressed': 'italic', icon: 'italic' },
                { 'label': 'U', active: false, 'pressed': 'underline', icon: 'underline' },
                { 'label': 'S', active: false, 'pressed': 'strikethrough', icon: 'strikethrough' }
            ]
        },
        {
            placeholder: 'Undo/redo',
            buttons: [
                { 'label': 'undo', 'pressed': 'undo', icon: 'undo' },
                { 'label': 'redo', 'pressed': 'redo', icon: 'redo' },
            ]
        },
        {
            placeholder: 'Text Format',
            buttons: [
                { 'label': 'P', 'pressed': 'insertParagraph', icon: 'level down alternate' },
                { 'label': 'P', 'pressed': 'formatBlock:p', icon: 'paragraph' },
                { 'label': 'H1', 'pressed': 'formatBlock:H1' },
                { 'label': 'H2', 'pressed': 'formatBlock:H2' },
                { 'label': 'H3', 'pressed': 'formatBlock:H3' }
            ]
        },
        {
            placeholder: 'Font Size',
            buttons: [
                { 'label': 'SM', active: false, 'pressed': 'fontsize:1' },
                { 'label': 'M', active: false, 'pressed': 'fontsize:3' },
                { 'label': 'U', active: false, 'pressed': 'fontsize:5' }
            ]
        },
        {
            placeholder: 'Lists',
            buttons: [
                { 'label': 'UL', 'pressed': 'insertUnorderedList', 'icon': 'list ul' },
                { 'label': 'OL', 'pressed': 'insertOrderedList', 'icon': 'list ol' }
            ]
        },
        {
            placeholder: 'Alignment',
            multiple: false,
            buttons: [
                { 'label': '&#8676;', 'pressed': 'justifyLeft', icon: 'align left' },
                { 'label': '&#8596;', 'pressed': 'justifyCenter', icon: 'align center' },
                { 'label': '&#8677;', 'pressed': 'justifyRight', icon: 'align right' }
            ]
        },
        {
            placeholder: 'Clear Formatting',
            buttons: [{ 'label': 'Borrar formato', 'pressed': 'removeFormat', 'icon': 'eraser' }]
        }
    ]
    let data = {}
    let name = '';

    let rndnmb = Math.floor(Math.random() * 1000);

    let language = 'und';

    function addTable(n) {
        if (!addTable.count) addTable.count = 1
        else addTable.count++

        let html = `<table id='${addTable.count}' style="width: 100%;"><tbody><tr>
        <td style='width:1em' rowspan=0><button class='ui icon button' onclick='let row=document.getElementById((${addTable.count})).insertRow(-1);
            for(i=0;i<${n};i++) row.insertCell(i);
        '><i class='ui edit icon'></i></button></td>
        `
        for (let i = 0; i < n; i++) {
            html += `<td>Columna ${i + 1}</td>`
        }
        html += '</tr></tbody></table>'
        return html
    }

    return {
        view: (vnode) => {
            data = vnode.attrs.data 
            name = vnode.attrs.name

            typeof data[name] == 'string'

            // METER esto en el oninit ??
            if(typeof data[name] == 'object')  {
                

                isLocalized=true
                //!!! este truco funcionará???
                data=data[name]
                name=language
            }

 
            return m('.ui.padded.grid', {
                style: vnode.attrs.style ? vnode.attrs.style : undefined
            }, 
             
                vnode.attrs.showcontrols ?
                m('.ui.row', { style: 'position:relative' },
                     [                        
                        topbuttons.map((span) => {
                        return m('.ui.tiny.icon.compact.menu', { style: 'margin:5px;' },
                            span.buttons.map((button) => {
                                return m('a.item', {
                                    class: button.active ? 'active' : '',
                                    onclick: (e) => {
                                        typeof button.active != 'undefined' ? button.active = !button.active : null
                                        const cmd = button.pressed.split(':')
                                        document.execCommand(cmd[0], false, cmd[1])
                                    }
                                },
                                    button['icon'] ?
                                        m('i', { class: button['icon'] + ' icon' }) :
                                        button['label']
                                    )
                                })
                            )
                        }),
                        m(".ui.compact.menu", { style: 'margin:5px;' }, [
                            m(".ui.dropdown.simple.item", [
                                //m("i.dropdown.icon"),
                                "TABLA",
                                m(".menu", [
                                    m(".item", {
                                        onclick: () => data[name] += addTable(1)
                                    }, "1 columna"),
                                    m(".item", {
                                        onclick: () => data[name] += addTable(2)
                                    }, "2 columna"),
                                    m(".item", {
                                        onclick: () => data[name] += addTable(3)
                                    }, "3 columna")
                                ])
                            ])
                        ]),
                    

                        m(".ui.compact.tiny.icon.menu",
                            {
                                style: 'margin:5px;',
                                onclick:(e) => document.getElementById('input-hidden').click()
                            },
                            m("a.item", m("i.image.icon"))
                        ),
                    ] 

                ): null,

                m(".ui.mini.button", { onclick: () => html = !html }, html ? "TEXT" : "HTML"),

                // Hará falta algo para convertir a localized
                isLocalized 
                ? m(".ui.mini.button", {
                    onclick:() => {                         
                        language === 'und' 
                        ? language = 'es' 
                        : language === 'es' 
                        ? language = 'va'
                        : language = 'und'   
                    },
                }, language.toUpperCase())
                : null,

                    html
                    ? m('div', {
                        style: 'min-height: 150px; border: 1px solid black; width: 100%',
                        'contenteditable': true,
                        id: 'contenteditable-' + rndnmb,
                        onkeydown: (e)=> {if (e.key==='Enter') e.preventDefault() },
                        oninput: (e) => {
                            /// TODO: PP PORFAVOR UNETE A LA COMUNIDAD DE tenstages.com
                            ///  data[name] = data[name].replace(/<[^>]*>?/gm, '');
                            data[name] = document.getElementById('contenteditable-' +rndnmb).innerHTML
                        }
                    },
                        //data[name] ? m.trust(data[name]) : null
                        data[name] && data[name] 
                        ? m.trust(data[name]) 
                        : m.trust('')
                    )
                    : m("textarea", {
                        style:"width:100%;height:300px",
                        oninput: (e) => {
                            data[name] = e.target.value
                        }
                    }, data[name] ),

                m("style", `
                #contenteditable-${rndnmb} table, #contenteditable-${rndnmb} th, #contenteditable-${rndnmb} td {
                    border: 1px solid black;
                    border-collapse: collapse;
                }`)
            )
        }
    }
}

/**
 * Componente para mostrar un icono
 * @param {String} icon Nombre del icono
 * @param {String} color Color del icono
 * @param {function} onclick Función a ejecutar al hacer click
 * @param {String} size Tamaño del icono
 * @param {Number} opacity Opacidad del icono [0,1]
 * 
 * El nombre del icono se saca de 
 * https://fonts.google.com/icons
 */
function Icon() {
    
    let sizes = {
        'mini':'font-size:14px',
        'tiny':'font-size:16px',
        'small':'font-size:18px;',
        'medium':'',
        'large':'font-size:26px',
        'huge':'font-size:32px',
        'massive':'font-size:50px'
    }

    return {
        view:(vnode)=>{
            return m("span",{
                class:'material-icons', 
                onclick:vnode.attrs.onclick,
                style:`color:${vnode.attrs.color || 'black'};opacity:${vnode.attrs.opacity || 1};${sizes[vnode.attrs.size || 'medium']};`,
                ...vnode.attrs
            }, vnode.attrs.icon)
        }
    }
}

/* @attrs 
 * class: uk-label-success uk-label-warning  uk-label-danger
 **/
function Label(){
    return{
        view:(vnode)=>{
            return m("span.uk-label", vnode.attrs)
        }
    }
}




export { 
    TextField, 
    Button, 
    Grid, 
    Column, 
    Card, 
    CardBody,
    TextEditor, 
    CardHeader, 
    CardMedia, 
    Row, 
    Select, 
    Section,
    Icon, 
    Padding, 
    CardBadge, 
    Modal, 
    ModalBody, 
    CardFooter, 
    Container, 
    ModalHeader, 
    Form, 
    FormLabel, 
    ModalFooter,
    Flex,
    Label,
} 
