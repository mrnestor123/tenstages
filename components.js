//Aquí meteré todos los componentes reutilizables




/*
    size: small | medium | large
    row-gap | column-gap:  small | medium | large | collapse
    divider: true | false
    match-height: true|false
    masonry: true || false
    center: true ||false
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
        "number": { class: "uk-input", type: "number" }
    }

    return {
        view: (vnode) => {
            let { data, name, type, oninput, style, rows } = vnode.attrs
            return type != "textarea" ?
                m("input",
                    {
                        class: types[type].class,
                        style: style || '',
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
                    class: clase
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







export { TextField, Button, Grid, Column, Card, CardBody, CardHeader, CardMedia, Row, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, Container, ModalHeader, Form, FormLabel, ModalFooter }
