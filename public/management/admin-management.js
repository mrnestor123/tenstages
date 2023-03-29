import { Button, Column, Flex, Grid, Section, TextField,  Card, CardMedia, CardHeader, CardBody, Select, Icon, CardFooter, Container, Padding, Row, Modal, ModalBody, ModalHeader, ModalFooter, TextEditor } from "../components/components.js"
import { api_get } from "../util/util.js"
import * as htmlConverter from 'https://cdn.jsdelivr.net/npm/@eraserlabs/quill-delta-to-html@0.12.1/+esm';
import { ImageSelector, InfoText } from "../components/management-components.js";
import { ContentCard, EditableField } from "../components/tenstages-components.js";
import { FormLabel, Header3 } from "../util/texts.js";
import { getAllContent, getSettings, getStages, updateContent, updateStage, getSections } from "../api/server.js";
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
                        },m("h3", section.title)
                        ),    
                    ),
                    m(CardBody,
                        m(EditableField,{
                            data:section,
                            name:'description',
                            isEditing:isEditing
                        },m("h3", section.description)),

                        section.content ?
                        m(Grid,
                            section.content.map((c,i)=>{
                            return isEditing 
                                ? m("div",{style:"font-weight:bold;margin-right:10px;"},
                                    c.title,
                                    // delete button
                                    isEditing ?
                                    m(Icon,{
                                        icon:'delete',
                                        style:"cursor:pointer;",
                                        type:'secondary',
                                        onclick:(e)=>{
                                            section.content.splice(i,1)
                                        }
                                    }, "Delete")
                                    : null
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
                content = res.filter((item)=>!item.stagenumber)

                console.log('content',content)
            })
        },
        view:(vnode)=>{
            return [
                /*m(InfoText,{
                    title: 'Explore page',
                    subtitle: 'Here you can see all the additional content that is available inside the app. You can also search for specific content.'
                }),*/

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

    let text= `<p>I studied computer science for 5 years, I had my life 'solved' while working at my family business. And got hooked in the loop of adult life with no ambitions, no expectation, no goals. I was just going through what was I thought was life. </p>
    <br>
    
    
    <p>Going through a dark period, I found meditation as a way to help me sleep better. After sleeping soundly, I got hooked up and started reading more about meditation.\n\nI found TMI and it helped me progress so much in my meditation practice. I started to see the world in a different way. </p> <br> 
    
    
    <p>I am not a guru, I am not a teacher, I am not a monk. I am just a regular guy who found a way to live a better life. I hope this app can help you too. </p>
    
    <p> TOADD IMAGE </p>
    `

    
    return {
        oninit:(vnode)=>{
            getSettings().then((res)=>{
                settings = res
                m.redraw()
            })
        },
        view:(vnode)=>{
            return [
                /*  
                m(InfoText,{
                    title:'Settings',
                    description:'Edit the text settings for the app'
                }),*/

                m(Section,
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
                            })
                        ),
                        m(Column,{width:'1-2'},
                        
                        
                            m(Button,{
                                style:"width:100%",
                                type:'primary',
                                onclick:(e)=>{
                                    updateSettings(settings).then((res)=>{
                                        console.log(res)
                                    })
                                }
                            }, "Save")
                        )
                    )
                ),

                m(Section,{style:"margin-top:20px"},
                    m(Grid,
                        m("h3", "Introduction text")

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
        stagenumber:1
    }

    // LAS  LECCIONES  DE LA ETAPA
    function StagePath(){
        let isEditing = false;
        let theory = []
        let practice = []


        function HorizontalList(){
            let starting  = 0;

            function ContentStageCard(){
                return {
                    view:(vnode)=>{
                        let {content} = vnode.attrs

                        return m(Card,
                            m(CardMedia,m("img",{src:content.image})),
                            m(CardHeader, 
                                m("h4",content.title),
                                m("div",{style:"border-radius:10px;background:#f2f2f2;padding:5px;text-align:center;"},
                                    "Position: " + content.position
                                ),

                            ),

                            m(CardFooter,
                                m("a.uk-button.uk-button-text",{
                                    onclick:()=>{
                                        console.log('content',content)
                                        
                                        //.route.set(`/edit_create?cod=${content.cod}`)
                                    }
                                },"Change position"),


                                m("div",{style:"height:20px"}),

                                m("a.uk-button.uk-button-text",{
                                    onclick:()=>{
                                        m.route.set(`/edit_create?cod=${content.cod}`)
                                    }
                                },"Edit"),
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
                                    return m(Column,{width:'1-6'},
                                        m(ContentStageCard,{content:content})
                                    )
                                })
                            )
                        )
                    ]
                }
            }
        }

        function AddContentToPath(){


            let  toAdd = {'content':'','position':'','path':'theory'}


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
                let selectedStage = stages[filter.stagenumber-1];
                console.log('selectedStage', selectedStage)

                return m(Card,{style:"background-color:#dbd0ba;border-radius:10px"},
                    m(Grid,{center:true, verticalalign:true, columngap:'collapse'},
                        m(Column,{width:'1-5', style:"text-align:center"},
                            m(CardMedia,{
                                position:'left'
                            },  
                                m("div", {style:"background-color:white;border-radius:10px;padding:0.5em;margin-left:10px;"},
                                    m("img",{src: selectedStage.shortimage, style:"width:100%;height:auto;object-fit:contain;"}),
                                )
                                //m("canvas",{width:600,height:400})
                            ),

                            m(Header3,{style:"text-align:center"}, "Stage " + selectedStage.stagenumber),
                            m("p",{style:"text-align:center"}, selectedStage.description),

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

                                m("strong","Goals"),m("br"), 
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'whenToAdvance'
                                },
                                    m("p", m.trust(selectedStage.longdescription)),
                                ),

                                m("strong","When To advance"),m("br"), 
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'whenToAdvance'
                                },
                                    m("p", m.trust(selectedStage.whenToAdvance)),
                                ),

                                // Summary 
                                m("strong"," Practice Summary"),m("br"),
                                m(EditableField,{
                                    type:'html',
                                    isEditing:isEditing,
                                    data:selectedStage,
                                    name:'practiceSummary'
                                },  
                                    m("p",m.trust(selectedStage.practiceSummary))
                                )
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
        oninit:(vnode)=>{
            getStages().then((res)=>{
                stages = res.sort((a,b)=> a.stagenumber - b.stagenumber)
                m.redraw()
            })

            getAllContent().then((res)=>{
                contentList = res;
                m.redraw()
            })
        },
        view:(vnode)=>{
            
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

export { AdminManagement,  EmailTool,  ExplorePage, SettingsPage, StagesManagement }
