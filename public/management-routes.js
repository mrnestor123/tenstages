import { Button, Container } from "./components/components.js"
import { ContentManagement, ContentView, EditCreateContent, ManagementMain, ProfileView, TeacherManagement,MyContent, MyMessages, FileExplorerPage} from "./management.js"
import { isLoggedIn, user } from "./models.js"


// FALTA AÑADIR LA PÁGINA DE LOGIN



m.route(document.body, "/", {   
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ManagementMain)
        },
    },

    '/management': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ContentManagement)
        }
    },

    "/edit_create": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditCreateContent)
        },
    },

    '/contentview/:cod': {
        render: (vnode) => {
            return m(Layout, vnode.attrs, ContentView)
        }
    },

    '/profile/:cod' :{
        render: (vnode) => {
            return m(Layout, vnode.attrs, ProfileView)
        }
    },

    '/teacher-management':{
        render: (vnode) => {
            return m(Layout, vnode.attrs, TeacherManagement)
        }
    },

    '/editcourse/:cod':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, EditCreateContent)
        }
    },

    '/content':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, MyContent)
        }
    },

    '/messages':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, MyMessages)
        }
    },

    "/documents": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, FileExplorerPage)
        },
    },
})


function Layout(){

    let route = '/'

    let routes  = [{
        'name':'Home',
        'route':'/',
    },
    // ESTAS RUTAS SOLO SE AÑADIRÁN CUANDO HAYA TEACHER
    {
        'name':'My Content',
        'route':'/content',
    },
    {
        'name':'My messages',
        'route':'/messages',
    },
    {
        'name':'My Courses',
        'route':'/courses',
    },
    {
        'name':'Files',
        'route': '/documents'
    },
    {
        'name':'Content management',
        'route':'/management',
    },
    {
        'name': 'Send  email',
        'route': '/send-email'
    }]

    let checkIfLogged = false;

    return {
        oninit:(vnode)=>{
            route = m.route.get()
        
            isLoggedIn().then((res)=>{
                checkIfLogged = true
                console.log('logged in ',user)
                m.redraw()
            })
        },
        view:(vnode)=> {
            console.log('loggeed in', user)
            return [
                m("nav.uk-navbar-container", { 'uk-navbar': '' , style:"background-color:white"},
                    m("nav", { 'uk-navbar': '', style: "width:100%" },
                        m(".uk-navbar-left",
                            m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages.png', style: "max-height:100px;width:auto" })),
                            m("ul.uk-navbar-nav",
                                routes.map((item)=>{
                                    return m("li",{
                                        style:"font-size:1.4em"
                                    },
                                        m("a",{
                                            style: route == item.route ? 'color:black;' : 'color:#ababab',
                                            onclick:(e)=>{
                                                route = item.route
                                                m.route.set(item.route)
                                            }
                                        }, item.name)
                                    )
                                })
                            )
                        ),
                        m(".uk-navbar-right",
                            m(".uk-navbar-item",
                                localStorage.getItem('meditationcod') ?
                                m("a.material-icons",
                                    {
                                        onclick:(e) => {
                                            m.route.set(`/profile/${localStorage.getItem('meditationcod')}`)
                                        }
                                    },
                                    'person'
                                )
                                :
                                m(Button,
                                    {
                                        type: "secondary",
                                        target: '#login-modal'
                                    },
                                    "LOGIN"
                                ),
                            )
                        )
                    )
                ),
               // !user.codUser ? 
               // m("div","YOU NEED TO BE LOGGED TO VIEW THIS CONTENT") :
                vnode.children.map((child) => {
                    return m("main",
                         m(child, vnode.attrs)
                    )
                })
            ]
        }
    }
}