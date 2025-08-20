import * as htmlConverter from 'https://cdn.jsdelivr.net/npm/@eraserlabs/quill-delta-to-html@0.12.1/+esm';
import { getSettings,  getStages,  updateSettings  } from "../server/server.js";
import { Button, Card, CardBody, CardFooter, CardHeader, CardMedia, Column, Grid, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Padding, Row, Section, Select, TextEditor, TextField } from "../components/components.js";
import { ImageSelector, showFileExplorer } from "../components/management-components.js";
import { ContentCard, EditableField } from "../components/tenstages-components.js";
import { FormLabel, Header3 } from "../components/texts.js";
import { api_get, create_UUID, dia, hora } from "../components/util.js";
import { addSection, getAllContent, getSections, updateContent, updateSection, updateStage,contentIcons, contentTypes } from '../server/contentController.js'
import { getAllActions, getTeachers, getUsers } from '../server/usersController.js'
//import { htmlConverter } from "quill-delta-to-html"

// ESTO SERÍA EMAIL 
function AdminManagement() {
    return {
        view: (vnode) => {
            return [
                m(EmailTool)
                    
                /*
                //m(AdminNavbar),
                m(Grid, {size:"small"}, [
                    m(Column, {width:"1-5", style:"background-color:white;height:100vh"}, [
                        m(Sidebar)
                    ]),
                    m(Column, {width:"4-5", style:"background-color:F5F6FC;height:100vh"}, [
                        
                    ]),
                ])*/
            ]
        }
    }



    /*
    COMENTADO PARA PONERLO EN  EL LAYOUT !!!
    function Sidebar() {
        return {
            view: (vnode) => {
                return [
                    m(Flex, {direction:"column", style:""}, [
                        m("div.uk-grid-small uk-flex-middle", {"uk-grid":"", style:"padding:20px"}, [
                            m("div.uk-width-auto", [
                                m("img.uk-border-circle", {width:"50", height:"50", src:"./assets/logo-tenstages.png", alt:"Avatar"})
                            ]),
                            m("div.uk-width-expand", [
                                m("h3.uk-card-title.uk-margin-remove-bottom", "Pepe Perez"),
                                m("p.uk-text-meta.uk-margin-remove-top", "Admin")
                            ])
                        ]),
                        m(Button, {style:"background-color:white;margin-top:50px"}, "Users"),
                        m(Button, {style:"background-color:white"}, "Email"),
                        m(Button, {style:"background-color:white"}, "Courses"),
                        m(Button, {style:"background-color:white"}, "Content"),
                        m(Button, {style:"background-color:white"}, "Stages"),
                    ])
                ]
            }
        }
    }

    function AdminNavbar() {
        return {
            view: (vnode) => {
                return [
                        m("nav.uk-navbar-container", { 'uk-navbar': '', style:"height:95px;background-color: white" },
                            m("nav", { 'uk-navbar': '', style: "width:100%;background-color:2C2C2C" },
                                m(".uk-navbar-center",
                                    m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages-white.png', style: "max-height:95px; width:auto" })),
                                )
                            )
                        )

                ]
            }
        }
    }*/
}

function EmailTool() {

    let quill;
    let converter;

    let emailData = {
        emails: [],
        subject: "",
        message: ""
    }
    let emails = [];

    return {
        oninit: async () => {

            /**
             * Sacar todos los usuarios de admin.auth. véase https://bigcodenerd.org/get-all-users-auth-firebase-cloud-functions/#:~:text=To%20get%20all%20the%20users,lot%20of%20functionality%20built%2Din.
             */
            let authUsers = await api_get("http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default/users/auth");
            let users = await api_get("http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default/users/");

            // New object with with coduser, email and role properties
            emails = authUsers.users.map( u => {
                return {
                    coduser: u.uid,
                    email: u.email,
                    role: users.find(u2 => u2.coduser === u.uid) ? users.find(u2 => u2.coduser === u.uid).role : "meditator"
                }
            }); 

        },
        view: () => {
            return [

                m("h1", "Email tool"),

                m("h4", "Emails:"),
                m(Select, {data: emailData, name: "emails"}, ["Teachers", "All", "Prueba"]),

                m("h4", "Subject:"),
                m(TextField, {data: emailData, name: "subject"}),

                m("h4", "Message:"),
                m('div', {
                    style: "height:320px",
                    oncreate: () => {
                        let cfg = {
                            placeholder: "Edit this text",
                            modules: {
                                toolbar: [
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    [{ 'color': [] }, { 'background': [] }],       
                                    ["bold", "italic", "underline", "strike", "blockquote", "link", "image", "clean"],
                                    ["list"]
                                ]
                            },
                            theme: "snow"
                        }
                        quill = new Quill('#editor', cfg);
                    },
                    oninput: (e) => {
                        let delta = quill.getContents();
                        let QuillDeltaToHtmlConverter = htmlConverter.QuillDeltaToHtmlConverter;
                        let converter = new QuillDeltaToHtmlConverter(delta.ops, {encodeHtml: false});
                        emailData.message = converter.convert();
                    }, 
                    id:'editor'}
                ),

                m(Button, { type:"primary", disabled:true, style:"margin-top:20px", onclick: () => sendEmail(emailData) }, "Send email")
            ]
        }
    }

    function sendEmail(emailData) {
        if(emailData.emails === "Teachers") {
            //emailData.emails = ["pepeperezvalenzuela@gmail.com", "pisitoreviews@gmail.com"]
            emailData.emails = emails.filter(u => u.role === "teacher").map(u => u.email);
        } else if (emailData.emails === "All") {
            emailData.emails = emails.map(u => u.email);
        } else {
            emailData.emails = ["pisitoreviews@gmail.com"]
        }
        api_get("http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default/email/", "POST", emailData)
    }
}

function ExplorePage(){
    let sections = []

    // DE MOMENTO SACAMOS TODO EL CONTENIDO QUE NO TENGA STAGENUMBER !!!
    let content = []

    let teachers = []

    let editing = false;

    function AddSection(){

        let addingSection = false;
        let data = {}

        return {
            view:(vnode)=>{

                return [
                    m(Button,{
                        style:"margin-top:20px",
                        type:'primary',
                        onclick:(e)=>{
                            addingSection = !addingSection;
                        }
                    }, "Add section"),

                    addingSection 
                        ? m(Section,{type:'muted'},
                            m(Padding,
                            m(Grid,
                                m(Row, 
                                    m(FormLabel, 'Section title'),
                                    m(TextField, {
                                        data: data,
                                        name:'title'
                                    })    
                                ),
                                m(Row,
                                    m(FormLabel, 'Section description'),
                                    
                                    m(TextField,{
                                        data:data,
                                        name:'description'
                                    }),

                                    
                                ),
                                m(Row,
                                    m(Button,{
                                        type:'secondary',
                                        onclick:(e)=>{
                                            if(data.title && data.description){
                                                addingSection = false;
                                                data.cod = create_UUID()
                                                sections.push(data)
                                                addSection(data)
                                            }
                                        }
                                    }, "Add section")
                                )
                            ))
                        )
                        : null,
                ]
            }
        }
    }

    function SectionCard(){
        let isEditing = false;

        let toAdd = {}
        let selected= {}

        return {
            view:(vnode)=>{
                let {section} = vnode.attrs

                return m(Card,
                    m(CardMedia,
                        m(ImageSelector,{data:section,name:'image'})
                    ),
                    m(CardHeader, 
                        m(EditableField,{
                            data:section,
                            name:'title',
                            isEditing:isEditing
                        },m("h3", section.title)),
                    ),
                    m(CardBody,
                        m(EditableField,{
                            data:section,
                            name:'description',
                            isEditing:isEditing
                        },m("h3", section.description)),

                        m(Select,{
                            data:section,
                            name:'createdBy',
                            isEditing:isEditing
                        }, teachers.map((e)=>{return{'value':e.coduser,'label':e.nombre || e.username}})),

                        section.content ?
                        m(Grid,
                            section.content.sort((a,b)=> a.position - b.position).map((c,i)=>{
                            return isEditing 
                                ? m("div",{style:"font-weight:bold;margin-right:10px;"},
                                    c.title,
                                    // delete button
                                    m(Icon,{
                                        icon:'delete',
                                        style:"cursor:pointer;",
                                        type:'secondary',
                                        onclick:(e)=>{
                                            section.content.splice(i,1)
                                        }
                                    }, "Delete"),
                                    
                                    m(TextField,{
                                        data:c,
                                        placeholder:'Position',
                                        name:'position',
                                        type:'number',
                                    }),
                                    m(Button,{
                                        type:'secondary',
                                        onclick:(e)=>{
                                            updateContent(c)
                                        }
                                    }, "Save content")
                                )  
                                :  m(Column,{width:'1-2'},

                                m(ContentCard,{
                                    content:c
                                }))
                        })) : null,
                        
                        m("div",{style:"height:10px"}),

                        isEditing 
                        ?   m(Grid,

                            m(Column,{width:'1-2'},
                            m(Select,{
                                data:selected,
                                name:'index',
                                isEditing:isEditing,
                                onchange:(e)=>{

                                    console.log(e.target.value)
                                    toAdd = content[e.target.value]
                                }
                            },
                                content.map((item,i)=>{
                                    return {
                                        'value':i,
                                        'label':item.title       
                                    }
                                })
                            )),

                            m(Column,{width:'1-2'},
                                m(Button,{
                                    type:'secondary',
                                    onclick:(e)=>{
                                        if(toAdd){
                                            if(!section.content){
                                                section.content = []
                                            }

                                            section.content.push(toAdd)
                                        }
                                    }
                                }, "Add content")
                            )
                        )
                        : null
                    ),
                    m(CardFooter,
                        m(Button,{
                            type:'primary',
                            onclick:(e)=>{
                                if(isEditing){
                                    updateSection(section)
                                }
                                isEditing = !isEditing
                            }
                        }, isEditing ? "Save" : "Edit"),

                        isEditing?  
                        m(Button,{

                            type:'default',
                            onclick:(e)=>{
                                location.reload()
                            }
                        }, "Cancel"): null,
                    ) 
                )

            }
        }
    }

    return {
        oninit:(vnode)=>{
            getSections().then((res)=>{
                console.log('res',res)
                sections = res
                m.redraw()
            })

            getAllContent().then((res)=>{
                content = res
            })

            getTeachers().then((res)=>{
                teachers = res
            })
        },
        view:(vnode)=>{
            return [

                // cuando se ocurra una solución sencilla le daré un vistazo
                m(Section,
                    m(AddSection),
                    m("div",{style:"height:20px"}),
                    m(Header3, 'Sections'),
                    m(Grid,{match:true},
                        sections.map((s)=>{
                            return m(Column,{width:'1-2'},
                                m(SectionCard,{section:s})
                            )
                        })
                    )
                )
            ]
        }
    }

}

function SettingsPage(){

    let settings = {}
    
    return {
        oninit:(vnode)=>{
            getSettings().then((res)=>{
                settings = res
                m.redraw()
            })
        },
        view:(vnode)=>{
            return [
                m(Section,
                    m(Column,{width:'3-3'},
                        m(Button,{
                            style:"width:100%",
                            type:'primary',
                            onclick:(e)=>{
                                updateSettings(settings).then((res)=>{
                                    //console.log(res)
                                    //alert('Settings updated')
                                })
                            }
                        }, "Save settings")
                    ),
                    
                    m("h3", "Texts for the app"),
                        
                    m(Grid,
                        m(Column,{width:'1-2'},
                            m(FormLabel, 'About me'),
                            m(TextEditor,{
                                data:settings,
                                name:'aboutMe'
                            })
                        ),
                        m(Column,{width:'1-2'}, 
                            m(FormLabel, "About the app"),
                            m(TextEditor,{
                                data:settings,
                                name:'aboutApp'
                            }),


                            m("div",{style:"height:10px"}),

                            m(FormLabel, "REQUIRED UPDATE"),
                            m(TextField,{
                                type:'checkbox',
                                data:settings,
                                name:'requiredUpdate'
                            }),

                            m("div",{style:"height:10px"}),

                            m(FormLabel, "Version"),
                            m(TextField,{
                                type:'number',
                                data:settings,
                                name:'version'
                            }),
                        )
                    )
                ),

                m(Section,{style:"margin-top:20px"},
                    m(Grid,
                        m(Row,m("h3", "Introduction text"),

                        m(Button,{
                            type:'secondary',
                            style:"margin-left:20px;",
                            onclick:(e)=>{
                                if(!settings.introSlides){
                                    settings.introSlides = []
                                }

                                settings.introSlides.push({
                                    'text':'',
                                    'image':''
                                })
                            }
                        },"Add slide")
                        ),

                        settings.introSlides ?
                        settings.introSlides.map((slide,i)=>{
                            return m(Column,{width:'1-3'},
                                m(Card,
                                    m(CardMedia,
                                        m(ImageSelector,{
                                            data:settings.introSlides[i],
                                            name:'image'
                                        })    
                                    ),
                                    m(CardBody,

                                        m("h4", "Slide "+(i+1)),
                                        m(FormLabel,"Title"),
                                        m(TextField,{
                                            data:settings.introSlides[i],
                                            name:'title'
                                        }),

                                        m(FormLabel, "DEscription"),
                                        m(TextEditor,{
                                            data:settings.introSlides[i],
                                            name:'text'
                                        })
                                    ),
                                    m(CardFooter,
                                        m(Button,{
                                            type:'danger',
                                            onclick:(e)=>{
                                                settings.introSlides.splice(i,1)
                                            }
                                        }, "Delete slide")
                                    )
                                )
                            )
                        }): null,
                        
                        



                    )    
                ),

                m(Section,{style:"margin-top:10px"},
                    m(Button,{onclick:(e)=>{
                        if(!settings.menu){
                            settings.menu = [{'title':'','text':''}]
                        }else{
                            settings.menu.push({'title':'','text':''})
                        }
                    }},"ADD ITEM TO SETTINGS PAGE"),
                    m("div",{style:"height:20px"}),
                    m(Grid,
                        m(Column,{width:'1-3'},
                        m(TextField,{
                            data: settings,
                            name:'teachersText',
                            label:'Teachers text'
                        })),

                        settings.menu ? 
                        settings.menu.map((item)=> {
                            return m(Column,{width:'1-3'},
                                m(Card,
                                    m(TextField,{

                                        data:item,
                                        name:'title'
                                    }),
                                    m(TextEditor,{
                                        data:item,
                                        name:'text'
                                    })
                                )
                            )
                        }): null,
                        
                        
                    )    
                    
                    
                )
            ]
        }
    }
} 

function StagesManagement(){

    let stages = []
    let contentList = []
    let filter = {
        stagenumber:0
    }

    // LAS LECCIONES  DE LA ETAPA
    function StagePath(){
        let isEditing = false;
        let theory = []
        let practice = []


        function HorizontalList(){
            let starting  = 0;

            function ContentStageCard(){
                let content;
                
                function ChangePositionButton (){
                    let data = {'position':''}
                    
                    return {    
                        view: (vnode)=>{

                            return [
                                m("a.uk-button.uk-button-text",{
                                    'uk-toggle':'#changePosition-' + content.cod
                                },"Change position"),
                                
                                m(Modal,{ id:'changePosition-' + content.cod, center: true },
                                    m(ModalBody,
                                        m("h3", content.title),
                                        m(FormLabel, "Current position: " , m("strong", content.position)),

                                        m(FormLabel, "New position"),
                                        m(TextField,{
                                            data:data,
                                            name:'position',
                                            type:'number'
                                        })
                                        
                                    ),
    
                                    m(ModalFooter,
                                        m(Button, {
                                            class: "uk-modal-close",
                                            type: "primary",
                                            onclick: (e) => {
                                                
                                                content.position = data.position
                                                
                                                updateContent(content)
                                            }
                                        }, "ADD"),
                                    ),

                                    
                                )
                            ]
                        }
    
                    }
                }

                return {
                    view:(vnode)=>{
                        content = vnode.attrs.content

                        return m(Card,
                            m(CardMedia,m("img",{src:content.image})),
                            m(CardHeader, 
                                m("h4",content.title),
                                m("div",{style:"border-radius:10px;background:#f2f2f2;padding:5px;text-align:center;"},
                                    "Position: " + content.position
                                ),

                            ),

                            m(CardFooter,
                                m(ChangePositionButton),

                                m("div",{style:"height:20px"}),

                                m("a.uk-button.uk-button-text",{
                                    onclick:()=>{
                                        m.route.set(`/edit_create?cod=${content.cod}`)
                                    }
                                },"Edit"),

                                m("a.uk-button.uk-button-text", {
                                    type: "primary",
                                    onclick: (e) => {
                                        
                                        delete content.position
                                        
                                        updateContent(content)
                                    }
                                }, "Remove from path"),
                            )
                        )
                    }
                }
            }

            return {
                view:(vnode)=>{
                    let {items, header} = vnode.attrs

                    
                    return [
                        m(Section,{type:'muted',style:"margin:10px 0px;"},
                            m(Grid,{match:true},
                                m(Row, m("h4", header)),

                                items.sort((a,b)=> a.position - b.position).map((content)=>{
                                    return m(Column,{width:'1-6'}, m(ContentStageCard,{content:content}))
                                })
                            )
                        )
                    ]
                }
            }
        }

        function AddContentToPath(){

            let toAdd = {'content':'','position':'','path':'theory'}
            let paths = ['Theory','Practice']

            return {
                view:(vnode)=>{
                    return [
                        m(ModalHeader, m("h3", "Add content to stage  " + filter.stagenumber)),
                        m(ModalBody,
                            m(FormLabel, "ADD TO"),
                            paths.map((path)=>{
                                return m(Button,{
                                    key:toAdd.path,
                                    type: toAdd.path == path.toLowerCase() ? 'primary' : 'default',
                                    onclick: (e) => {
                                        toAdd.path = path.toLowerCase()
                                        m.redraw()
                                    }
                                }, path)
                            }),

                            m("div",{style:"height:10px"}),

                            m(FormLabel, "Select content"),
                            m(Select,{
                                data:toAdd,
                                name:'content'
                            }, contentList.filter((c)=> c.position == null && c.stagenumber == filter.stagenumber && (
                                toAdd.path == 'theory' && !c.type.match('meditation-practice|meditation-game') || c.type.match('meditation-practice'))
                                ).map((c)=>{return {value:c.cod, label: c.title}})
                            ),

                            m("div",{style:"height:10px"}),

                            m(FormLabel, "Add in position"),
                            m(Select, {
                                data: toAdd,
                                name: "position",
                            }, Array.from(new Array(Object.keys((toAdd.path == 'theory' ? theory : practice)).length + 1).keys())
                            ),
                        ),

                        m(ModalFooter,
                            m(Button, {
                                class: "uk-modal-close",
                                type: "primary",
                                onclick: (e) => {
                                    console.log('toAdd',toAdd)
                                    
                                    let content = contentList.find((c)=> c.cod == toAdd.content)
                                    content.position = toAdd.position


                                    updateContent(content)

                                    // Y HAY QUE  UPDATEARLO !!

                                    //addContentToStage(toAdd.content, position.selected, filter.stagenumber).then((res)=>{
                                    //    console.log(res)
                                    //    m.redraw()
                                    //})
                                }
                            }, "Add")    
                            
                        )

                    ]
                }
            }
        }

        return {
            view:(vnode)=>{
                let selectedStage = stages.find((s)=> s.stagenumber == filter.stagenumber) 
                // hay que aprender la comprobación exacta con meditation
                theory = contentList.filter((c)=> c.type && !c.type.match('meditation-practice|meditation-game') && c.stagenumber == filter.stagenumber && c.position !=null)
                practice = contentList.filter((c)=>  c.type && c.type.match('meditation-practice') && c.stagenumber == filter.stagenumber && c.position != null)



                return m(Section,
                    m("h3", "Content of this stage"),

                    m(Button,{
                        type:'secondary',
                        target:'#addContent'
                    }, "Add Content to path"),

                    m(Modal,{id:'addContent',center: true},
                        m(AddContentToPath)
                    ),

                    m(HorizontalList,{items: theory, header:'Theory'}),


                    m(HorizontalList,{items: practice,  header:'Practice'})
                )
            }
        }
    }

    function StageCard(){
        let isEditing = false;

        return {
            view:(vnode)=>{
                let selectedStage = stages[filter.stagenumber];

                return m(Card,{style:"background-color:#dbd0ba;border-radius:10px"},
                    m(Grid,{center:true, verticalalign:true, columngap:'collapse'},
                        m(Column,{width:'1-5', style:"text-align:center"},
                            m(CardMedia,{
                                position:'left'
                            },  
                                m("div", {
                                    style:"background-color:white;border-radius:10px;padding:0.5em;margin-left:10px;",
                                    onclick:()=>{
                                        showFileExplorer({data:selectedStage, name:'shortimage'})
                                    }
                                },
                                    m("img",{src: selectedStage.shortimage, style:"width:100%;height:auto;object-fit:contain;"}),
                                )
                            ),

                            m(Header3,{style:"text-align:center"}, "Stage " + selectedStage.stagenumber),
                            m(EditableField,{
                                type:'html',
                                isEditing:isEditing,
                                data:selectedStage,
                                name:'description'
                            },),
                            

                            // EDITTING BUTTON
                            m(Button,{
                                type:'primary',
                                onclick:()=>{
                                    if(isEditing){
                                        updateStage(selectedStage)
                                    }
                                    isEditing = !isEditing
                                    m.redraw()
                                }
                            }, isEditing ? "Save" : "Edit Info"),
                        ),
                        
                        
                        m(Column,{width:'4-5'},
                            m(CardBody,
                                m("strong","Stage summary"),m("br"), 
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'longdescription'
                                },m("p", m.trust(selectedStage.longdescription))),

                                m("strong","When To advance"),m("br"), 
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'whenToAdvance'
                                },m("p", m.trust(selectedStage.whenToAdvance))),

                                m("strong", "Blocked"),
                                m(TextField,{
                                    type:'checkbox',
                                    data:selectedStage,
                                    name:'blocked'
                                }),

                                m("strong", "Objectives"), m("br"),
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'goals'
                                }, m("p",m.trust(selectedStage.goals))),

                                // Summary 
                                m("strong"," Practice Summary"),m("br"),
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'practiceSummary'
                                },  m("p",m.trust(selectedStage.practiceSummary)))
                            ),
                        
                        )
                    ),
                    /*
                    m(CardFooter, "FOOTER")

                    


                    m(CardHeader,
                        m("h3", "Stage "  + selectedStage.stagenumber),
                        m("p", selectedStage.description)
                    ),

                    m(CardBody,{style:"max-height:400px;overflow:auto"},
                        
                    
                        
                    ),

                    m(CardFooter,
                        
                        
                        m(Button,{
                            type:'primary',
                            onclick:(e)=>{
                                if(isEditing){
                                    updateStage(selectedStage).then((res)=>{
                                        console.log(res)
                                    })
                                }
                                
                                isEditing = !isEditing

                            },
                        }, isEditing ? "Save" : "Edit"),
                        
                    )*/
                )   
            }
        }
    }

    return {
        oninit: (vnode) => {
            getStages().then((res)=>{
                stages = res.sort((a,b)=> a.stagenumber - b.stagenumber)


                console.log('STAGES', stages)

                m.redraw()
            })

            getAllContent().then((res)=>{
                contentList = res;
                m.redraw()
            })
        },
        view: (vnode) => {
            return stages.length  
                ? [
                    m(Grid,{match:true},
                        m(Column,{width:'1-6'},
                            m(Section,{style:"padding:0px;max-width:200px;"},
                                m(FormLabel, "Select the stage"),
                                m(Select,{
                                    data:filter,
                                    name:'stagenumber'
                                }, stages.map((s)=> s.stagenumber)
                                )
                            ),
                        ),

                        m(Column,{width:'5-6'},
                            m(StageCard)
                        ),
                        
                        m(Row,
                            m(StagePath),
                        )
                    )
                ] : null
        }
    }
}

function ActionsPage(){
    let actions = []
    let maximumCount = 50

    let savedActions = []
    
    let filter = ''

    let users = {}

    let content = {}

    return {
        oninit: (vnode)=> {
            
            getAllActions().then((res)=>{
                console.log('ACTIONS', res)
                actions = res.sort((a,b)=> new Date(b.time) - new Date(a.time))
                m.redraw()
            })

            getUsers().then((res)=>{
                res.forEach((u)=>{
                    users[u.coduser] = u
                })
                m.redraw()
            })

            getAllContent().then((res)=>{
                console.log('res',res)
                res.map((c)=>{
                    content[c.cod] = c.title
                })
            })
        },
        view: (vnode)=>{
            return [
               // m(Section,{style:"padding-top:0px!important"},
                    m("ul.uk-list.uk-list-striped",
                        
                        m("div",{style:"display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"},
                            m("strong", "Filter"),
                            m(Button,{
                                type:'secondary',
                                onclick:(e)=>{
                                    filter = ''
                                }
                            }, "Clear"),

                            Object.keys(contentTypes).map((c)=>{
                                return m(Button,{ 
                                    onclick:(e)=>{
                                        filter = contentTypes[c]
                                    },
                                    type:'default', 
                                    style:"display:flex; align-items:center;"
                                },
                                    m(Icon,{icon: contentIcons[contentTypes[c]]}), 
                                    
                                    m("div",{style:"width:10px"}),
                                    m("strong", c),
                                )
                            })
                        ),

                        actions.filter((a)=> !filter || filter.includes(a.type)).slice(0,maximumCount).map((a)=>{
                            let username = a.username || (users[a.coduser] ? users[a.coduser].username|| users[a.coduser].userName : 'Unknown')
                            
                            return m("li", {
                                onclick:(e)=>{
                                    console.log('clicked', a)
                                }
                            },
                                username + ' ', a.message, a.cod && content[a.cod],
                                
                                m("strong",{style:"float:right"}, dia(a.time) + " " + hora(a.time)),
                                
                                
                            )
                        }),

                        actions.length > maximumCount 
                        ? m("li",m(Button,{
                            type:'secondary',
                            onclick:(e)=>{
                                maximumCount += 50
                            }
                        },"Load more")) 
                        : null
                    )
                //)
            ]
        }
    }
}

export { AdminManagement, EmailTool, ExplorePage, SettingsPage, StagesManagement, ActionsPage };

