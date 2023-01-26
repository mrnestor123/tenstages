import { Button, Form, FormLabel, Modal, ModalBody, ModalFooter, ModalHeader, TextField } from "./view/components.js"
import { ContentManagement, ContentView, EditContent, MainScreen, ProfileView, TeacherManagement } from "./view/index.js"


let user = {}

m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, MainScreen)
        },
    },

    '/management': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ContentManagement)
        }
    },

    "/editcontent/:cod": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditContent)
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
            return m(Layout, vnode.attrs, EditContent)
        }
    }
})

function Layout() {
    let route = 'home'
    // DE MOMENTO PASAMOS EL USUARIO ASI !!!

    function LoginModal() {
        let data = {};
        let errormessage = undefined;
        
        async function log({type, email, password}){

            var result = await login({type:type, email: email, password: password})

            console.log(result, result.user)
            
            if(result.user || result.uid){
                
                let uid = result.uid || result.user.uid

                localStorage.setItem('meditationcod', uid)
             //   user  = await getUser(result.uid)
                location.reload()
            }else{
                errormessage = result;
            }
        }

        return {
            view: (vnode) => {
                return m(Modal,
                    {
                        center: true,
                        id: 'login-modal'
                    },
                    m(ModalHeader,
                        "Login"
                    ),
                    m(ModalBody,
                        m(Form,
                            m(FormLabel,
                                "Username"
                            ),
                            //m(".uk-inline",
                            //  m("span.uk-form-icon",{'uk-icon':'icon:user'}),
                            m(TextField, { data: data, name: "email", type: "input" }),
                            //),
                            m(FormLabel,
                                "Password"
                            ),
                            m(TextField, { data: data, name: "password", type: "password" }),
                            
                            errormessage ? m("div",{style:"font-size:1.1em;color:red"}, errormessage) : null,
                        )
                    ),
                    m(ModalFooter,
                        m("uk-text-left",
                            //CAMBIAR
                            //m("button", { 'uk-icon': 'facebook', onclick: (e) => log({type:'facebook'}) }),
                            m(Button, { onclick: (e) => log({type:'google'}), style:"background-color:red;color:white;font-weight:bold"}, "Login with google" )
                        ),
                        m(Button, { style: "float:right", onclick:(e) => log({type:'mail', email:data.email,password:data.password})}, "Login with MAIL")
                    )
                )
            }
        }
    }

    return {
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
        },
        view: (vnode) => {
            return [
                m("nav.uk-navbar-container", { 'uk-navbar': '' },
                    m("nav", { 'uk-navbar': '', style: "width:100%" },
                        m(".uk-navbar-left",
                            m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages.png', style: "max-height:100px;width:auto" })),
                            m("ul.uk-navbar-nav",
                                m("li",
                                    {
                                        class: route == 'home' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'home'; m.route.set('/') }
                                    },
                                    m("a", "Home ")
                                ),
                                user.role == 'teacher' || user.role =='admin' ?
                                m("li",
                                    {
                                        class: route == 'management' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'management'; m.route.set('/management') }
                                    },
                                    m("a", "Content")
                                ) : null,

                                user.role == 'teacher' || user.role =='admin' ?
                                m("li",
                                    {
                                        class: route == 'teacher-management' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'teacher-management'; m.route.set('/teacher-management')}
                                    },
                                    m("a", "Teachers Management")
                                ) : null
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
                                m(LoginModal)
                            )
                        )
                    )
                ),

                vnode.children.map((child) => {
                    return m("main", m(Container,{size:'medium'},  [
                        m(child, vnode.attrs)
                    ] ))
                }),

                //m("footer", { style: "width:100%;background-color:black;min-height:100px;" }, "Footer")

            ]
        }
    }
}

// MEJORAR ESTO !!
function getCurrentUser(){
    return user;
}

export {user,  getCurrentUser}