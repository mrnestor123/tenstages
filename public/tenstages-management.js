
// METER AQUÍ TODO LO DEL MANAGEMENT DE LA APP.
// EDITAR PROFESOR, EDITAR CONTENIDO, VER CONTENIDO

import { CardBody, CardMedia, Card, Column, Row, Grid, Padding, TextField, Select, Button, Section, Form, Modal, ModalHeader, ModalBody, ModalFooter, CardFooter, CardHeader, NavBar } from "./components.js";
import { getCurrentUser } from "./index.js";
import { stagenumbers } from "../models.js";
import { addAnnouncement, getCourse, updateCourse } from "../controller/server.js";
import { ImagePicker, FileView, AddContent, EditableField, ChatComponent } from "./tenstage-components.js";
import { FormLabel } from "./texts.js";
import {create_UUID, FileUploader} from "../util.js";



/*
*   TODO: 
*   Saber quien ha editado, y creado el contenido, y cuando 
*   Reportar contenido, chats ? 
*   Cuando el usuario crea un contenido, que se le asocie a él    
*/
function EditCourse(){
    let course = {};

    let menuitems = {
        'Information':'information',
        'Content':'content',
        'Students':'students',
        'Chat':'chat',
        'Announcements':'announcements',
        "Timeline":"timeline",
    }

    let showing = 'information'
    
    function BasicInfo(){
        let editing = false;
        return {
            view:(vnode)=>{
                return m(Grid,
                    m(Row,
                        m(Button,{
                        type:'primary',
                        onclick:(e)=>{ 
                            // TODO:  UPDATE course  
                            // We have to remove content, students... !!   
                            
                            if(editing){
                                updateCourse(course)
                            }

                            editing = !editing

                        }
                        }, editing ?  "Save" : "Edit"),
                        
                        editing ? 
                        m(Button,{
                            style:"margin-left:10px",
                            type:'danger',
                            onclick:(e)=>{editing = false; location.reload()
                            }
                        }, "Cancel") : null
                    ),

                    m(Row,  m(EditableField,{data:course,name:'title',isEditing:editing},  m("h3", course.title))),

                    m(Form,m(Grid,{verticalalign:true},
                        m(Column,{width:'1-3'},  
                            m(FormLabel, "Price €"),
                            m(EditableField,{data:course,name:'price',isEditing:editing,type:"number"}, m("div",course.price))
                        ),
                        m(Column,{width:'1-3'},  
                            m(FormLabel, "Show students to other users? "),
                            m(EditableField,{data:course,name:'showStudents',isEditing:editing,type:"checkbox"}, m("div",course.showStudents ? "Yes" : "No"))
                        ),
                        m(Column,{width:'1-3'},  
                            m(FormLabel, "Allow people to chat? "),
                            m(EditableField,{data:course,name:'allowChat',isEditing:editing,type:"checkbox"}, m("div",course.allowChat ? "Yes" : "No"))
                        ),
                        m(Column,{width:'1-2'},
                            m(FormLabel, "Short description"),

                            m(EditableField,{isEditing:editing, data:course,name:'description',type:'html'}, m("div",m.trust(course.description))),
                        ),
                        m(Column,{width:'1-2'},
                            m(FormLabel, "Long description"),
                            m(EditableField,{isEditing:editing, data:course,name:'description',type:'html'}, m("div",m.trust(course.longdescription))),

                        )
                    )
                    )
                ) 
            }
        }

    }

    function Announcements(){

        function AddAnnouncement(){
            let announcement = {}
    
            return {
                view:(vnode)=>{
                    return [

                        m(Modal,{
                            id:'modal-announcement',
                        },
                            m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalmed' }),
                            m(ModalHeader, "Announcement"),
                            m(ModalBody,
                                m(Grid,{'column-gap':'small'},
                                    m(Column,{width:'1-2'},
                                        m(FormLabel,{required:true}, "Title"),
                                        m(TextField,{data:announcement,name:'title'})
                                    ),
    
                                    m(Column,{width:'1-2'},
                                        m(FormLabel,{required:true}, "Description"),
                                        m(TextField,{data:announcement,name:'description',type:"textarea"})
                                    ),
                                    
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "Start date"),
                                        m(TextField,{type:'date',data:announcement,name:'startDate'})
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "Start time"),
                                        m(TextField,{type:'time',data:announcement,name:'startTime'})
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "End date"),
                                        m(TextField,{type:'date',data:announcement,name:'endDate'})
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "End time"),
                                        m(TextField,{type:'time',data:announcement,name:'endTime'})
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "Repeat"),
                                        m(Select,{data:announcement,name:'repeat'},[
                                            {value:'none',label:'None'},
                                            {value:'daily',label:'Daily'},
                                            {value:'weekly',label:'Weekly'},
                                            {value:'monthly',label:'Monthly'},
                                        ])
                                    ),
    
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "Image"),
                                        m(Button,{target:'#announcement-image',style:"width:100%", type:'secondary'}, "Select image"),
                                        m(ImagePicker,{data:announcement,name:'image',id:'announcement-image'})
                                    ),
                                )
                            ),
                            m(ModalFooter,
                                /*
                                m(Button,{
                                    type:'secondary',
                                    onclick:(e)=>{
                                        // close modal
                                        m.redraw()
                                    }
                                }, "Close"),*/
    
                                m(Button,{
                                    type:'primary',
                                    onclick:(e)=>{
                                        announcement.cod = create_UUID();
                                        
                                        // save announcement
                                        addAnnouncement(course.cod,announcement).then((res)=>{
                                            document.getElementById('closemodalmed').click()
                                            m.redraw()
                                        })
                                    }
                                }, "Save"),
                            )
                        ),
    
                        m(Button,{
                            target:'#modal-announcement',
                            onclick:(e)=>{}, 
                            type:"primary"
                        }, "Create announcement")
                    ]
                }   
            }
        }

        return {
            view:(vnode)=>{
                return [
                    m(AddAnnouncement),
                    /*m(Button,
                       
                        
                        m(SendMessage),
                        
                        
                    )*/
                    m("h3","My announcements"),

                    course.announcements && course.announcements.length ?
                    m(Grid,
                        course.announcements.map((announcement)=>{
                            return m(Column, { width: '1-3' },
                                m(Card,
                                    m(CardHeader, 
                                        m("strong", announcement.title),
                                        m("p", announcement.description)
                                    ),
                                    m(CardBody,
                                        
                                        m(Grid,

                                            m(Column,{width:'1-2'},
                                                m(FormLabel, "Start date"),
                                                m("p",announcement.startDate),
                                            ),
                                            m(Column,{width:'1-2'},
                                                m(FormLabel, "Start time"),
                                                m("p",announcement.startTime),
                                            ),
                                            m(Column,{width:'1-2'},
                                                m(FormLabel, "End date"),
                                                m("p",announcement.endDate),
                                            ),
                                            m(Column,{width:'1-2'},
                                                m(FormLabel, "End time"),
                                                m("p",announcement.endTime),
                                            ),
                                            
                                            m(Column ,{width:'1-2'},
                                                m(FormLabel, "Repeat?"),
                                                m("p",announcement.repeat || 'None'),
                                            )
                                        )
                                    ),
                                    m(CardFooter,
                                        m(Button, {
                                            type:'secondary',
                                            onclick:(e)=>{
                                               // m.route.set('/editannouncement/' + announcement.cod)
                                            //    m.route.set('/editannouncement/' + announcement.cod)
                                            // TODO: EDIT announcement
                                            }
                                        },"Edit"),
                                        m(Button, {
                                            type: "danger",
                                            style: "margin-left:10px",
                                            onclick: (e) => { 
                                                // TODO: remove announcement
                                                
                                            }
                                        }, "Remove")
                                    )   
                                )
                            )
                        }) 
                    ):m("p",  "No announcements yet"),
                ]
            }
        }
    }

    function Content(){

        return {
            view:(vnode)=>{
                return [
                    m(AddContent,{courseId:course.cod, addLabel:true, type:'primary'}),

                    m("h3", "Added content"),

                    course.content && course.content.length > 0 ?
                    course.content.map((content)=>{
                        return m(Column, { width: '1-3' },
                        m(Card,
                            m(CardBody,
                                m("label", cont.title),
                                m("strong",cont.position),
                            ),
                            m(CardFooter,
                                m(Button, {
                                    type:'secondary',
                                    onclick:(e)=>{
                                        m.route.set('/editcontent/' + cont.cod)
                                    }
                                },"View"),
                                m(Button, {
                                    type: "danger",
                                    style: "margin-top:3px",
                                    onclick: (e) => { 
                                        cont.position = null; 
                                        let contentwithmoreposition = filteredcontent.filter((c) => c.position > cont.position);
                                        contentwithmoreposition.map((c)=> {
                                            c.position-=1;
                                            updateContent(c);
                                        })

                                        console.log(cont)

                                        updateContent(cont); 
                                    }
                                }, "Remove")
                            )
                        )
                    )
                    }): m("p","No content has been added yet"),
                ]
            }
        }
    }

    function Students(){
        return {
            view:(vnode)=>{
                return [
                    
                    m("h3","Students"),
                        
                    course.students && course.students.length ? 
                    m(Grid,
                        course.students.map((student)=>{
                            
                            return m(Column, { width: '1-3' },
                                m(Card,
                                    m(CardHeader,
                                        m("strong", student.name),
                                        m("p", student.email)
                                    ),

                                    m(CardFooter,
                                    ),
                                )
                            )
                        })
                    ):m("p",  "No student has joined yet")

                ]

            }
        }
    }

    function Chat(){
        return {
            view:(vnode)=>{
                return [
                    m(Grid,
                        m(Column,{width:'1-2'},
                            m(ChatComponent,{
                                user: getCurrentUser(),
                                title: "Course messages",
                                messages:course.messages || [], 
                                sendMessage:(message)=>{
                                    if(!course.messages){
                                        course.messages = []
                                    }
                                    course.messages.push(message)
                                    
                                    // HAY QUE AÑADIRLO AL CURSO !
                                    m.redraw()   
                                }
                            })
                        )
                    )
                ]
            }
        }
    }

    function Timeline(){
        return {
            view:(vnode)=>{
                return [
                    m("h3","Timeline"),
                    m("p","No timeline yet")
                ]
            }
         }
    }

    return {
        oninit:(vnode)=>{
            // sacamos  el curso
            getCourse(vnode.attrs.cod).then((res)=>{
                course =res
                console.log(res);
                m.redraw()
            })
        },
        view:(vnode)=>{
            return  m(Padding,
                
                m(NavBar,{style:"width:100%;border-bottom:1px solid #ccc"},
                    Object.keys(menuitems).map((item)=>{
                        return m("li",
                        m("a",{
                                style:(showing==menuitems[item]?'color:black':';opacity:0.5'),
                                onclick:(e)=> showing = menuitems[item],
                            },item)
                        )
                    })
                ),

                m(Section,{type:'muted',style:"padding-top:0px!important"},
                    m(Padding, 
                        showing == menuitems.Information ?
                            m(BasicInfo):
                        showing == menuitems.Announcements ?
                            m(Announcements):
                        showing == menuitems.Content ?
                            m(Content):
                        showing == menuitems.Students ?
                            m(Students):
                        showing == menuitems.Chat ?
                            m(Chat) :
                        showing  == menuitems.Timeline ?
                            m(Timeline):
                        null,
                    
                    )
                ) 
            )            
        }
    }
}



//  añadir aquí edit content
// añadir aquí content management


export {EditCourse}