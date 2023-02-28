import { Button, Form,  Modal, ModalBody, ModalFooter, ModalHeader, TextField, Container} from "../components/components.js"
import { LandingPage, Footer, TenStagesNavbar, LoginPage } from "./landing.js"


// La página web puede tener otro html y otro enrutador !!

m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, LandingPage)
        },
    },

    '/login':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, LoginPage)
        }
    },

    /*
    '/management': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ContentManagement)
        }
    },

    "/editcontent/:cod": {
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
    }*/
})

/// HACEMOS LOGIN SOLO EN TENSTAGES-MANAGEMENT !!

function Layout() {
    let route = 'home'
    // DE MOMENTO PASAMOS EL USUARIO ASI !!!

    return {
        /*
        oninit:(vnode)=>{
            route = m.route.get().substring(1)

            if(localStorage.getItem('meditationcod')){
                //  REFACTORIZAR Y CREAR CLASE USER
                getUser(localStorage.getItem('meditationcod')).then((usr)=>{
                    if(usr){
                        console.log('got user',usr)
                        user = usr
                        m.redraw()
                    }
                })
            }
        },*/
        view: (vnode) => {
            return [
                m(TenStagesNavbar),

                // m(Button,{
                //    onclick:(e)=>{
                //         console.log(window.location)
                //         window.location.href= window.location.href + 'management.html'
                //     }
                // }, "Press to go to management page"),
                
                vnode.children.map((child) => {
                    return m("main", [
                        m(child, vnode.attrs)
                    ])
                }),

                m(Footer)

            ]
        }
    }
}
