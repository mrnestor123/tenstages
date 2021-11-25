import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge,TextEditor, Modal, ModalBody, CardFooter, CardHeader } from './components.js'
import { getImages, deleteImage } from './server.js'
import { FileUploader, create_UUID } from './util.js'

//explicar como se utiliza para el futuro

// se utiliza en conjunto con button, pasarle un data y name y un id.
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
                                        }, "Select"),
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
                                                        src.match('jpeg|jpg|gif|png|PNG|JPG') ?
                                                        m("img", { src: src, onclick: (e) => selectedindex = index, style: selectedindex == index ? 'border: 2px solid lightblue' : '' }) :
                                                        m("video", {src:src, onclick: (e) => selectedindex = index, style: selectedindex == index ? 'border: 2px solid lightblue' : '', 'controls':true })
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
function LessonSlides(){
    let data,name

    function goBackForward(index, back){
        let auxarray = data[name].map((el)=> el)
        let position = index + (back ? -1 : 1)
        auxarray[position] = data[name][index] 
        auxarray[index] = data[name][position]
        data[name] = auxarray
        m.redraw()
    }


    return{
        oninit:(vnode)=>{
            data= vnode.attrs.data
            name= vnode.attrs.name
        },
        view:(vnode)=>{
            return data[name].map((item, i) => {
                return m(Column, { width: "1-4" },
                    m(LessonSlide, { data: data[name], index: i, item: item}),
                    i != 0 ? 
                    m(Button,
                     {
                         onclick:(e)=>{
                            goBackForward(i,true)
                         }
                     },
                     "Move left"
                    ) : null,
                    m(Button,
                        {
                            onclick:(e)=>{
                               goBackForward(i)
                            }
                        },
                        "Move right"
                    ),
                )
            }) 
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
                        style: "cursor:pointer; width:100%"
                    }),
                    m(ImagePicker, { data: data[index], name: "image", id: `text-images${index}` })
                ),
                m(CardBody,
                    { style: "padding:0px" },
                    m(TextEditor, { data: data[index], name: "text", type: "textarea", rows: "10", style: "margin:0px;font-size:0.9em;padding:5px" }),
                    m("strong","Help text"),
                    m(TextEditor, {data:data[index], name:'help'}),
                    m("div", { style: "position:absolute;right:5;top:5" },
                        m("a", { 'uk-icon': 'icon:trash', style: "color:red", onclick: (e) => data.splice(index, 1) })
                    ),
                ),
                m(Button,{style:"color:red",onclick:(e)=> data.splice(index, 1)}, "DELETE")
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
            'html': ()=> m(TextEditor,{data:object, name:'html'})
        }
        let editing = true
        let object = {}

        function Text() {
            return {
                view: (vnode) => {
                    return editing ? m(TextField, { data: object, name: vnode.attrs.type, type: "textarea", rows: vnode.attrs.type == 'text' ? "6" : '3' }) : null
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
                return m(Card,
                    m(CardBody, { style: "padding:0px" },
                        Object.keys(object).map((key) => {
                            return types[key] ? types[key]() : ''
                        })
                    )
                )
            }
        }

    }

    return {
        oninit:(vnode)=>{
            let {data,name} =  vnode.attrs


        },
        view: (vnode) => {
            let { data, name } = vnode.attrs
            return [
                //ESTO SE PODRÍA MEJORAR !!
                m(Select, { data: data, name: name },
                    [
                        { 'label': 'text', value: { 'text': data[name]['text'] || '', 'type': "text" } },
                        { 'label': 'title_text', value: { 'title': data[name]['title'] || '', 'text': data[name]['text'] || '', 'type': "title_text" } },
                        { 'label': 'title_image', value: { 'title': data[name]['title'] || '', 'image': data[name]['image'] || '', 'type': "title_image" } },
                        { 'label': 'image', value: { 'image': data[name]['image'] || '', 'type': "image" } },
                        { 'label': 'image_text', value: { 'image': data[name]['image'] || '', 'text': data[name]['text'] || '', 'type': "image_text" } },
                        { 'label': 'title_image_text', value: { 'title': data[name]['title'] || '', 'image': data[name]['image'] || '', 'text': data[name]['text'] || '', 'type': "title_image_text" } },
                        { 'label': 'video', value: { 'video': '', 'type': "video" } },
                        { 'label': 'video_text', value: { 'video': '', 'text': data[name]['text'] || '', 'type': "video_text" } },
                        { 'label': 'html', value: { 'html':  data[name]['html'] || ''}},
                        { 'label': 'image_html', value: {'image':'','html': data[name]['html'] || ''}}
                    ]
                ),
                data[name] ? m(SwitchType, { data: data, name: name, editing: true }) : null,
                m(Button,{style:"color:red", onclick:(e)=> { delete data[name]}}, "Delete"),
                m(Button,{onclick:(e)=>{}},"RIGHT"),
                m(Button,{onclick:(e)=>{}},"LEFT")
            ]
        }
    }
}

function FollowAlongSlide(){

    return { 
        view:(vnode) => {
            let slide = vnode.attrs.slide
            let edit = vnode.attrs.edit

            return [ 
                m("strong", "Time "),
                !edit ? [m("br"),m("uk-label", slide.time)] : m(TextField, {data: slide, name:'time', type: 'time'}),
                m("br"),
                m("strong","Text "),
                !edit ? [m("br"),m("uk-label", slide.text)] : m(TextField, {data: slide, name:'text', type:'textarea', rows:5 }) 
            ]
        }
    }

}


export { MeditationSlide, LessonSlide, ImagePicker, FollowAlongSlide, LessonSlides }


