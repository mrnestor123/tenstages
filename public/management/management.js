
// METER AQUÍ TODO LO DEL MANAGEMENT DE LA APP.
// EDITAR PROFESOR, EDITAR CONTENIDO, VER CONTENIDO
import { addContent, addPath, addStage, addSumUp, addTechnique, addVersion, deleteTechnique, deleteUser, getAllContent, getContentbycod, getPaths, getRequests, getSettings, getStages, getStats, getSumups, getTeachersContent, getTechniques, getUser, getUserActions, getUserMessages, getUsers, getVersions, postRequest, updateContent, updateRequest, updateSettings, updateStage, updateTechnique, updateUser } from '../api/server.js'
import { Button, Card, CardBody, CardFooter, CardHeader, CardMedia, Column, Container, Form, Grid, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Padding, Row, Section, Select, TextEditor, TextField } from '../components/components.js'
import { showAlert } from '../components/dialogs.js'
import { FileExplorer, InfoText, showFileExplorer } from '../components/management-components.js'
import { AddContent, AddCourse, ContentCard, EditableField, FileView, ImagePicker, Path } from '../components/tenstages-components.js'
import { stagenumbers, types, user } from '../models/models.js'
import { isAdmin, isGame, isLesson, isMeditation, isVideo } from '../util/helpers.js'
import { DefaultText, FormLabel, Header, Header3, SubHeader } from '../util/texts.js'
import { create_UUID, dia, hora } from '../util/util.js'


//  HAY QUE MIRAR SI ESTÁ LOGUEADO
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
                        m(Button, {
                            type:'primary',
                            onclick: (e) => { 
                                // TODO:  UPDATE course  
                                // We have to remove content, students... !!   
                                
                                if(editing) {
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

function ManagementMain(){
    return {
        view:(vnode)=>{
            return [
                m(Section,
                    m(Padding,
                        m(Grid,{center:true,verticalalign:true},
                            m(Column,{width:'1-2', style:"text-align:center;"},
                                m(Icon,{icon:'construction', size:'massive'})
                            ),
                            m(Column,{width:'1-2'},
                                m(Header,
                                    "TenStages Management"    
                                ),
                                m(SubHeader,
                                    "Find more about tenstages my bro this is wonderful"    
                                )
                            )
                        )
                    )
                )
            ]
        }
    }
}

function ContentManagement() {
    // lista con la forma 'id': lesson. TEndrá que ser CONTENT !!!
    let filter = { 'stagenumber': 1, 'type': 'techniques' }
    let stages = []
    let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'none']

    let content = [];
    let filteredcontent = [];

    let meditations = []
    let lessons = []

    // PARA CREAR RECORDINGS Y MEDITACIONES DINÁMICAMENTE
    let paths = []
    let games = []
    let versions =[]
    let users = []
    let videos = []
    let techniques = []

    //para subir imágenes a la lección
    let index = 0;
    let json = {};

    let sumups = []

    function filtercontent(stage = 1){
        lessons = content.filter((item) => isLesson(item) && item.stagenumber == stage && (isAdmin(user) ||  item.position != null || item.createdBy == localStorage.getItem('meditationcod')))
        meditations = content.filter((item)=> isMeditation(item) && item.stagenumber == stage && (isAdmin(user) || item.position != null || item.createdBy == localStorage.getItem('meditationcod')))
        games = content.filter((item)=> isGame(item) && item.stagenumber == stage)
        videos = content.filter((item)=> isVideo(item) && item.stagenumber == stage && ( isAdmin(user) || item.position != null || item.createdBy == user.coduser))
        filteredcontent = lessons
    }

    return {
        oninit: (vnode) => {
            getAllContent().then((res)=>{
                function compare(a,b){
                    if(a.position != undefined && b.position == null){
                        return -1
                    }else if(b.position != undefined && a.position == null){
                        return 1   
                    }else{
                        return 0;
                    }
                }
        
                content = res.sort((a,b) => compare(a,b));
                filtercontent(1)
            })

            getSumups().then((res)=>{
                if(res){
                    sumups = res;
                }
            })

            getStages().then((res) => {
                stages = res;
                stages.sort((a, b) => a.stagenumber - b.stagenumber)
            });

            getTechniques().then((res)=>{
                techniques = res
            })

            getUsers().then((res) => {
                users = res;
            })

            getVersions().then((res)=>{
                versions = res;
            })

            getPaths().then((res)=>{
                paths = res;
            })
        },
        view: (vnode) => {
            return m(Padding,
                m(Grid,
                    {
                        size: "small",
                    },
                    m(Column, { width: '1-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Stage"),
                        m(Select,
                            {
                                data: filter,
                                name: "stagenumber",
                                onchange: (e) => {
                                    filtercontent(e.target.value == 'none' ? e.target.value : Number(e.target.value))
                                }
                            },
                            stagenumbers
                        )
                    ),
                    m(Column, { width: '1-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Showing"),
                        m(Select,
                            {
                                data: filter,
                                name: "type",
                                onchange: (e) => {
                                    if(filter.type == 'meditations'){
                                        filteredcontent = meditations
                                    }else if(filter.type == 'lessons'){
                                        filteredcontent = lessons
                                    }else if(filter.type == 'techniques'){
                                        filteredcontent = techniques
                                    }else if(filter.type == 'games'){
                                        filteredcontent = games
                                    }else if(filter.type == 'paths'){
                                        filteredcontent = paths
                                    }else if(filter.type == 'videos'){
                                        filteredcontent = videos
                                    }
                                }
                            },
                            user.role == 'admin' ? 
                            ['lessons', 'techniques', 'stage', 'meditations','paths','videos', 'games', 'users', 'versions'] :
                            ['lessons','techniques', 'stage','meditations','paths','videos']
                        )
                    ),
                    m(Column, { width: '3-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Add to the app"),
                        m(AddContent),
                        m(AddPath),
                        m(AddStage),
                        user.role == 'admin' ? [
                            m(AddGame),
                            m(AddVersion)
                        ]: null
                    ),


                    m(Row,
                        m(Grid,{match:true},
                    filter.type == 'stage' ?
                        m(StageView) :
                    filter.type == 'users' ?
                        m(UsersView):
                    filter.type == 'versions' ? 
                        m(VersionsView)
                        : 
                    filter.type == 'paths' ? 
                        m(PathsView)
                    : 
                    filter.type ==  'techniques' ?
                        m(TechniquesView):
                        [
                        filter.type !='games' ?
                        m(ViewEditSumup) : null,
                        m(ContentView, { content: filteredcontent })
                    ]
                    ))
                )
            )
        }
    }


    function TechniquesView(){

        let editingindex = null;
        
        function AddTechnique(){
            let data = {}

            return {
                view:(vnode)=>{
                    return m(Modal,{id:'add-technique'},
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'close-modal-technique' }),
                        m(ModalHeader, "Add Technique"),
                        m(ModalBody,
                            m(Form,
                                m(Grid,
                                    m(Column,{width:'1-1'},
                                        m(FormLabel,  "Title"),
                                        m(TextField,{
                                            data:data,
                                            name:'title',
                                            rows:2
                                        })
                                    ),
                                    m(Column, {width:'1-1'},
                                        m(FormLabel, "Description"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'description'
                                        })
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "Why do we  do it?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'why'
                                        })
                                    ),
                                    /*
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "What to do if distracted?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'distraction'
                                        })
                                    ),*/
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "When to move on?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'moveon'
                                        })
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "When do we return to it?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'moveon'
                                        })
                                    ),
                                    
                                )
                            )
                        ),
                        m(ModalFooter,
                            m(Button,{
                                type:'primary',
                                onclick:()=>{
                                    data.cod = create_UUID()
                                    techniques.push(data)
                                    addTechnique(data)
                                    data = {}
                                    document.getElementById('close-modal-technique').click()
                                    m.redraw()
                                }}
                            ,'Save')
                        )
                    )
                }
            }
        }
        
        function sortByStageAndPosition(a,b){
            
            if(a.position && b.position  ==  null){
                return -1 
                
            }
            
            if(b.position  && a.position == null) {
                return 1   
            }
            
            if(a.startingStage && b.startingStage){
                if(a.startingStage == b.startingStage){
                    return a.position - b.position
                }else{
                    return a.startingStage - b.startingStage
                }
            }

           
            console.log('sorting by position')
            return b.position - a.position
            
        }


        return {
            view:(vnode)=>{

                //console.log('techniques',techniques)
                return [
                    m(Column,{width:'1-1'},
                        
                         m("h3", "Techniques"),
                    
                        m("div", {style:"margin-bottom:20px;"}),
                    
                        m(Button,{
                            target:'#add-technique',
                            type:'secondary'
                        }, 'Add New Technique',),
                        
                        m(AddTechnique),
                    ), 

                    techniques.sort(sortByStageAndPosition).map((technique,index)=>{
                        let isEditing = editingindex == index

                        return m(Column,{width:'1-3'},m(Card, 
                            m(CardMedia,
                                m(ImagePicker, { data: technique, name: "image", id: `text-images-slider-${index}`
                                /*onchange:(image)=>{
                                    console.log('changing image',image)
                                    technique.image = image
                                }*/
                            })
                            ),

                            m(CardHeader,  
                                m(EditableField,{
                                    data:technique,
                                    name:'title',
                                    isEditing: editingindex == index
                                
                                }, m("h3",technique.title)),

                                m(EditableField,{
                                    data:technique,
                                    name:'description',
                                    type:'html',
                                    isEditing: editingindex == index
                                },  m("p", m.trust(technique.description))),

                                m(Grid,
                                    m(Column,{width:'1-2'},
                                        m("h4", "Starting stage"),
                                        m(EditableField,{
                                        data:technique,
                                        name:'startingStage',
                                        type:'number',
                                        isEditing: editingindex == index
                                    },m("strong", technique.startingStage))),


                                    m(Column,{width: '1-2'}, 
                                        m("h4", "Ending stage"),
                                        m(EditableField,{
                                        data:technique,
                                        name:'endingStage',
                                        type:'number',
                                        isEditing: editingindex == index
                                    },m("strong", technique.endingStage))),

                                    m(Column,{width: '1-2'},
                                        m("h4", "Position"),
                                    m(EditableField,{
                                        data:technique,
                                        name:'position',
                                        type:'number',
                                        isEditing: editingindex == index
                                    }, m("strong", technique.position)))
                                )
                            ),
                            
                            m(CardBody,
                                m(Grid,
                                    m(Column,{width:isEditing  ? '1-1': '1-2'},
                                        m("h4", "Why do we do it?"),
                                        m(EditableField,{
                                            data:technique,
                                            name:'why',
                                            type:'html',
                                            isEditing: editingindex == index,
                                            }, m("p",m.trust(technique.why))
                                        )
                                    ),

                                    /*
                                    m(Column,{width:isEditing  ? '1-1': '1-2'},
                                        m("h4", "What to do if distracted?"),
                                        m(EditableField,{
                                            data:technique,
                                            name:'distraction',
                                            type:'html',
                                            isEditing: editingindex == index,
                                        }, m("p",m.trust(technique.distraction))),
                                    ),*/

                                    m(Column,{width:isEditing  ? '1-1': '1-2'},
                                        m("h4", "When to move on?"),

                                        m(EditableField,{
                                            data:technique,
                                            name:'moveon',
                                            type:'html',
                                            isEditing: editingindex == index,
                                        }, m("p",m.trust(technique.moveon))),
                                    ),

                                    m(Column,{width:isEditing  ? '1-1': '1-2'},
                                        m("h4", "When do we return to it?"),

                                        m(EditableField,{
                                            data:technique,
                                            name:'return',
                                            type:'html',
                                            isEditing: editingindex == index,
                                        }, m("p",m.trust(technique.return))),
                                    ),                                        
                                )
                                
                            ),

                            m(CardFooter,
                            editingindex != index ?[
                                m("a.uk-button.uk-button-text",
                                { 
                                    onclick: (e) => {
                                        editingindex = index
                                    }
                                },
                                "Edit")    
                            ] :  [

                                // SAVE BUTTON
                                m(Button,{
                                    type:'primary',
                                    style:"margin-right:15px",
                                    onclick:(e)=>{
                                        editingindex = null
                                        updateTechnique(technique)
                                    }
                                }, "Save"),

                                m(Button,{
                                    type:'secondary',
                                    onclick:(e)=>{
                                        // DELETE BUTTON
                                        editingindex = null
                                        deleteTechnique(technique)
                                    }
                                },  "Delete")

                            ]
                            )
                        ))
                    })
                    
                ]
            }
        }
    }


    /*
    function AddLesson() {
        let step = 1;
        let text = []
        let slider = '';

        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
            'stagenumber': 1,
            'text': text,
            'type': 'lesson'
        }

        return {
            view: (vnode) => {
                return [
                    m("button.uk-button.uk-button-primary",
                        {
                            'uk-toggle': 'target:#modal-lesson',
                            type: "button",
                            onclick: (e) => { step = 1 }
                        },
                        "Lesson"),
                    m("div",
                        {
                            'uk-modal': '',
                            id: "modal-lesson"
                        },
                        m(".uk-modal-dialog.uk-margin-auto-vertical",
                            m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodal' }),
                            m(".uk-modal-header", m(".uk-modal-title", "Add lesson")),
                            m(".uk-modal-body",
                                    m("p", { style: "text-align:center" }, "Input basic lesson information"),
                                    m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                        m(Row,
                                            m("label.uk-form-label", "Title"),
                                            m(TextField, { type: "input", data: json, name: "title" })
                                        ),
                                        m(Row,
                                            m("label.uk-form-label", "Description"),
                                            m(TextField, { type: "input", data: json, name: "description" })

                                        ),
                                        m(Column, { width: '1-3' },
                                            m("label.uk-form-label", "Image"),
                                            json.image ? m("img", { src: json.image }) : null,
                                            m(Button,
                                                {
                                                    target: '#modal-images2',
                                                    type: "secondary"
                                                }, !json.image ? "Upload image" : 'Change image'),
                                            m(ImagePicker, { id: "modal-images2", data: json, name: "image" })
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("label.uk-form-label", "Stagenumber"),
                                            m(Select,
                                                { data: json, name: "stagenumber" },
                                                stagenumbers
                                            )
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("label.uk-form-label", "Type"),
                                           
                                        )
                                    )
                                    /*
                                    [
                                        m("p", { style: "text-align:center" }, "Write the lesson content"),
                                        m(Grid,
                                            text.length > 0 ?
                                                text.map((item, i) => {
                                                    return m(Column, { width: '1-3' },
                                                        m(LessonSlide, { data: text, index: i, item: item })
                                                    )
                                                }) : null,
                                            m(Column,
                                                {
                                                    width: '1-3',
                                                    style: "cursor:pointer",
                                                    'uk-icon': 'icon:plus',
                                                    onclick: (e) => {
                                                        text.push({ 'text': "Edit this text", 'image': '' });
                                                        m.redraw()
                                                        console.log(text);
                                                    }
                                                }
                                            )
                                        )
                                    ]
                            ),
                            m(".uk-modal-footer.uk-text-right",
                              //  step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                                m("button.uk-button.uk-button-primary",
                                    {
                                        onclick: async (e) => {
                                          
                                            console.log(json)
                                            json.cod = create_UUID();
                                            json.stagenumber = Number(json.stagenumber)
                                            addContent(json);
                                            document.getElementById('closemodal').click();
                                            m.route.set(`/editcontent/${json.cod}`)

                                            json = { 'type': 'lesson' }
                                            text = []
                                            
                                        }
                                    },
                                    "Create" )
                            )
                        )
                    )
                ]
            }
        }

    }*/

    // PASAR ADD content a otra pantalla
    function AddContent() {
        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
            'duration': 1,
            'stagenumber': 1,
            'path':'',
            'type': 'meditation-practice',
            'content': {}
        }

      

        let step = 1


        return {
            view: (vnode) => {
                return [
                    m(Button,
                        {
                            'target': '#modal-meditation',
                        },
                        "Content"),
                    m(Modal,
                        {
                            id: "modal-meditation",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalmed' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Content")),
                        m(".uk-modal-body",
                            m("p", { style: "text-align:center" }, "Input basic meditation information"),
                            m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                    m(Row,
                                        m("label.uk-form-label", "Title"),
                                        m(TextField, { type: "input", data: json, name: "title" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Description"),
                                        m(TextField, { type: "input", data: json, name: "description" })
                                    ),
                                    m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Image"),
                                        json.image ? m("img", { src: json.image }) : null,
                                        m(Button,
                                            {
                                                target: '#modal-meditationimages2',
                                                type: "secondary"
                                            }, !json.image ? "Upload image" : 'Change image'),
                                        m(ImagePicker, { id: "modal-meditationimages2", data: json, name: "image" })
                                    ),

                                    m(Column,{ width: '3-4' },
                                        m("label.uk-form-label", "Is it part of a path"),
                                        m(Select,{data: json, name: 'path'},[''].concat(paths.map((path)=>{
                                            return {'label':path.title,'value':path.cod}
                                        }))),
                                    ),

                                    m(Column,{width:'1-4'},
                                        m("label.uk-form-label","Type"),
                                        m(Select,{data:json,name:'type'},types)
                                    ),
                                    
                                    !json.path 
                                    ? [
                                        m(Column, { width: '1-4' }, 
                                            m("label.uk-form-label", "Stagenumber"),
                                            m(Select,
                                                { data: json, name: "stagenumber" },
                                                stagenumbers
                                            )
                                        ),
                                        m(Column, { width: '1-4' },
                                            m("label.uk-form-label", "Duration"),
                                            m(TextField,
                                                {
                                                    data: json, name: "duration", type: "number"
                                                }
                                            )
                                        )
                                    ] : null
                                ) 
                        ),
                        m(".uk-modal-footer.uk-text-right",
                           // step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                            m("button.uk-button.uk-button-primary",
                                {
                                    onclick: (e) => {
                                      
                                        json.cod = create_UUID();

                                        if(json.path){
                                            delete json.stagenumber
                                        }else {
                                            if(json.stagenumber == 'none'){
                                                json.stagenumber = 'none'
                                            }else{
                                                json.stagenumber = Number(json.stagenumber)
                                            }
                                        }

                                        addContent(json);
                                        document.getElementById('closemodalmed').click();
                                        console.log('added meditation !')
                                        
                                        m.route.set(`/editcontent/${json.cod}`)

                                        json = {
                                            'cod': '',
                                            'title': '',
                                            'description': '',
                                            'image': '',
                                            'duration': 1,
                                            'stagenumber': 1,
                                            'type': 'meditation-practice',
                                            'content': {}
                                        }
                                    }
                                },
                                 "Create")
                        )
                    )
                ]
            }
        }
    }

    function AddGame() {
        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
            'stagenumber': 1,
            'type': 'meditation-game',
            'video': '',
            'questions': []
        }

        let step = 1

        return {
            view: (vnode) => {
                return [
                    m(Button,
                        {
                            'target': '#modal-game',
                        },
                        "Game"),
                    m(Modal,
                        {
                            id: "modal-game",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalgame' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Game")),
                        m(".uk-modal-body",
                            step == 1 ? [
                                m("p", { style: "text-align:center" }, "Input game basic content"),
                                m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                    m(Row,
                                        m("label.uk-form-label", "Title"),
                                        m(TextField, { type: "input", data: json, name: "title" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Description"),
                                        m(TextField, { type: "input", data: json, name: "description" })
                                    ),
                                    m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Image"),
                                        json.image ? m("img", { src: json.image }) : null,
                                        m(Button,
                                            {
                                                target: '#modal-images3',
                                                type: "secondary"
                                            }, !json.image ? "Upload image" : 'Change image'),
                                        m(ImagePicker, { id: "modal-images3", data: json, name: "image" })
                                    ),
                                    m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Stagenumber"),
                                        m(Select,
                                            { data: json, name: "stagenumber" },
                                            stagenumbers
                                        )
                                    ),
                                    m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Video"),
                                        json.video ? m("video", { src: json.video, 'controls':true }) : null,
                                        m(Button,
                                            {
                                                target: '#modal-video',
                                                type: "secondary"
                                            }, !json.video ? "Upload video" : 'Change video'),
                                        m(ImagePicker, { id: "modal-video", data: json, name: "video" })
                                    ),
                                )
                            ] :
                                [
                                    m("p", "Input game questions"),
                                    m(Grid,
                                        json.questions.map((question, index) => {
                                          return [  
                                              m(Column,{width:'1-2'},
                                                m("label","Question"),
                                                m(TextField,{type:'input', data:question, name: 'question'})
                                            ),
                                            m(Column,{width:'1-2'},
                                                m("label","Answer"),
                                                m(TextField,{type:'input', data:question, name: 'answer'})
                                            )
                                          ]
                                        }),


                                        m(Column,
                                            {
                                                width: '1-3',
                                                style: "cursor:pointer",
                                                onclick: (e) => {
                                                    json.questions.push({ 'question': '', 'answer': '' });
                                                }
                                            },
                                            m("i",
                                            {
                                                style:"font-size:40px",
                                                class: 'material-icons'
                                            },
                                            "add"
                                            ) 
                                        )
                                    )
                                ]
                        ),
                        m(".uk-modal-footer.uk-text-right",
                            step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                            m("button.uk-button.uk-button-primary",
                                {
                                    onclick: (e) => {
                                        if (step == 1) { step++; index = 1; }
                                        else {
                                            json.cod = create_UUID();
                                            addContent(json);
                                            document.getElementById('closemodalgame').click();
                                            json = {
                                                'cod': '',
                                                'title': '',
                                                'description': '',
                                                'image': '',
                                                'duration': 1,
                                                'stagenumber': 1,
                                                'type': 'meditation-practice',
                                                'content': {}
                                            }
                                            step = 1
                                        }
                                    }
                                },
                                step > 1 ? "Create" : "Next")
                        )
                    )
                ]
            }
        }
    }

    function AddStage() {
        let json = {
            'description': '',
            'goals': '',
            'image': '',
            'mastery': '',
            'obstacles': '',
            'skills': '',
            'stagenumber': 0,
            'path': {}
        }

        return {
            view: () => {
                return [
                    m(Button,
                        {
                            'target': '#modal-stage',
                        },
                        "Stage"),
                    m(Modal,
                        {
                            id: "modal-stage",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'modal-stage' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Stage")),
                        m(".uk-modal-body",
                            [
                                m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                    m(Row,
                                        m("label.uk-form-label", "Description"),
                                        m(TextField, { type: "input", data: json, name: "description" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Goals"),
                                        m(TextField, { type: "input", data: json, name: "goals" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Skills"),
                                        m(TextField, { type: "input", data: json, name: "skills" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Mastery"),
                                        m(TextField, { type: "input", data: json, name: "mastery" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Obstacles"),
                                        m(TextField, { type: "input", data: json, name: "obstacles" })
                                    ),
                                    m(Column, { width: '1-2' },
                                        m("label.uk-form-label", "Image"),
                                        json.image ? m("img", { src: json.image }) : null,
                                        m(Button,
                                            {
                                                target: '#image-stage',
                                                type: "secondary"
                                            }, !json.image ? "Upload image" : 'Change image'),
                                        m(ImagePicker, { id: "image-stage", data: json, name: "image" })
                                    ),
                                    m(Column, { width: '1-2' },
                                        m("label.uk-form-label", "Stagenumber"),
                                        //será un select
                                        m("select.uk-select",
                                            { onchange: (e) => json.stagenumber = Number(e.target.value) },
                                            stagenumbers.map((stage) => {
                                                return m("option", stage)
                                            })
                                        )
                                    ),

                                )
                            ],
                        ),
                        m(".uk-modal-footer.uk-text-right",
                            m("button.uk-button.uk-button-primary",
                                {
                                    onclick: (e) => {
                                        addStage(json);
                                        document.getElementById('modal-stage').click();
                                        json = {}
                                    }

                                },
                                "Create")
                        )
                    )
                ]
            }
        }

    }

    function AddVersion(){
        let json = {
            'versionNumber':'',
            'description':'', 
            'content':[]
        }

        return {
            view:(vnode)=>{
                return [
                    m(Button,
                    {
                        'target': '#modal-version',
                    },
                    "Version"),
                m(Modal,
                    {
                        id: "modal-version",
                        center: true
                    },
                    m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodal' }),
                    m(ModalHeader, m(".uk-modal-title","Add Version")),
                    m(ModalBody,
                        m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                            m(Row,
                                m(FormLabel, "VersionNumber"),
                                m(TextField,{type:'input',data:json,name:'versionNumber'})    
                            ),
                            m(Row,
                                m(FormLabel, "Description"),
                                m(TextField,{type:'input',data:json,name:'description'})    
                            ),
                            m(Row,
                                m(FormLabel, "Content"),
                                json.content.map((content)=>
                                    m(TextField,{type:'input',data:content,name:'text'})
                                ),
                                m(Button,{
                                    onclick:(e)=> json.content.push({})
                                },  "Add Content")

                            ),
                        )
                    ),
                   
                    m(".uk-modal-footer.uk-text-right",
                        m("button.uk-button.uk-button-primary",
                            {
                                onclick: (e) => {
                                    addVersion(json);
                                    document.getElementById('closemodal').click();
                                    json = {'content':[]}
                                }
                            },
                            "Create")
                    )
                )    
                ]          
            }
        }
    }

    function AddPath() {
        //  UN  PATH PUEDE TENER UNA IMAGEN ??
        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
        }

        let step = 1

        return {
            view: (vnode) => {
                return [
                    m(Button,
                        {
                            'target': '#modal-path',
                        },
                        "Path"),
                    m(Modal,
                        {
                            id: "modal-path",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'close-modal-path' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Path")),
                        m(".uk-modal-body",
                            m("p", { style: "text-align:center" }, "Input game basic content"),
                            m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                m(Row,
                                    m("label.uk-form-label", "Title"),
                                    m(TextField, { type: "input", data: json, name: "title" })
                                ),
                                m(Row,
                                    m("label.uk-form-label", "Description"),
                                    m(TextField, { type: "input", data: json, name: "description" })
                                ),
                                m(Column, { width: '1-4' },
                                    m("label.uk-form-label", "Image"),
                                    json.image ? m("img", { src: json.image }) : null,
                                    m(Button,
                                        {
                                            target: '#modal-path',
                                            type: "secondary"
                                        }, !json.image ? "Upload image" : 'Change image'),
                                    m(ImagePicker, { id: "modal-path", data: json, name: "image" })
                                )
                            )
                        ),
                        m(".uk-modal-footer.uk-text-right",
                            m("button.uk-button.uk-button-primary",
                                {
                                    onclick: (e) => {
                                        json.cod = create_UUID();
                                        addPath(json);
                                        document.getElementById('close-modal-path').click();
                                        json = {
                                            'cod': '',
                                            'title': '',
                                            'description': '',
                                            'image': ''
                                        }
                                    }
                                },
                                "Create" )
                        )
                    )
                ]
            }
        }
    }

    //para ver meditaciones y lecciones
    function ContentView() {
        return {
            view: (vnode) => {
                return vnode.attrs.content.map((content) => {
                    return m(Column,{width:'1-3'}, 
                        m(ContentCard,{
                            content:content
                        })
                    )
                })
            }
        }

    }

    // ESTO TENDRÍA QUE ESTAR
    function StageView() {
        let stage = { 'objectives': {}, 'meditations': {} };
        let toadd = {}

        let position = { 'selected': 0 }
        let path_filter = 'lessons'
        //let filteredcontent = []
        let new_path = 1;
        let old_path = 0;
        let showing = old_path
        let edit = false;

        function StageHeader() {
            return {
                view: (vnode) => {
                    console.log(stage.longimage)
                    return m(Card,
                        m(CardHeader,
                            ' Stage ' + filter.stagenumber,
                            m(Button,
                                {
                                    width:'1-5',
                                    onclick: (e) => edit = !edit
                                },
                                "EDIT"
                            ),
                            m(Button, { width: '1-4', style: "margin-left:5px", type: "primary", onclick: (e) => updateStage(stage) }, "Save"),
                        ),
                        m(CardBody,
                            m(Grid,
                                m(Column, { width: '1-3' },
                                    m("strong", "Basic information"),
                                    !edit ?
                                        [
                                            m("p", "Description : ", stage.description),
                                            m("p", "Goals: " + stage.goals),
                                            m("p", "Obstacles: " + stage.obstacles,),
                                            m("p", "Skills: " + stage.skills),
                                            m("p", "Mastery: " + stage.mastery)
                                        ] :
                                        [
                                            m("p", "Description :", m(TextField, { data: stage, name: "description", type: "input" })),
                                            m("p", "Goals :", m(TextField, { data: stage, name: "goals", type: "input" })),
                                            m("p", "Obstacles :", m(TextField, { data: stage, name: "obstacles", type: "input" })),
                                            m("p", "Skills :", m(TextField, { data: stage, name: "skills", type: "input" })),
                                            m("p", "Mastery :", m(TextField, { data: stage, name: "mastery", type: "input" })),
                                            
                                        ],
                                    m("strong", "Long description"),
                                    m(TextEditor,{data:stage,name:'longdescription'}),

                                    m("strong", "When to begin next stage?"),
                                    m(TextEditor,{data:stage, name:'whenToAdvance'}),

                                    m("strong", "Summary of practice"),
                                    m(TextEditor,{data:stage, name:'practiceSummary'}),

                                    m("strong", "Key concepts"),
                                    m(TextEditor,{data:stage, name:'keyConcepts'}),
                                ),
                                m(Column, { width: '1-3' },
                                    m(Grid,
                                        m(Row, m("strong", "Objectives")),
                                        m(Column, { width: '1-2' },
                                            m("p", "Streak"),
                                            m(TextField, { data: stage['objectives'], name: "streak", type: "number" }),
                                        ),
                                        m(Column, { width: '1-2' },
                                            m("p", "Total time"),
                                            m(TextField, { data: stage['objectives'], name: "totaltime", type: "number" }),
                                        ),
                                        m("p", "Meditations"),
                                        m(Column, { width: '1-3' },
                                            m("span", "Time"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "time", type: "number", placeholder: "time" })
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("span", "Number of meditations"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "count", type: "number", placeholder: "count" })
                                        ),
                                        
                                        m(Column, { width: '1-2' },
                                            m("span", "Number of retreats"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "retreatnumber", type: "number", placeholder: "Retreat number" })
                                        ),

                                        m(Column, { width: '1-2' },
                                            m("span", "Duration"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "retreatduration", type: "number", placeholder: "Retreat duration" })
                                        ),
                                            
                                        m("strong", "Image description"),
                                        m(TextEditor,{data:stage,name:'shorttext'}),
                                    )
                                ),
                                m(Column,{width:'1-3'},
                                    m("strong", "Images"),
                                    m(Button,
                                    {
                                        target: '#stage-long-image',
                                        type: "secondary"
                                    }, !stage.longimage ? "Upload long image" : 'Change image'),
                                    m("div","Long image"),
                                    m("div", stage.longimage? m("img",{src:stage.longimage}) : m("span")),
                                    m(ImagePicker, { id: "stage-long-image", data: stage, name: "longimage" }),
                                    m(Button,
                                        {
                                            target: '#stage-short-image',
                                            type: "secondary"
                                        }, !stage.shortimage ? "Upload short image" : 'Change image'),
                                    m("div","Short image"),
                                    m("div", stage.shortimage ? m("img",{src:stage.shortimage}) : m("span")),
                                    m(ImagePicker, { id: "stage-short-image", data: stage, name: "shortimage"  })
                                )
                            )
                        )
                    )
                }
            }
        }

        function ContentAdd() {
            return {
                view: (vnode) => {
                    return m(Column, { width: '1-2' },
                        m("h3", path_filter.toUpperCase()),
                        m(Grid, { size: "small" },
                           filteredcontent.filter((c)=>c.position ==null).map((cont) => {
                                    return m(Column, { width: '1-3' },
                                        m(ContentCard,{content:cont})
                                    )
                                }
                            )
                        )
                    )

                }
            }
        }

        function Path() {
            return {
                view: (vnode) => {
                    return m(Column, { width: '1-2' },
                        m("h1", "The path"),
                        filteredcontent.filter((elem) => elem.position != null).sort((a, b) => a.position - b.position).map((cont) => {
                                return m(Grid,
                                    m(Column, { width: '1-3' },
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
                                )
                        })
                    )
                }
            }
        }

        function ContentCard(){
            let  toAdd = {}

            return {
                view:(vnode)=>{
                    let {content} = vnode.attrs

                    return m(Card,
                        m(CardHeader,
                            m(".uk-card-title", content.title)
                        ),
                        m(CardFooter,
                            m(Button, {
                                style: "margin-top:5px",
                                target: '#addtoPath',
                                onclick: (e) => { toadd = content },
                                type: "default"
                            }, content.position && showing == new_path || content.newpathposition ? 'Edit': "Add"),
                            m(Modal,
                                {
                                    id: 'addtoPath',
                                    center: true
                                },
                                m(ModalBody,
                                    m("label", "Add in position"),
                                    m(Select, {
                                        data: position,
                                        name: "selected",
                                    }, Array.from(new Array(Object.keys(content).length + 1).keys())),
                                    m(Button, {
                                        style: "margin-top:10px",
                                        class: "uk-modal-close",
                                        type: "primary",
                                        onclick: (e) => {

                                            if(showing == new_path){
                                                toadd.newpathposition = Number(position.selected)
                                                updateContent(toadd)
                                            }else{
                                                toadd.position = Number(position.selected);
                                                /*
                                                let ctwithlessposition = filteredcontent.filter((c)=> c.position >= toadd.position)
                                                if(ctwithlessposition.length > 0){
                                                    ctwithlessposition.map((c)=>{
                                                        c.posti
                                                    })
                                                }*/
                                                updateContent(toadd)
                                                position.selected = 0
                                            }
                                        }
                                    }, "Add")
                                )
                            )
                        )
                    )
                }
            }
        }

        function NewPath(){
            let groupedContent = {}

            return {
                oninit:(vnode)=>{
                    content.filter((c)=> c.newpathposition != null).map((c)=>{
                        if(!groupedContent[c.newpathposition]){groupedContent[c.newpathposition] = []}

                        groupedContent[c.newpathposition].push(c)
                    })
                },
                view:(vnode)=>{

                    

                    console.log(filteredcontent)
                    return [
                        //m("h1.uk-text-bold",{style:"width:100%"},"New path"),
                        m(Column,{width:'1-2'},
                            m("h2.uk-text-bold","Content"),
                            m(Grid,content.filter((a)=>a.stagenumber == stage.stagenumber && a.type !='meditation-game' && !a.newpathposition).sort((a,b)=> (a.title|| '').localeCompare(b.title||'')).map((c)=>{
                                return m(Column,{width:'1-3'},
                                    m(ContentCard,{content:c})
                                )
                            }))
                        ),

                        m(Column,{width:'1-2'},
                            m("h2.uk-text-bold","New Path"),
                            m(Grid,Object.keys(groupedContent).map((key)=>{
                                return groupedContent[key].map((c)=> {
                                    return m(Column,{width:'1-3'},m(ContentCard,{content:c}))
                                })
                            }))
                        )
                    ]
                }
            }
        }

        return {
            view: (vnode) => {
                stage = stages[(Number(filter.stagenumber) - 1)]
                //esto podría quitarlo
                if (!stage.objectives) { stage.objectives = { 'meditation': {}, }; console.log(stage) }

                if(stage.whenToBegin) {stage.whenToAdvance = stage.whenToBegin; delete stage.whenToBegin }
                if(stage.summaryOfPractice){stage.practiceSummary = stage.summaryOfPractice; delete stage.summaryOfPractice;}

                if(!stage.objectives || !stage.objectives.meditation){stage.objectives.meditation = {}}
                if (!stage.meditations) { stage.meditations = {}; console.log(stage) }

                console.log('stage',stage)

                return [
                    m(Row,
                        m(StageHeader)
                    ),
                    //m(Row,
                    //m(".uk-button-group",
                        //m(Button,{type:'secondary',onclick:(e)=>showing = new_path},"New path"),

                      //  m(Button,{type:'secondary', onclick:(e)=> showing = old_path}, "Old path")                   
                    //)),



                    showing == old_path ? [
                    m(Row,
                        m('.uk-button-group',
                            m(Button, { 
                                style: path_filter == 'lessons' ?  'background-color:lightgrey;color:black;' : '',

                                type: "secondary", 
                                onclick: (e) => {path_filter='lessons'; filteredcontent = lessons; } 
                            }, "Lessons"),
                            m(Button, { 
                                style: path_filter == 'meditations' ?  'background-color:lightgrey;color:black;' : '',
                                type: "secondary", 
                                onclick: (e) => {path_filter='meditations'; filteredcontent = meditations; } 
                            }, "Meditations"),
                            m(Button, {
                                style: path_filter == 'games' ?  'background-color:lightgrey;color:black;' : '',
                                type: "secondary", 
                                onclick: (e) => {path_filter='games'; filteredcontent = games; } 
                            }, "Games"),

                            m(Button, {
                                style: path_filter == 'videos' ?  'background-color:lightgrey;color:black;' : '',
                                type: "secondary", 
                                onclick: (e) => {path_filter='videos'; filteredcontent = videos; } 
                            }, "Videos"),
                        )
                    ),
                    m(ContentAdd),
                    m(Path)  
                
                    ]: m(NewPath)
                ]
            }
        }

    }

    function UsersView() {
        let data = ['cod','Username','Stage', "Rol", '']

        return {
            view:(vnode) => {
                return m("table", {
                    class: 'uk-table uk-table-striped uk-table-middle'
                },
                    m("thead",
                        m("tr",
                            data.map((str) => m("th", str))
                        )
                    ),
                    m("tbody",
                        users.map((user) => {
                            console.log(user)
                            return m("tr", 
                                m("td",user.coduser),
                                m("td", user.nombre || 'Anónimo'),
                                m("td", user.stagenumber),
                                m("td", user.role),
                                m("td", 
                                    m(Button, {
                                        onclick:(e)=> {
                                            if(user.role == 'admin'){
                                                user.role = 'meditator'
                                            }else{
                                                user.role ='admin'
                                            }
                                            // AQUI SOLO SE UPDATEA EL ROL !!!
                                            updateUser(user)
                                        }
                                    }, user.role == 'admin' ? 'Quitar admin': "Hacer admin"),
                                    m(Button, {
                                        onclick:(e)=> {
                                            if(user.role == 'teacher'){
                                                user.role = 'meditator'
                                            }else {
                                                user.role ='teacher'
                                            }
                                            updateUser(user)
                                        }
                                    }, user.role == 'teacher' ? 'Quitar profesor': "Hacer profesor"),

                                    m(Button, {
                                        onclick:(e) => {
                                            if(confirm('Estás seguro que quieres eliminar?')){
                                                console.log(user)
                                                deleteUser(user.cod ? user.cod : user.coduser)
                                            }
                                        }
                                    }, "Eliminar")
                                )
                            )
                        })
                    )
                )
            }
        }
    }

    function VersionsView(){

        let showing = {}


        function SendMail(){

            let data = {}

            // RECEIVERS SE ELEGIRÁ DE UNA LISTA


            return {
                view:(vnode)=>{
                    return m(Section,
                        m(Padding,
                            m("h3","Send Update mail"),
                            m(Form,
                                m(Grid,
                                m(Row,
                                    m(FormLabel, "Subject"),
                                    m(TextField,{placeholder:"Subject", data:data,name:'subject', onchange:(e)=>{showing.subject = e.target.value}}),
                                ),
                                m(Row,
                                    m(FormLabel, "Receivers"),
                                    m(TextField,{placeholder:"Receivers", data:data,name:'receivers', onchange:(e)=>{showing.receivers = e.target.value}}),
                                ),


                                m(Button,{
                                    type:"primary",
                                    onclick:(e)=>{
                                        sendMail()
                                    }
                                }, "Send")
                                
                                )
                        )
                    ))
                }
            }
        }

        return {
            view:(vnode)=>{
                return m(Row,m(Grid,
                    m(Column,{width:'1-2'},
                       m(SendMail)
                    ),
                    m(Column,{width:'1-2'},
                        m(Section,
                            m("h3","Versions"),
                            m("dl",{class:"uk-description-list"},versions.sort((a,b)=>b.versionNumber < a.versionNumber).map((version)=>{
                                console.log(version)
                                return [
                                    m("dt", version.description + ' version number:' + version.versionNumber),
                                    m("dd",
                                        m("ul",
                                            version.content.map((content)=>{
                                                return m("li",content.text)
                                            })
                                        )
                                    )
                                ]
                            }))
                        )
                    )
                    )
                )
            }
        }
    }

    function ViewEditSumup(){
        let sumup = {}

        let modelo = {
            'stagenumber':1,
            type: '',
            children:[ ]
        }

        function Menu(){
            let editingIndex = -1;

            return {
                view:(vnode)=>{
                    let {items,submenu} = vnode.attrs
                    if(items && items.length){
                        return m(submenu ? ".menu": ".ui.large.vertical.menu",
                            items.map((item,index)=>{
                                let isEditing = editingIndex == index

                                return m(".item",
                                    isEditing ? [
                                        m("i.circular.check.link.icon",{onclick:(e)=> editingIndex = -1}),
                                        m(TextField,{
                                            data:item,
                                            name:'text',
                                            type:'textarea'
                                        })
                                    ]: [
                                    
                                    m("i.circular.trash.red.icon",{
                                        onclick:(e)=>{
                                        if(!item.children || confirm('All the childrens will be deleted. Are you sure?')){
                                            items.splice(index,1)
                                        }
                                        }
                                    }),
                                    m("i.circular.edit.green.link.icon",{style:"z-index:100", onclick:(e)=> editingIndex = index}),
                                    
                                    
                                    m("i.circular.plus.blue.link.icon",{
                                        onclick:(e)=> {
                                            if(!item.children){item.children= []} 
                                            item.children.push({'text':'edit this text'})
                                        }
                                    }),

                                    m("span",{style:"word-wrap: break-word"},item.text),
                                
                                    item.children ? m(Menu,{items:item.children, submenu:true}): null,
                                ])
                            })
                        )
                    }
                }
            }
        }

        return {
            view:(vnode)=>{
                let type =filter.type == 'lessons' ? 'lesson': 'meditation'
                sumup = sumups.length ? sumups.filter((sumup)=> sumup.stagenumber == filter.stagenumber && sumup.type == type)[0] || {} : modelo

                sumup.type = type 

                return [
                    m(Column, {width:'1-1'},
                        m("div",{class:"uk-text-bold"}, "Short sum up"),
                        m(Button,{
                            onclick:(e)=>{
                                sumup.children.push({'text':'press on edit to change this text'})
                            }
                        },"Add new item"
                        
                        ),
                        m(Button,{
                            onclick:(e)=>{
                                addSumUp(sumup)
                            }
                        },"Save sum up"),

                        sumup.children && sumup.children.length ? m(Menu,{items:sumup.children}) : null  
                    ),              
                ]
            }
        }
    }

    function PathsView(){
        return {
            view:(vnode)=>{
                return m(Row, m(Grid, 
                    paths.map((path, i)=>{
                        return m(Path,{path:path})
                    })
                )
                )
            }
        }
    }
}

// TAMBIÉN PODEMOS CREAR !!!
function EditCreateContent() {
    let content = {}
    let editar = false;
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let uploading = false;

    let showing = 0;
    let basic_info = 0;
    let texts = 1;
    let file = 2;
    let article_texts = 3;

    //para cuando creamos un componente
    let json = {
        'cod': '',
        'title': '',
        'description': '',
        'image': '',
        'duration': 1,
        'stagenumber': 1,
        'path':'',
        'type': 'meditation-practice'
    }

    let isNew = false;

    function File(){
        return {
            view:(vnode)=>{
                // ARREGLAR ESTO !!!
                content.content =  null

                return [
                    content.type.match('meditation-practice|video|recording') ?
                    m(Row,
                        m(FormLabel, "Add a file to this content"),
                        m("button.uk-button.uk-button-default", { 
                            onclick: () => { showFileExplorer({'type':  content.type == 'video' ?  'video' : 'audio', data:content, name:'type'}); 
                        }}, 
                            content.file ? "CHANGE FILE": "ADD FILE"
                        ),

                        // HAY QUE MIRAR QUE ESTO SEA FILE !!!
                        /*
                        m(Column, {width: '1-2'},
                            m("video", {src: content.video, 'controls': true})
                        ),*/

                        // ESTO TENDRÍA QUE SER EL VISOR DE DOCUMENTOS NUESTRO !!!!
                        /*
                        m(FileUploader, {
                            data: {},
                            //path:content.path ? content.path.title : 'dynamicfiles',
                            onupload:() => uploading = true,
                            Dstage: content.stagenumber,
                            name: "file",
                            id: `meditation-file-chooser`,
                            onsuccess: (src) => { 
                                uploading = false;
                                content.file = src;
                                m.redraw(); 
                            }
                        }),*/
                        content.file ?  m("div",m(FileView,{file:content.file,key:uploading ? 0 : 1,style: "width:50%;height:200px;"})) : null
                    )  : null,

                    

                    m("div",{style:"height:20px"}),
                    
                ]
            }
        }
    }

    // SE HA PERDIDO LA FUNCIONALIDAD PARA LOS JUEGOS
    // añadir !!!
    function GameContent() {
        return {
            view:(vnode) => {
                return [ 
                m(Column, {width: '1-2'},
                    m("video", {src: content.video, 'controls': true})
                ),
                m(Column, {width: '1-1'}, 
                    m("ul.uk-list.uk-list-divider",
                    content.questions.map((question,index) => {
                        if(!question.key){
                            question.key = create_UUID()
                        }
                        
                        return [
                            m("li",
                                m("strong","Question"),
                                m("br"),
                                !editar ?  m("label", question.question) : m(TextField, {data:question, name:'question'}),
                                m("br"),

                                m("strong","Answers"),                               
                                m(Grid, {rowgap:'small'},
                                question.options ? 
                                    question.options.map((option,index) => {
                                        return [ 
                                            !editar ? 
                                            m(Column , {width:'1-4'},
                                                m("label",{style: index == question.answer ? 'color:green;font-weight:bold': ''},   option ? option : ' to do')
                                            ) 
                                            : 
                                            [
                                                m(Column, {width:'1-2'},
                                                    m(TextField, {data: question.options, name: index}),
                                                ),
                                                m(Column,{width:'1-4'},
                                                    question.image  
                                                    ?  m("img",{src:question.image, style:"width:50%;height:auto"})
                                                    :m(ImagePicker,{
                                                        data:question,
                                                        name:'image',
                                                        id:'question-images'
                                                    }),
                                                    
                                                    m(Button,
                                                        {
                                                            target: '#question-images',
                                                        }, 
                                                        !question.image ? "Add image" : 'Change image'),
                                                ),
                                                m(Column, {width:'1-4'}, 
                                                question.answer != index ?
                                                    m(Button, {
                                                    onclick:(e) => {
                                                        question.answer = index
                                                    }
                                                }, "Select") : null
                                                )
                                            ]
                                        ]
                                    }) : null
                                ),

                                editar ? [
                                    
                                    m("div.uk-width-1-3@m", 
                                        {   
                                            style:"cursor:pointer;color:red", 
                                            onclick:(e) => {content.questions.splice(index,1)}
                                        }, 
                                    "Dlt question"),
                                        
                                    m("div.uk-width-1-3@m", 
                                    {   
                                        style:"cursor:pointer;color:blue", 
                                        onclick:(e) => {question.options.push('Answer')}
                                    }, 
                                    "Add answer"),

                                    m("div.uk-width-1-3@m", 
                                    {   
                                        style:"cursor:pointer;color:red", 
                                        onclick:(e) => {
                                            console.log('deLeting answers')
                                            question.options.pop()
                                        }
                                    }, 
                                    "Delete last answer")
                                ] : null, 
                            ),                     
                        ]
                    }),

                    editar ? 
                    m("a.uk-width-1-1@m",
                            {
                                'uk-icon': 'icon:plus',
                                style:"margin-bottom:10px;",
                                onclick: (e) => {
                                    if(!content.questions){
                                        content.questions = []
                                    }
                                    content.questions.push({'question':'','answer':0, 'options': []})
                                }
                            },
                            "Add question"
                        ) : null
                    ) 
                )
                ]
            }
        }
    }

    function ImageSelector(){
        return{
            view:(vnode)=>{
                let {data,name, onselect, height} = vnode.attrs

                return [
                    m("div",{
                        style:`
                            position:relative; 
                            width:100%;
                            max-width:100%;
                            max-height:100%;
                            height:${height ? height : '300px'};
                            background-repeat:no-repeat;
                            background-image:url(${data && name && data[name] ? data[name] : './assets/buddha-sharing.webp'});
                            background-size:${data && name && data[name] ? 'contain':'cover'};
                            background-position:center;
                            border-radius:10px;
                            cursor:pointer;`,
                        
                        onclick:(e)=>{
                            showFileExplorer({'type': 'image', data:data, name: name})
                        }},
                        m("div",{
                            style:"position:absolute;inset:0px;border-radius:10px;background:rgba(0,0,0,0.5);opacity:0.7;display:flex;justify-content:center;align-items:center;",
                        },m("p",{style:"color:white;text-align:center;"},
                            "Press to change the image of the content"
                        ))
                    ),
                ]
            }
        }
    }

    function BasicInfo(){
        return {
            view:(vnode)=>{
                return m(Grid,
                    m(Column,{width:'2-5'},
                        m(Padding,
                            m(ImageSelector,{data:content, name:'image'})
                        )
                    ),

                    m(Column,{width:'3-5'},
                        m(Form,
                            m(Grid,
                                m(Row,
                                    m(FormLabel, "Title"),
                                    m(TextField, { type: "input", data: content, name: "title" })
                                ),
                                m(Row,
                                    m(FormLabel, "Description"),
                                    m(TextField, { type: "input", data: content, name: "description" })
                                ),

                                m(Column,{width:'1-3'},
                                    m(FormLabel,"Type"),
                                    m(Select,{data:content,name:'type'},types)
                                ),
                                
                                m(Column, { width: '1-3' }, 
                                    m(FormLabel, "Stage"),
                                    m(Select,
                                        { data: content, name: "stagenumber" },
                                        stagenumbers
                                    )
                                ),

                                content.type.match('meditation-practice|recording|video') ?
                                m(Column, { width: '1-4' },
                                    m(FormLabel, "Duration (MINUTES)"),
                                    m(TextField,
                                        {
                                            data: content, name: "duration", type: "number"
                                        }
                                    )
                                ) : null,
                                )
                            ), 
                                            
                        m("div",{style:"height:20px"}),
                    )
                )
            }
        }
    }

    function Texts(){
        
        let page = 0
    
        let pages = 1;

        function Slide() {

            let showingBasicInfo = true;
            
            return {
                view: (vnode) => {
                    let { data, item, name } = vnode.attrs
    
                    return m(Card, { size: "small" },
                        m(CardMedia,
                            data[name].image ? 
                            m("a.ui.red.label",{onclick:(e)=>data[name].image = ''},"Delete  image"):null,
                            
                            m(ImageSelector, {height:'200px',  data:data[name], name:'image', id:`#slide-images${name}`}),
                        ),
                        m(CardBody, { style: "padding:0px" },
                            m("ul.uk-tab",
                                m("li",{class: showingBasicInfo ? 'uk-active':'', onclick:(e) => showingBasicInfo =true},m("a","Text")),
                                m("li",{class: !showingBasicInfo ? 'uk-active':'', onclick:(e) => showingBasicInfo = false}, m("a","Help text"))
                            ),

                            showingBasicInfo ? 
                            m(TextEditor, { data: data[name], name: "text", type: "textarea", rows: 6}):   
                            m(TextEditor, {data:data[name], name:'help',rows:6}),
                            
                        ),
                        m(CardFooter,
                            m(Button,{
                                onclick:(e)=> {
                                    data.splice(name, 1)
                                    pages = Math.ceil(content.text.length / 3) || 1
                                    page=0
                                    console.log('p',pages,page)
                                }, size:'small'
                            },  m(Icon,{color:'red', icon:'delete'})),

                            m(Button, {
                                style:"margin-left:5px",
                                width:'1-3',
                                size:'small',
                                onclick: (e) => {
                                    if (name > 0) {
                                        let aux = data[name - 1]
                                        data[name - 1] = data[name]
                                        data[name] = aux
                                    }
                                }
                            }, m(Icon,{icon:'chevron_left'})),

                            m(Button, {
                                size:'small',
                                width:'1-3',
                                onclick: (e) => {
                                    if (name < data.length - 1) {
                                        let aux = data[name + 1]
                                        data[name + 1] = data[name]
                                        data[name] = aux
                                    }
                                }
                            }, m(Icon,{icon:'chevron_right'}))
                        )
                    )
                }
            }
        }

        return {
            oninit:(vnode)=>{
                // PARA UNIFICAR EL MODELO !!!
                if(content.content && !content.text){

                    if(!content.text){
                        content.text = []
                    }

                    Object.keys(content.content).map((key)=>{
                        content.text.push(content.content[key])
                    })
                }

                if(content.text && content.text.length){
                    pages = Math.ceil(content.text.length / 4)
                }
            },
            view:(vnode)=>{
                return [
                    m(Grid, [
                        m(Row,
                        m("div",{style:"display:flex;flex-direction:row; align-items:center; width:100%;"},
                            m(Button,{
                                style:"width:150px;margin-right:10px;",
                                type:'default',
                                onclick:(e)=>{
                                    if(!content.text){
                                        content.text = []
                                    }
                                    
                                    content.text.push({ 'text': 'Edit this text', 'image': "" })         
                                
                                    pages = Math.ceil(content.text.length / 3)
                                }
                            }, "Add slide"),   
                            m(FormLabel, {style:"margin-top:15px"},
                                content.type == 'lesson' ?
                                "Add slides to the lesson":
                                `Add Text before the ${content.type == 'recording' ? 'recording': content.type =='meditation-practice' ? 'meditation':'video'}. 
                                You can also add images inside the text`
                            ),
                        )),
                            
                        content.text ? [
                            // CAMBIAR ESTO POR NAVIGATION
                            pages > 1  ? m(Row, m("ul",{class:"uk-dotnav"},
                            Array.from(Array(pages).keys()).map((k,i)=>{
                                return m("li",
                                    {
                                        class: i == page ? 'uk-active':'',
                                        onclick:(e)=>{
                                            page = i 
                                        }
                                    },
                                    m("a",{})
                                )})
                            )):m(Row),

                            content.text.slice(page*4, (page*4)+4).map((key,i) => {
                                return m(Column, { width: '1-4' },
                                    m(Slide, { data: content.text, name: i })
                                )
                            })
                        ] : null  
                ])
                ]
            }
        }
    }

    function ArticleTexts(){
        return {
            view:(vnode)=>{
                return [
                    m(FormLabel, "Body"),
                    m(TextEditor,{
                        data:content,
                        name:'body',
                        rows: 20
                    })
                ]
            }
        }
    }

    return {
        oninit: (vnode) => {
            if(vnode.attrs.cod){
                getContentbycod(vnode.attrs.cod).then((res) => {
                    content = res;
                    m.redraw()
                })
            }else{
                isNew = true
                content = json
            }
            // ESTO YA NO HACE FALTA !!
            //getUsers().then((res) => {
              //  teachers = res.filter((user)=> user.role == 'teacher');
            //})
        },
        view: (vnode) => {
            return content.title || isNew ? [
                m(InfoText,{
                    subtitle:'Add and edit content inside the app. It can be a meditation practice, a lesson, a video, an article or a recording.',
                }),

                m(Container, {size:'large'},
                    m(Padding,{onlyTop:true},
                        m(Grid,{},
                            m(Column,{width:'1-6'},
                                m("ul.uk-tab-left",{'uk-tab':true, style:"min-height:50vh;"},
                                   // link that goes to basic info and changes the showing parameter
                                   m("li", {class:showing == basic_info ? 'uk-active' : '',  onclick:(e)=> {showing = basic_info}},m("a", "Basic info")),

                                    // link that goes to content and changes the showing parameter
                                    
                                    content.type =='article' ? 
                                    m("li", {
                                            class:showing == article_texts ? 'uk-active' : '', 
                                            onclick:(e)=> {showing = article_texts}
                                        },m("a", "Write article")
                                    )
                                    : [
                                    
                                    m("li", {class:showing == texts ? 'uk-active' : '', onclick:(e)=> {showing = texts}},m("a", "Write text")),


                                    
                                    content.type == 'lesson' ? null  :
                                    m("li", {class:showing == file ? 'uk-active' : '', onclick:(e)=> {showing = file}},m("a", "Add File")),
                                    ]
                                )
                            ),
                            m(Column,{width:'5-6'},
                                showing == basic_info ?
                                m(BasicInfo): 
                                showing == texts ? 
                                m(Texts):
                                showing == article_texts ?
                                m(ArticleTexts):
                                m(File)
                            ),
                            m("div",{style:"height:200px"}),
                        ),
                    )
                ),

                m(Section,{style:"position:fixed;bottom:0px;left:0px;right:0px;padding:2em;display:flex;justify-content:end; align-items:end;", type:'secondary'},
                    m(Button,{
                        type:'secondary',
                        style:"min-width:200px",
                        onclick:(e)=>{
                            if(isNew){
                                m.route.set('/content')
                            }else{
                                window.location.reload()
                            }
                        }
                    }, "Cancel"),

                    m(Button, {
                        style:"margin-right:20px;color:white;background-color:#1e87f0;margin-left:20px;min-width:200px;",
                    
                        type:"primary",
                        onclick: (e) => {

                            if(!content.title){
                                showAlert({title:'Title is required'})
                                return
                            }

                            if(!content.description){
                                showAlert({title:'Description is required'})
                                return
                            }

                            if(isNew){
                                content.cod = create_UUID();
                            
                                
                                if(json.stagenumber == 'none'){
                                    json.stagenumber = 'none'
                                }else{
                                    json.stagenumber = Number(json.stagenumber)
                                }



                                json.createdBy = user.codUser
                                
                                addContent(json);
                                document.getElementById('closemodalmed').click();
                                
                                m.route.set(`/editcontent/${json.cod}`)

                                json = {
                                    'cod': '',
                                    'title': '',
                                    'description': '',
                                    'image': '',
                                    'duration': 1,
                                    'stagenumber': 1,
                                    'type': 'meditation-practice'
                                }
                            }else{

                                updateContent(content); 
                            }
                        }
                    },
                    isNew ? "Create" : 'Save'),
                
                )
            ]  : null

            /*
            return content.title ?
                m(Padding,   
                m("article.uk-article",
                    m("h1.uk-article-title",
                        !editar ? content.title : m(TextField, { type: "input", data: content, name: "title" }),
                        !editar ? 
                        m("button.uk-button", {
                            style:"background-color:green; color:white",
                            'uk-icon': 'icon:file-edit', 
                            onclick: () => editar = !editar },
                            "Edit"
                        ) : [
                        user.role == 'admin' ?
                        m("button.uk-button",
                            {
                                style:"color:white;background-color:red;margin-top:15px;margin-right:20px;",  
                                onclick:(e)=>{
                                    if(confirm('You are going to delete. Are you sure?')){
                                        deleteContent(content)
                                        m.route.set('/management')
                                    }
                                }
                            },
                            "Delete"
                        ) : null,
                        m("button.uk-button.uk-button-secondary",
                            {
                                style: "margin-top:15px",
                                onclick: (e) => { 
                                    updateContent(content); editar = false; 
                                }
                        },"SAVE"),
                        m("button.uk-button.uk-button-default", {
                            style: "margin-top:15px",
                            onclick: (e) => { editar = false; location.reload() }
                        }, "CANCEL")
                        ]
                    ),
                    m("p.uk-article-meta", "Id:" + content.cod),
                    m(Grid,
                        {
                            size: "medium",
                            center: true
                        },
                        m(Column, { width: '1-4' },
                        !editar ? m(".uk-text-lead", content.description) : 
                        [
                            m(".uk-text-bold", "Description"),
                            m(TextField, { type: "input", data: content, name: "description", width: '1-2' })
                        ],
                        ),
                        content.path ? 
                        m(Column, { width: '1-4' },
                            m(".uk-text-bold", 'Path'),
                            m(".uk-text-bold", content.path.title)
                        ) :
                        [
                            m(Column, { width: '1-4' },
                                m(".uk-text-bold", 'Stage'),
                                m(Select, { 
                                    data: content, 
                                    name: 'stagenumber', 
                                    onchange: (e) => content.stagenumber = Number(e.target.value)
                                }, stages)
                            ),

                            m(Column, { width: '1-4' },
                                m(".uk-text-bold", '¿Is new Content?'),
                                m("div",{style:"height:20px"}),
                                m(TextField, { 
                                    type:'checkbox',
                                    data: content, 
                                    name: 'isNew'
                                }, stages)
                            )
                        ],

                        content.type != 'meditation-game' ? 
                        m(Column, { width: '1-4' },
                            m(".uk-text-bold", 'Type'),
                            m(Select, { data: content, name: 'type' }, types),
                            content.type == 'meditation-practice'  || content.type == 'recording' || content.type =='video' ? [ 
                                m(".uk-text-bold","Duration (minutes)"),
                                m(TextField,{type:'input',data:content,name:'duration'}),
                            ]: null,
                        ) : null,

                        content.type == 'meditation-practice' || content.type =='video' ? 
                        m(Column, { width: '1-4' },
                            m(".uk-text-bold", 'Created by'),
                            !editar ? m(".uk-text-bold",content.createdBy || 'no one'):
                            m(Select, { data: content, name: 'createdBy' }, 
                            teachers.map((teacher)=>{ return{'label':teacher.nombre,'value':teacher.coduser}})
                            ),
                        ):null,

                        
                        content.type != 'meditation-game' ? 
                        m(Row,
                            editar ? [
                                m("button.uk-button.uk-button-default", { onclick: () => { document.getElementById(`meditation-file-chooser`).click(); }}, 
                                uploading ?  m("div",{"uk-spinner":''}) :
                                content.file ? "CHANGE FILE": "ADD FILE"),
                                m(FileUploader, {
                                    data: {},
                                    path:content.path ? content.path.title : 'dynamicfiles',
                                    onupload:() => uploading = true,
                                    Dstage: content.stagenumber,
                                    name: "file",
                                    id: `meditation-file-chooser`,
                                    onsuccess: (src) => { 
                                        uploading = false;
                                        content.file = src;
                                        m.redraw(); 
                                    }
                                }),
                            ]: null,

                            content.file ?  m("div",m(FileView,{file:content.file,key:uploading ? 0 : 1,style: "width:50%;height:200px;"})) : null
                            
                        ): null,


                        m(Column, { width: "1-4" },
                            m(Card,
                                m(CardMedia,
                                    m("div",
                                        {
                                            'uk-toggle': `target:#text-images-slider`,
                                            style: "cursor:pointer"
                                        },
                                        content.image ? m("img", { src: content.image }) :
                                            m("div", { style: "min-height:200px;display:flex;justify-content:center" }, "Click to add an image")
                                    ),
                                    m(ImagePicker, { data: content, name: "image", id: `text-images-slider` })
                                ),
                                m(CardBody,
                                    m(".uk-text-bold", content.title.toUpperCase())
                                )
                            )
                        ),
                                    
                                                
                    )
                )
                 ) :
                null*/
        }
    }
}

function errorPageComponent() {

    return {
        view: () => {
            return m("h1", "Error")
        }
    }
}

function ContentView() {
    let content = {}

    return {
        oninit: (vnode) => {
            getContentbycod(vnode.attrs.cod).then((res) => {
                content = res;
                console.log(content)
                m.redraw()
            })
        },
        view: (vnode) => {
            return m(Grid,
                m(Column,
                    {
                        width: '1-2'
                    },
                    m("div", { style: "font-family:Gotham Rounded; font-size:2em" }, content.title),
                ),
                m(Column,
                    {
                        width: '1-2'
                    },
                    m("img", { style: "width:100%;height:auto", src: content.image })
                )
            )
        }
    }
}

// ESTO no necesita el USER
function ProfileView(){
    let user = {}
    let loaded = false
    
    let issues = []
    let suggestions = []
    let selectedrequest = {}
    let userfromselreq = {}

    let adding = ''

    let showing = 'data';

    let actions = new Array

    function UserData(){

        function DataCard(){
            return {
                view:(vnode) => {
                    let {header,number,sentence,icon} = vnode.attrs
                    
                    return m(Card,
                        m(CardBody, 
                            m(Grid,
                                m(Row,
                                    m("span",{
                                        style: `font-family: system-ui;
                                        font-size: 19px;
                                        font-style: normal;
                                        font-weight: 700;
                                        line-height: 35px;
                                        letter-spacing: 0em;
                                        text-align: left;
                                        `}, header.toUpperCase()),
                                ),
                                m(Column, {width:'2-3'},
                                    icon ?
                                    m("i",
                                        {
                                            style:"font-size:40px",
                                            class: 'material-icons'
                                        },
                                        icon
                                    ) :
                                    m("span",{
                                        style:"color:grey"
                                    }, sentence)
                                ),
                                m(Column,{width:'1-3'},
                                    m("div",{
                                        style:`
                                        font-family: system-ui;
                                        font-size: 50px;
                                        font-style: normal;
                                        font-weight: 700;
                                        line-height: 52px;
                                        letter-spacing: 0em;
                                        text-align: right;
                                    `}, number)   
                                )
                            )
                        )
                    )
                }
            }
        }

        return {
            view:(vnode) => {
               return [ 
                   m(Column, {width:'1-2'},
                        m(DataCard,{header:'stage', icon:'hiking', number: user.stage.stagenumber})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Meditations completed', icon: "self_improvement",number: user.stats.total.meditaciones})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Lessons read', icon: "book",number: user.stats.total.lecciones})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Time meditated', icon: "timer",number: Math.floor(user.stats.total.tiempo / 60) + 'h'})
                    )
            ]
           }
        }


    }

    //Lista de sugestiones y de issues
    function ListOfRequests(){

        return {
            view:(vnode) => {
                let {elements,issue} = vnode.attrs

                return elements.map((request)  => {
                        if(!request.votes){
                            request.votes = {}
                        }
                        return m(Column, {width:'1-1'},
                            m(Card,
                                {
                                    hover: true,
                                    style:"cursor:pointer",
                                    onclick:(e) => {
                                        selectedrequest = request
                                    }
                                },
                                m(CardBody,  
                                    m(Grid,
                                        m(Column, {
                                            width:'3-4'
                                        },
                                            m("span",{style:"font-size:1.1em;font-weight:bold;"},request.title)
                                        ),
                                        m(Column,{
                                            width:'1-4'
                                        },  
                                            m("span",
                                                m("span",{class:"material-icons"},"person"),
                                                m("span", request.username)
                                            ),
                                        )
                                    ),
                                    m("div", 
                                        {
                                            style:"position:absolute;top:0px;right:0px;padding:3.5px"
                                        },
                                        m("span",
                                                m("a",{
                                                    class:"material-icons",
                                                    style:`color:red;${request.votes[user.coduser] == -1 ? 'opacity:1;': 'opacity:0.5;'}`, 
                                                    onclick:(e) => {
                                                        if(!request.votes[user.coduser] && request.points){
                                                            request.votes[user.coduser] = -1
                                                            request.points--;
                                                        }
                                                        //si has votado positivamente
                                                        else if(request.votes[user.coduser] == 1 && request.points){
                                                            request.points--;
                                                            if(request.points){
                                                                request.points--;
                                                                request.votes[user.coduser] = -1
                                                            }else {
                                                                delete request.votes[user.coduser]
                                                            }
                                                        }
                                                        // si has votado negativamente se te quita
                                                        else if(request.votes[user.coduser] == -1){
                                                            request.points++;
                                                            delete request.votes[user.coduser]
                                                        }
                                                
                                                        updateRequest(request)
                                                    }
                                                },"arrow_downward"),
                                        ),
                                        m("span",
                                            m("a",{
                                                class:"material-icons",
                                                style:`color:green;${request.votes[user.coduser] == 1 ? 'opacity:1;': 'opacity:0.5;'}`, 

                                                onclick:(e) => {
                                                    if(!request.votes[user.coduser]){
                                                        if(!request.points){request.points = 0}
                                                        request.votes[user.coduser] = 1
                                                        request.points++;
                                                    }else if(request.votes[user.coduser] == 1){
                                                        request.points --;
                                                        delete request.votes[user.coduser]
                                                    }else if(request.votes[user.coduser] == -1){
                                                       request.points += 2
                                                       request.votes[user.coduser] = 1
                                                    }

                                                    updateRequest(request)

                                                } 
                                            },"arrow_upward"),
                                        ),

                                        m("span", {style:"font-size:1.1em"},
                                            request.points || 0
                                        )
                                    )

                                )   
                            )
                        )
                    })
            }
        }
    }

    function ModalRequest(){
        let data = {}
        return {
            view:(vnode) => {
                return m(Modal,
                    {
                        center: true,
                        id: 'modal-request'
                    },
                    m(ModalHeader,
                        "Add " +  adding
                    ),
                    m(ModalBody,
                        m(Form,
                            m(FormLabel,
                                "Title"
                            ),
                            m(TextField, { data: data, name: "title", type: "input" }),
                            
                            m(FormLabel,
                                "Description"
                            ),
                            m(TextField, { data: data, name: "description", type: "textarea", rows:'4'}),
                        )
                    ),
                    m(ModalFooter,
                        m(Button, { 
                            style: "float:right", 
                            onclick:(e) => {
                                if(confirm('You are going to post a request to the server. Are you sure?')){
                                    data.type = adding
                                    data.cod = create_UUID()
                                    data.state = 'open'
                                    data.coduser = user.coduser
                                    data.username = user.nombre
                                    data.points = 0
                                    postRequest(data)
                                }
                            }
                         }, "Send")
                    )
                )
            }
        }


    }

    function ViewRequest(){
        let startedcomment = false;
        let data = {}

        return {
            view:(vnode)=> {
                return m(Section,
                    {
                        type:'muted',
                        style:"position:relative"
                    },
                    m(Padding,
                        m("h3", 
                            selectedrequest.title,
                            m("span",{style:"font-size:0.9em;color:lightgrey"},  '  by  ' + selectedrequest.username)
                        ),
                        m(Grid,
                            m(Column,{width:'1-1'},
                                m("div", selectedrequest.description)
                                )
                            ),
                             
                            m(Column,{width:'1-1'},
                                m(TextField, {
                                    data:data,
                                    type:"textarea",
                                    rows:'4',
                                    placeholder:'Tell us what you think',  
                                    style:"margin-top:20px",                                  
                                    name:'comment',
                                })
                            ),

                            m(Column, {width:'1-3'},
                                m(Button, 
                                    {
                                        style:"background-color:blue;margin-top:5px;color:white;",
                                        onclick:(e)=> {
                                            if(data.comment){
                                                if(!selectedrequest.comments){
                                                    selectedrequest.comments = []
                                                }
                                                selectedrequest.comments.push({
                                                    'comment':data.comment,
                                                    'username':user.nombre,
                                                    'date':new Date(),
                                                    'coduser':user.coduser
                                                })
                                                data.comment = ''
                                                updateRequest(selectedrequest)
                                            }
                                        }
                                    },
                                    "Comentar"
                                )
                            ),
                            
                            selectedrequest.comments && selectedrequest.comments.map((comment)=> {
                                return m(Column,{width:'1-1'},
                                    m(Card,{style:"margin-top:10px"},
                                        m(CardBody, 
                                            comment.comment, 
                                            m("span",{style:"color:grey;font-size:1.1em"}, 'by ' + comment.username),
                                            
                                            m("span",{style:"position:absolute;top:5px;right:5px"}, )
                                        )    
                                    )
                                )
                            })
                        ),
                        m(".material-icons",
                        {
                            style:"position:absolute;top:10px;right:10px;font-size:25px;cursor:pointer", 
                            onclick:(e) => selectedrequest = {}
                        }, "close")
                )
            }
        }
    }

    function Meditations(){
        let showing


        return {
            view:(vnode)=>{
                return m(".ui.list",
                    user.meditations.sort((a,b)=> new Date(a.day)- new Date(b.day)).map((med,i)=>{
                        console.log(new  Date(med.day))
                        return m(".item",   
                            m(".content",
                                m(".description", dia(med.day) + ' ' + hora(med.day) + '  duration: ' +  med.duration)
                            )
                        )
                    }),

                    m("h2.ui.header","Actions"),
                    actions.sort((a,b)=> new Date(a.time) - new Date(b.time)).map((action)=>{
                        let a = new UserAction(action);
                        return m(".item",
                            m(".content",
                                m(".header",a.message),
                                m(".description", dia(a.time) + '  ' + hora(a.time))
                            )
                        )
                    })
                )
            }
        }
    }

    return {
        oninit:(vnode) => {
            // SOLO S I NO SE HA CARGADO EL USER !!!
            // ESTO NO HACE FALTA
            getUser(vnode.attrs.cod).then((usr) => {
                user = usr
                console.log(user)
                loaded = true
                m.redraw()
            })

            getRequests().then((res) => {
                issues = res.filter((item)  => item.type =='issue')
                suggestions = res.filter((item) => item.type =='suggestion')
            })

            getUserActions(vnode.attrs.cod).then((res)=>{
                console.log(res)
                actions = res;
                /*
                res.map((action)=>{
                    actions.push(new UserAction(action))
                })*/
            })


        },
        view:(vnode) => {
            return  m(Padding,
            loaded ? m(Grid, {
                size:'large',   
                },
                m(Column, {width:'1-3'},
                    m("img", {src:user.image, style:"width:100%;height:auto"}),
                    m(Button,
                        {
                        type:"secondary", 
                        style:"width:100%;margin:10px auto", 
                        target: '#modal-request', 
                        onclick:(e) => adding = 'issue'
                        },
                        "ADD ISSUE"
                    ),
                    m(Button,
                        {
                        type:"secondary", 
                        style:"width:100%;margin:10px auto", 
                        target: '#modal-request', 
                        onclick:(e) => adding = 'suggestion'
                        },
                        "ADD SUGGESTION"
                    ),
                    m(ModalRequest),
                    m(Button, {type:"danger",style:"width:100%;margin:10px auto", onclick:(e)=>{localStorage.removeItem('meditationcod');user ={};m.route.set('/');}}, "LOG OUT")
                ),

                selectedrequest.cod ? 
                m(Column,{width:'2-3'},
                    m(ViewRequest)
                )
                :
                m(Column,{width: '2-3'},
                    m(Grid,
                        m(Row,
                            m(".ui.secondary.pointing.menu",
                                m("a.item",
                                    {
                                        onclick:(e)=> {
                                            showing = 'data'
                                        },
                                        class: showing == 'data' ? 'active': '',
                                    },
                                    "User Data"
                                ),
                                m("a.item",
                                {
                                    onclick:(e)=> {
                                        showing = 'meditations'
                                    },
                                    class: showing == 'meditations' ? 'active': '',
                                },
                                "Meditations and actions"
                                ),
                                /*
                                m("a.item",
                                    {
                                        onclick:(e)=> {
                                            showing ='issues'
                                        },
                                        class: showing == 'issues' ? 'active':'',
                                    },
                                    "Issues"
                                ),
                                m("a.item",
                                    {
                                        onclick:(e)=> {
                                            showing ='suggestions'
                                        },
                                        class: showing == 'suggestions' ? 'active':'',
                                    },
                                    "Suggestions"
                                )*/
                            ),    
                        ),
                        showing == 'data' ? 
                        m(UserData) :
                        showing == 'meditations' ? 
                        m(Meditations):
                        showing == 'issues' ?
                        m(ListOfRequests, {issue: true, elements: issues})
                        : 
                        m(ListOfRequests, {issue: false, elements: suggestions})

                    )
                )
            ): null
            ) 
        }
    }
}

function TeacherManagement(){
    let content = []

    let itemcount = 0;
    let loaded = false;

    let usr= {}

    let state = {
        profile:0,
        students:1,
        content:2,
        messages:3,
        courses:4,
    }

    let icons = {
        profile:m("i.user.icon"),
        students: m("i.group.icon"),
        content:m("i.book.icon"),
        courses: m("i.leanpub.icon"),
        messages:m("i.envelope.icon")
    }

    let texts = {
        0:'Here you can edit your personal information',
        1:'See who is enrolled to your courses and send messages to them',
        2:'Check statistics from your added content and edit or create it',
        3: 'Send and view the messages sent to yourself',
        4: 'Create, view and check your courses.'
    }

    let showing = state.profile

    let chats = []
    let stats = {}
    let loadedMessages = false;

    function Chat(){
        return {
            view:(vnode)=>{

            }
        }
    }

    function MyProfile(){
        let isEditing = false


        function EditableField(){


            return {
                view:(vnode)=>{
                    let {data,name,type} = vnode.attrs

                    return [
                        isEditing ? m(TextField,{data:data,name:name,type:type}): data[name]
                    ]
                }
            }
        }

        return {
            view:(vnode)=>{
                return [
                       m(Grid,{center:true, verticalalign:true},
                            m(Column,{width:'1-5'},
                                m("label",{style:"font-weight:bold"},"User image"),
                                m("img",{src:user.image,style:"width:100%;height:auto"}),
                            ),
                            m(Column,{width:'4-5'}, 
                                m(".ui.form",
                                    m(".inline.field",
                                        m("label",{style:"margin-right:10px"}, "Name "),
                                        m(EditableField,{data:user,name:'nombre'})
                                    ),
                                    m(".field",
                                        m("label", "Description "),
                                        m(EditableField,{data:user,name:'description',type:"textarea"})
                                    ),
                                    m(".three.fields",

                                        m(".field",
                                            m("label", "Location" , m(Icon,{icon:'location_on'})),

                                            m(EditableField,{data:user,name:'location'})
                                        ),

                                        m(".field",
                                            m("label", "Website" , m(Icon,{icon:'language'})),
                                            m(EditableField,{data:user,name:'website'})
                                        ),
                                        m(".field",
                                            m("label", "Teaching hours" , m(Icon,{icon:'calendar_month'})),
                                            m(EditableField,{data:user,name:'teachinghours'})
                                        ),
                                    )
                                )
                                /*
                                m(Grid,
                                    m(Column,{width:'1-5'},m(Icon,{icon:'location_on'}), user.location),
                                    m(Column,{width:'2-5'},m(Icon,{icon:'language'}),m("a",{href:user.website,target:'_blank'},user.website)),
                                    m(Column,{width:'1-5'},m(Icon,{icon:'calendar_month'}),user.teachinghours),
                                )] : 
                                m(Grid,
                                    m(Column,{width:'1-3'}, m(TextField,{data:user,name:'nombre'})),
                                   
                                    m(Row,m(TextField,{data:user,name:'description'})),
                                    m(Column,{width:'1-5'},m(Icon,{icon:'location_on'}), ),
                                    m(Column,{width:'2-5'},m(Icon,{icon:'language'}), m(TextField,{data:user,name:'website'})),
                                    m(Column,{width:'2-5'},m(Icon,{icon:'calendar_month'}),m(TextField,{data:user,name:'teachinghours'})),
                                )*/
                            )

                    ),
                    
                    m("div",{style:"height:20px;"}),
                    m(Button,{type:"secondary",onclick:(e)=> isEditing = !isEditing}, !isEditing ? "Edit data" : 'Cancel'),

                    isEditing ? 
                    m(Button,{
                        type:"primary",
                        style:"margin-left:30px;", 
                        onclick:(e)=> {
                            isEditing = false; 
                            updateUser({'coduser':user.coduser,'nombre':user.nombre,
                                'description':user.description,'location':user.location,
                                'website':user.website,'teachinghours':user.teachinghours
                            }) 
                        }
                    },"Save data"):null
                ]
            }
        }
    }

    function MyCourses(){
        
        function Course(){
            let isEditing = false;
            let  c;


            function EditableField(){
                
                return {
                    view:(vnode)=>{
                        let {data,name,type} = vnode.attrs
    
                        return [
                            isEditing ? m(TextField,{data:data,name:name,type:type}): m.trust(data[name])
                        ]
                    }
                }
    
            }

            return {
                oninit:(vnode)=>{


                },
                view:(vnode)=>{
                    let c = new CourseEntity(vnode.attrs.course)

                    return  m(".uk-card.uk-card-default.uk-card-body",
                        m(".uk-card-title", m(EditableField,{data:c,name:'title'})),
                        
                        m(".ui.form",
                        
                        ),
                        
                        m(Grid,
                            m(Row, m(EditableField,{data:c,name:'description',type:"textarea"})),
                            m(Column,{width:'1-2'},
                                m(Button,{type:'primary', onclick:(e)=> m.route.set(`/editcourse/${c.cod}`)}, "Edit course")
                            )
                            /*m(".ui.form",
                                m(".ui.two.fields",
                                    c.getFields().map((field)=>{
                                         return m(".field", m(EditableField,{data:c,name:field.name,type:"textarea"})  )
                                    })
                                )
                            )*/
                        )
                    )
                }
            }
        }
        
        
        return {
            view:(vnode)=>{
                return [
                    user.addedcourses ? 
                    m(Grid, user.addedcourses.map((course)=>{
                        return m(Column,{width:'1-2'}, m(Course,{course:course}))}
                    )) 
                    :  m("p", "You have not added any course. You can add one pressing at the button below"),

                    m("div",{style:"height:20px"}),

                    m("p", "Press the button below to add a course into the application"),
                    m(AddCourse,{coduser:user.coduser})
                ]
            }
        }
    }

    // FALTARÍA SACAR EL CHAT Y ENVIAR MENSAJES EN EL CHAT
    function MyMessages(){
        return {
            view:(vnode)=>{
                console.log('chats',chats)
                
                return m(Section,{type:'default'},
                m("h3", "My messages"),

                
                !loadedMessages ? m(".ui.active.inline.loader") :
                    chats.length ?
                    m(".ui.list",
                        chats.map((chat)=>{
                            console.log('CHAT',chat.users[user.coduser])
                             return Object.keys(chat.users).map((cod)=>{
                                if(cod != user.coduser){
                                    let user = chat.users[cod]
                                    return m(".item",
                                        m("img.ui.avatar.image",{src:user.userimage}),
                                        m(".content",
                                            m(".header", user.nombre),
                                            m(".description", )
                                        ),
                                        m(".extra",
                                            m(".ui.label",(chat.users[user.coduser].unreadmessages ? chat.users[user.coduser].unreadmessages.length : '0') + ' unread messages')
                                        )
                                    )
                                }
                             })
                        })                   
                    ):m(DefaultText, "No messages at the moment")

                    /*
                    m(Grid,Object.keys(requests).map((key)=>{
                        if(requests[key].user && requests[key].messages && requests[key].messages.length){
                        return m(Column,{width:'1-4'},m(Card,
                            m(CardHeader,requests[key].user.nombre),
                            m(CardBody,requests[key].messages[0].text)
                        ))
                        }
                    }))*/
                )
            }
        }
    }

    function MyContent(){
        return{
            view:(vnode)=>{
                return [
                    m(Section,{type:"default"},
                        m("h3","Content stats"),
                        Object.keys(stats).length > 0 ?
                        m("dl",Object.keys(stats).map((title)=>{
                            return [
                                m("dt",title),
                                m("dd", "Reproduced for " + stats[title].timeDone  + " minutes by " + (stats[title].people) +' people ')
                            ]
                        })): m("p"," At the moment no content has been reproduced")
                    ),

                    m(Section,{style:"width:100%;padding-left:10px;padding-right:10px"},
                        m("div",{style:"display:flex;flex-direction:row;justify-content:space-between"},
                            m("h3","Added content"),
                            m("ul",{class:"uk-pagination"},
                                m("li",m("a",{onclick:(e)=> itemcount > 0 ? itemcount -=4 : null},m("span",{'uk-pagination-previous':true,'ratio':1.5}))),
                                m("li",{style:"font-size:1.2em;align-items: center;display: flex;"}, itemcount+1 + '-' + (itemcount+4) + ` (${content.length} total)`),
                                m("li",m("a",{onclick:(e)=> content[itemcount+4] != null ? itemcount+=4 : null,}, m("span",{'uk-pagination-next':true,'ratio':1.5}), ))
                            )
                        ),
                        m(Grid,{match:true},
                            content.sort((a,b)=>{
                                if(a.position == null  &&  b.position == null){
                                    return 0
                                }else if(a.position == null){
                                    return 1
                                }else  if(b.position == null){
                                    return -1
                                }else{
                                    return a.position - b.position
                                }
                            }).slice(itemcount,itemcount+4).map((content)=>{
                                return m(Column,{width:'1-4'},
                                    m(ContentCard,{content:content})
                                )
                            })
                        ),

                        m(".uk-text-bold", "Add more content"),
                        m(AddContent,{coduser:user.coduser,isTeacher:true, courses:user.addedcourses || []}),
                    )
                ]
            }
        }
    }

    function MyStudents(){
        return {
            view:(vnode)=>{
                return [
                    user && user.students && user.students.length  ?
                    m(".ui.selection.list",user.students.map((std)=>{
                        return m(".item",

                            m("img.ui.avatar.image",{src:std.image}),
                            m(".content",
                                m(".header", std.nombre)
                            )
                        )
                    })): m(DefaultText,"You have no students at the moment")
                
                ]
            }
        }
    }

    return {
        oninit:(vnode)=>{
            //  HAGO DOS VECES EL CONNECT !!!
            // Se PODRÍA SACAR SOLO EL CONTENT DEL USUARIO !!!
            getAllContent().then((res)=>{
                content = res.filter((r)=> r.createdBy && (r.createdBy == user.coduser || r.createdBy == vnode.attrs.coduser))

                // un poco rudimentario :(
                content.map((c)=>{
                    getStats(c).then((res)=>{
                        if(res.people || res.timeDone){
                            stats[c.title] = res;
                            console.log(res)
                            m.redraw();
                        }
                    })
                });

                m.redraw()
            })

            // utilizar siempre vnode.attrs !!!
            getUserMessages(vnode.attrs.coduser ? vnode.attrs.coduser : user.coduser ? user.coduser : localStorage.getItem('meditationcod')).then((messages)=>{
                chats = messages 
                loadedMessages = true
                m.redraw()
            })
        },
        view:(vnode)=>{
            return m(".ui.segment",{style:"margin-top:20px;padding:0px;min-height:80vh"}, 
                m(Grid,{columngap:'collapse',center:true,style:"height:100%;",verticalalign:true},
                    m(Column,{width:'1-5'},
                        m(".ui.vertical.sidebar.menu.left.overlay.visible",{style:"position:relative;height:100%;"},
                            user.image ? [
                                m("div",{style:"height:20px"}),
                                m("img.ui.big.circular.image",{style:"object-fit:cover;max-width:50%;margin:0 auto;height:80px;width:80px;border-radius:50%;",src:user.image}),
                                m("h3.ui.centered.header", user.nombre)
                            ]
                            : 
                            m("div",{style:"height:100px"}),

                            // HACER UN ARRAY
                            Object.keys(state).map((key)=>{
                                return m("a.item",
                                    {
                                        class:  showing == state[key] ? 'active':'',
                                
                                        onclick:(e)=>{ showing = state[key]}
                                    },
                                    icons[key],
                                    'My '+ key
                                )
                            }),
                        )
                    ),

                    m(Column,{width:'4-5'},
                        m(Padding,
                            
                           

                            !user || !user.coduser ? m("div",m(".ui.active.centered.inline.loader",{style:"margin-top:50px"})) : [
                                
                                m(".ui.top.attached.segment",
                                    m("h3", 'My  ' + Object.keys(state)[showing]),
                                    m("h3.ui.grey.small.header", texts[showing]),
                                ),
                                m(".ui.bottom.attached.segment",
                                    showing == state.profile ? m(MyProfile):
                                    showing == state.courses ? m(MyCourses):
                                    showing == state.students ? m(MyStudents) :
                                    showing == state.messages ? m(MyMessages) :
                                    showing == state.content ? m(MyContent) : null
                                )
                            ]
                        )
                    ),
                    /*
                    m(Column,{width:'1-5'},
                    m(Row,
                        
                    ),

                    m(Row,
                       
                    ),

                    m(Column,{width:'1-2'},
                        m(".uk-text-bold", "Showing"),
                        m(".uk-button-group",{style:"width:100%"},
                            m(Button,{type:showing == state.messages ? 'primary':'',key:showing,  onclick:(e)=> showing = state.messages}, "Messages"),
                            m(Button,{type:showing == state.students ? 'primary':'',key:showing,  onclick:(e)=> showing = state.students}, "Students"),
                            m(Button,{type:showing == state.content ? 'primary':'',key:showing, onclick:(e)=> showing = state.content}, "Content"),
                            m(Button,{type:showing == state.courses ? 'primary':'',key:showing, onclick:(e)=> showing = state.courses}, "Courses")
                        )
                    ),

                    m(Column,{width:'1-2'},
                        m(".uk-text-bold", "Create"),
                        
                    ),
                    
                    m(Row,
                        showing == state.students ?
                        :
                        showing == state.content ? [
                            
                        )]: 
                        showing == state.courses ? 
                        m(Section,
                            m("h3","My Courses"),
                            m("p", "You have created " + user.addedcourses.length +  ' course' + (user.addedcourses.length > 1 ?'s':'')),
                            m(Grid,
                                user.addedcourses.map((course)=>{
                                   
                                })
                            )    
                        ):
                        
                    )
                    
                    ),
                    */
                )
            )
        }
    }
}


function MyContent(){
    let content = []
    let loadedContent = false;
    let selectedContent = {}


    
    return{
        oninit:(vnode)=>{
            getTeachersContent(localStorage.getItem('meditationcod')).then((res)=>{
                content = res.sort((a,b)=>!a.position ? 1 : !b.position ? -1 : a.position -b.position)
                loadedContent = true;
                m.redraw()
                console.log(content)
            })
        },
        view:(vnode)=>{
            return [
                m(InfoText,{
                    title:'My content',
                    subtitle:'Here you can create, and add content inside the Ten stages of the application. You can create articles, videos, lessons and meditations.',
                    video:'how-to-add-content'
                }),

                m("div",{style:"height:20px"}),

                loadedContent ?
                m(Container,{size:'large'},
                    m(Header3, 'My content'),
                    
                    m(Button,
                        {
                            onclick:(e)=>{
                                m.route.set(`/edit_create`)
                            },
                            'target': '#modal-content',
                            type: 'primary'
                        },
                        'Add Content' 
                    ),  
                    m("div",{style:"height:10px"}),
                    

                    m(Grid,{match:true},
                        content.map((item)=>{
                            return m(Column,{width:'1-3'},
                                m(ContentCard,{
                                    content:item
                                })
                            )
                        })
                    )
                ): null
            ]
        }
    }
}

function MyMessages(){
    return{
        view:(vnode)=>{
            return [
                
            ]
        }
    }
}

function FileExplorerPage(){
    return {
        view:(vnode)=>{
            return [
                m(InfoText,{
                    title:'File Explorer',
                    subtitle:'Here you can upload and manage your files. You can upload images, videos, audios and documents.',
                }),

                m("div",{style:"height:20px"}),

                m(Container,{size:'large'},
                    m(FileExplorer)

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
                m(InfoText,{
                    title:'Settings',
                    description:'Edit the text settings for the app'
                }),

                m(Container,{size:'large'},
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
                )
            ]
        }
    }
}   

export { EditCourse, ManagementMain, ContentManagement, EditCreateContent, SettingsPage, ContentView, ProfileView, TeacherManagement, MyContent, MyMessages, FileExplorerPage }

