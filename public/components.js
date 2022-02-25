//Aquí meteré todos los componentes reutilizables




/** 
    * @attrs (object) {
    size: small | medium | large 
    row-gap | column-gap:  small | medium | large | collapse
    divider: true | false
    match-height: true|false
    masonry: true || false
    center: true ||false
    }
*/
function Grid() {
    let clase = ''
    let sortable = [];
    return {
        oninit: (vnode) => {

            let { divider, match, rowgap, columngap, size, center, align, sortable } = vnode.attrs

            clase = (match ? ' uk-grid-match' : '') +
                (size ? ' uk-grid-' + size : '') +
                (center ? ' uk-flex-center ' : '') +
                (rowgap ? ' uk-grid-row-' + rowgap : '') +
                (columngap ? ' uk-grid-column-' + columngap : '') +
                (divider ? ' uk-grid-divider' : '') +
                (align ? ' uk-align-' + align : '')

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

//se le podrá pasar algun atributo a row y column
function Row() {
    return {
        view: (vnode) => {
            return m(".uk-width-1-1", vnode.attrs, vnode.children)

        }
    }
}

/*
    Idea set width for mobile, tablet, computer
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


function Card() {
    return {
        view: (vnode) => {
            let { type, size, hover } = vnode.attrs
            return m('.uk-card ' +
                (type ? 'uk-card-' + type + ' ' : 'uk-card-default ') +
                (size ? 'uk-card-' + size + ' ' : '') +
                (hover ? 'uk-card-hover' : ''),vnode.attrs, vnode.children)

        }
    }
}

function CardBody() {
    return {
        view: (vnode) => {
            return m(".uk-card-body", vnode.attrs, vnode.children)
        }
    }
}

function CardMedia() {
    return {
        view: (vnode) => {
            return m(`.uk-card-media-${vnode.attrs.position || 'top'}`, vnode.attrs, vnode.children)
        }
    }
}

function CardHeader() {
    return {
        view: (vnode) => {
            return m(`div.uk-card-header`, vnode.attrs, vnode.children)
        }
    }
}


function CardFooter() {
    return {
        view: (vnode) => {
            return m(`div.uk-card-footer`, vnode.attrs, vnode.children)
        }
    }
}


/*
    para inputs y text-areas.
    Se puede añadir más
*/
function TextField() {
    let types = {
        "textarea": { class: "uk-textarea" },
        "input": { class: "uk-input", type: "text" },
        "number": { class: "uk-input", type: "number" },
        'time': { class: 'uk-input', type:'time'}
    }

    return {
        view: (vnode) => {
            let { data, name, type, oninput, style, rows } = vnode.attrs
            return type != "textarea" ?
                m("input",
                    {
                        class: type ? types[type].class : types['input'].class,
                        style: style || '',
                        type: type ? types[type].type : 'text',
                        value: data[name],
                        width: vnode.attrs.width || undefined,
                        oninput: (e) => {
                            if (type == "number") { data[name] = Number(e.target.value) }
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
 * *@attrs 
 *  type = default,primary,secondary,danger
 *  size = small, large
 *  width = uk-width-1-1
 */
function Button() {
    let clase = '';
    return {
        oninit: (vnode) => {
            clase = 'button.uk-button ' + (vnode.attrs.type ? 'uk-button-' + vnode.attrs.type + ' ' : '')
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
                        data[name] = e.target.value;
                        if (data[name].startsWith('[object')) {
                            data[name] = vnode.children[e.target.selectedIndex].value
                        }
                        vnode.attrs.onchange ? vnode.attrs.onchange(e) : null
                    },
                    value: data[name]
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

/*
    Hay que hacer los cuatro tipos de section: primary, muted, secondary, default
*/
function Section() {
    let clase = 'uk-section'
    return {
        oninit: (vnode) => {
            clase += (vnode.attrs.type ? ' uk-section-' + vnode.attrs.type : ' uk-section-muted')
                + (vnode.attrs.width ? 'uk-width-' + vnode.attrs.width + ' ' : '')
        },
        view: (vnode) => {
            return m("div",
                {
                    class: clase,
                    style:vnode.attrs.style
                }, vnode.children
            )
        }
    }
}


//padding can be small ,large, or you can not specify it
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

/*
    sizes == tiny, small, medium, large, huge
*/
function Container() {
    let size = '';

    return {
        oninit: (vnode) => {
            vnode.attrs.size == 'tiny' ?
                size = '.uk-container-xsmall' :
                vnode.attrs.size == 'small' ?
                    size = '.uk-container-small' :
                    vnode.attrs.size == 'medium' ?
                        size = '.uk-container-large' :
                        vnode.attrs.size == 'large' ?
                            size = '.uk-container-xlarge' :
                            vnode.attrs.size == 'huge' ?
                                size = '.uk-container-expand' :
                                null
        },
        view: (vnode) => {
            return m(`.uk-container`, vnode.attrs, vnode.children)
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

    let topbuttons = [{
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
                m('.ui.row', { style: 'position:relative' },
                    vnode.attrs.showcontrols 
                    ? [                        
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
                : null,
                ),

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
                        style: 'min-height: 300px; border: 1px solid black; width: 100%',
                        'contenteditable': true,
                        id: 'contenteditable-' + rndnmb,
                        onkeydown: (e)=> {if (e.key==='Enter') e.preventDefault() },
                        oninput: (e) => {
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







export { TextField, Button, Grid, Column, Card, CardBody,TextEditor, CardHeader, CardMedia, Row, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, Container, ModalHeader, Form, FormLabel, ModalFooter }
