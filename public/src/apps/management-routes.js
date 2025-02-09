import { Button, Column, Flex, Grid, Icon, Padding } from "../components/components.js"
import { LoginPage } from "../components/tenstages-components.js"
import { maincolor } from "../configuration.js"
import { isLoggedIn, User } from "../server/usersController.js"
import { ActionsPage, AdminManagement, EmailTool, ExplorePage, SettingsPage, StagesManagement } from "./management-admin.js"
import { ContentView, EditCreateContent, FileExplorerPage,  Milestones,  ProfileView } from "./management.js"


m.route(document.body, "/", {   
    // SI ESTÁ LOGUEADO SALE LA PÁGINA DE LOGIN !!!
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ContentView)
        },
    },

    "/edit_create": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditCreateContent)
        },
    },

    '/settings': {
        render: function (vnode){
            return m(Layout, vnode.attrs, SettingsPage)
        }
    },

    '/profile/:cod' :{
        render: (vnode) => {
            return m(Layout, vnode.attrs, ProfileView)
        }
    },

   
    '/editcourse/:cod':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, EditCreateContent)
        }
    },

    '/content':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, ContentView)
        }
    },
    
    "/documents": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, FileExplorerPage)
        },
    },

    "/actions": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ActionsPage)
        },
    },

    "/admin": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, AdminManagement)
        }
    },

    '/milestones':{
        render: function (vnode) {
            return m(Layout, vnode.attrs, Milestones)
        }
    },

    '/explore':{
        render: function (vnode) {
            return m(Layout, vnode.attrs, ExplorePage)
        }
    },
    
    '/email':{
        render: function (vnode) {
            return m(Layout, vnode.attrs, EmailTool)
        }
    },

    '/stages':{
        render: function (vnode) {
            console.log('STAGES')
            return m(Layout, vnode.attrs, StagesManagement)
        }
    }
})


function Layout(){

    //  HABRÁ QUE SACARLA EN  EL ONINIT
    let route;

    let teacherRoutes = [
        {
            'name':'Content',
            'icon':'book',
            'route':'/content'
        },
        /*
        {
            'name':'My courses',
            'icon':'school',
            'route':'/courses'
        },*/
        {
            'name':'File Explorer',
            'icon':'folder',
            'route': '/documents'
        }
    ]

    let managementRoutes = [
        {
            'name':'Users',
            'route':'/management',
            'icon':'people'
        },
        {
            'name': 'Email',
            'icon':'email',
            'route': '/email'
        },
        {
            'name':'Content',
            'icon':'book',
            'route':'/content'
        },
        {
            'name': 'Stages',
            'route': '/stages',
            'icon':'landscape'
        },
        {
            'name': 'Milestones',
            'route': '/milestones',
            'icon':'star'
        },

        {
            'name':'User actions',
            'icon':'history',
            'route':'/actions'
        },
        {
            'name':'Settings',
            'icon':'settings',
            'route': '/settings'
        }
    ]

    let role; 

    function Sidebar() {
        return {
            view: (vnode) => {
                return [
                    m(Flex, {direction:"column", style:`border-right:3px solid ${maincolor};height:100vh;position:fixed;min-width:200px;background:white`,  vAlign:'middle'}, [

                        //m("div",{style:"font-weight:bold;font-size:1.3em;margin-top:2em;"},"TenStages"),

                        m("img.uk-border-circle", {width:"100", height:"100", src:"./assets/logo-tenstages.png", alt:"Avatar"}),
                        // CREO QUE GRID, CENTER:TRUE
                        m("div.uk-grid-small uk-flex-middle", {"uk-grid":"", style:"padding:20px"}, [
                            
                            m("div.uk-width-expand", [
                                m("h3.uk-card-title.uk-margin-remove-bottom", User.nombre ),
                                m("p.uk-text-meta.uk-margin-remove-top",User.isAdmin() ? "Admin" : "Teacher")
                            ])
                        ]),

                        (User.isAdmin() ? managementRoutes : teacherRoutes).map((item)=>{
                            
                            let isSelected = route.route == item.route

                            return m(Button,{
                                onclick:(e)=>{
                                    route = item

                                    m.route.set(item.route)
                                },
                                style:`background-color:white;margin-bottom:10px;width:90%;color:${isSelected ? '#d8bb78' : 'black'};display:flex;align-items:center;justify-content:space-between`,
                            }, 
                                m(Icon,{icon:item.icon,  color: isSelected ? '#d8bb78' : 'black' }),
                                m("div",{style:"width:10px"}),
                                item.name
                            )
                        }),

                        m(Button,{
                            type:'secondary',
                            style:"position:absolute;bottom:20px;right:5px;left:5px;",
                            onclick:(e)=>{
                                localStorage.removeItem('meditationcod')
                                location.reload()
                            }
                        }, "LOG OUT")
                    ])
                ]
            }
        }
    }

    function NavBar() {
        return {
            view: (vnode) => {
                return [
                        m("nav.uk-navbar-container", { 'uk-navbar': '', style:"height:60px;background-color: white" },
                            m("nav", { 'uk-navbar': '', style: "width:100%;background-color:#f2f2f2" },
                                m(".uk-navbar-center",
                                    m("a.uk-navbar-item.uk-logo", {style:"min-height:0px!important"},
                                        m("img", { src: './assets/logo-horizontal.png', style: "height:55px; width:auto" })
                                    ),
                                )
                            )
                        )

                ]
            }
        }
    }

    return {
        oninit:(vnode)=>{

            route = teacherRoutes.concat(managementRoutes).find((item)=>{
                return item.route == m.route.get()
            })


            if(!route){
                route = teacherRoutes[0]
            }
            
            isLoggedIn().then((res)=>{
                if(User && User.coduser){
                    localStorage.setItem('meditationcod',JSON.stringify({'coduser':User.coduser, 'role':User.role}))
                    m.redraw()
                }
            })
        },
        view:(vnode)=> {
            return [
                //m(NavBar),
                
                // damos por  hechoque está logueado
                User.coduser  ? [
                    m(Grid,
                        m(Column,{width:'1-6',style:"background:#f2f2f2"},
                            m(Sidebar)
                        ),
                        
                        m(Column,{width:'5-6', style:"overflow:auto;background:#f2f2f2"},
                            m(Padding,

                                m(Flex,{direction:'row', vAlign:'middle'},
                                    m(Icon,{icon:route.icon, size:'large'}),
                                    m("div",{style:"width:20px"}),
                                    m("h2",{style:"margin-top:0px"}, route.name ),
                                ),

                                m("div",{style:"height:20px"}),
                                
                                // si no está logueado
                                //m(Section, { style:"background-color:white;height:100vh;padding:20px;margin:25px;border-radius:20px"},
                                vnode.children.map((child) => {
                                    return m("main", m(child, vnode.attrs))
                                })
                            )
                        )
                    )
                ] : m(LoginPage)
            ]
        }
    }
}