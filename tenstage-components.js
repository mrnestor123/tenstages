import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, CardHeader } from './components.js'
import { getImages, deleteImage} from './server.js'
import { FileUploader, create_UUID } from './util.js'


function ImagePicker() {
    var imagetoadd = {};
    let selectedindex;
    let selectedstage = {}
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let images = []
    let rndnmb = 0

    return {
        oninit: (vnode) => {
            let stagenumber = vnode.attrs.stagenumber || 1
            selectedstage.num = stagenumber
            rndnmb = Math.floor(Math.random() * 100)
            getImages(stagenumber).then((res) => { images = res; m.redraw() });
        },
        view: (vnode) => {
            //podemos añadirle un loading
            return [
                m("div",
                    {
                        'uk-modal': 'stack: true',
                        class: 'uk-modal-container',
                        id: vnode.attrs.id
                    },
                    m(".uk-modal-dialog.uk-margin-auto-vertical",
                        m("button.uk-modal-close-default", { 'uk-close': '' }),
                        m(".uk-modal-body",
                            m(Grid,
                                [
                                    m(Column, { width: '1-2' },
                                        m(Button, {
                                            onclick: (e) => {
                                                vnode.attrs.data[vnode.attrs.name] = images[selectedindex]
                                            },
                                            class: "uk-modal-close"
                                        }, "Select Image"),
                                        m("button.uk-button.uk-button-default", { onclick: () => { document.getElementById(`file-chooser-${rndnmb}`).click() } }, "Upload Image"),
                                        m(FileUploader, {
                                            data: imagetoadd,
                                            stage: selectedstage["num"],
                                            name: "src",
                                            id: `file-chooser-${rndnmb}`,
                                            onsuccess: (src) => { images.push(src) }
                                        }),
                                        m(Button, {
                                            onclick: (e) => {
                                                if (selectedindex != null) {
                                                    deleteImage(images[selectedindex], selectedstage["num"]);
                                                    images.splice(selectedindex, 1);
                                                    m.redraw()
                                                }
                                            }
                                        }, "Delete"),
                                    ),
                                    m(Column, { width: '1-2' },
                                        m("label", "Select stage"),
                                        m(Select, {
                                            data: selectedstage,
                                            name: "num",
                                            onchange: (e) => {
                                                getImages(selectedstage["num"]).then((res) => { images = res; m.redraw(); })
                                            }
                                        }, stages)
                                    ),
                                    m(Column, { width: '1-1' },
                                        images.length > 0 ?
                                            m(Grid,
                                                images.map((src, index) => {
                                                    return m(Column, { width: '1-3' },
                                                        m("img", { src: src, onclick: (e) => selectedindex = index, style: selectedindex == index ? 'border: 2px solid lightblue' : '' })
                                                    )
                                                })
                                            ) : null
                                    )
                                ]
                            )
                        )
                    )
                )
            ]
        }
    }
}

function LessonSlide() {
    return {
        view: (vnode) => {
            let { data, item, index } = vnode.attrs
            return m(Card,
                { size: "small" },
                m(CardMedia,
                    m("img", {
                        src: item.image || "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg",
                        'uk-toggle': `target:#text-images${index}`,
                        style: "cursor:pointer"
                    }),
                    m(ImagePicker, { data: data[index], name: "image", id: `text-images${index}` })
                ),
                m(CardBody,
                    { style: "padding:0px" },
                    m(TextField, { data: data[index], name: "text", type: "textarea", rows: "10", style: "margin:0px;font-size:0.9em;padding:5px" }),
                    m("div", { style: "position:absolute;right:5;top:5" },
                        m("a", { 'uk-icon': 'icon:trash', style: "color:red", onclick: (e) => data.splice(index, 1) })
                    )
                )
            )
        }
    }
}


function MeditationSlide() {
    function SwitchType() {
        let types = {
            'image': () => m(Image),
            'text': () => m(Text, { type: "text" }),
            'title': () => m(Text, { type: "title" }),
            'type': ()=> null
        }
        let editing = true
        let object = {}

        function Text() {
            return {
                view: (vnode) => {
                    return editing ? m(TextField, { data: object, name: vnode.attrs.type, type: "textarea", rows: vnode.attrs.type == 'text' ?"6":'3'}) : null
                }
            }
        }

        function Image() {
            let id = Math.floor(Math.random() * 100)
            return {
                view: () => {
                    return editing ? [
                        m("img", {
                            src: object.image || "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg",
                            'uk-toggle': `target:#medit-image${id}`,
                            style: "cursor:pointer"
                        }),
                        m(ImagePicker, { data: object, name: "image", id: `medit-image${id}` })
                    ]
                        :

                        null
                }
            }
        }

        return {
            view: (vnode) => {
                object = vnode.attrs.data[vnode.attrs.name]
                console.log(object)
                return m(Card,
                    m(CardBody, { style: "padding:0px" },
                        Object.keys(object).map((key) => {
                            console.log(key)
                            return types[key]()
                        })
                    )
                )
            }
        }

    }

    return {
        view: (vnode) => {
            let { data, name } = vnode.attrs
            return [
                m(Select, { data: data, name: name},
                    [
                        { 'label': 'text', value: { 'text': data[name]['text'] || '' , 'type':"text" } },
                        { 'label': 'title_text', value: { 'title': data[name]['title'] || '', 'text': data[name]['text'] || '', 'type':"title_text"} },
                        { 'label': 'title_image', value: { 'title': data[name]['title'] || '', 'image': data[name]['image'] || '', 'type':"title_image"} },
                        { 'label': 'image', value: { 'image': data[name]['image'] || '', 'type':"image"}},
                        { 'label': 'image_text', value: { 'image': data[name]['image'] || '', 'text': data[name]['text'] || '', 'type':"image_text"}},
                        { 'label': 'title_image_text', value: { 'title': data[name]['title'] || '', 'image': data[name]['image'] || '', 'text': data[name]['text'] || '', 'type':"title_image_text"}},
                        { 'label': 'video', value: { 'video': '', 'type':"video" } },
                        { 'label': 'video_text', value: { 'video': '', 'text': data[name]['text'] || '', 'type':"video_text" } }
                    ]
                ),
                data[name] ? m(SwitchType, { data: data, name: name, editing: true }) : null
            ]
        }
    }
}


export { MeditationSlide, LessonSlide, ImagePicker }


