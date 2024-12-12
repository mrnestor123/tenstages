import { AuthorPage, ContentShow, DonationPage, Footer, LandingPage, PhilosophyPage, PrivacyPage, SupportPage, TenStagesNavbar } from "./landing.js"


// La página web puede tener otro html y otro enrutador !!
m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, LandingPage)
        },
    },

    '/support':{
        render: function (vnode) {
            return m(Layout, vnode.attrs, SupportPage)
        }
    },


    '/author': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, AuthorPage)   
        }
    },

    '/privacy': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, PrivacyPage)
        }
    },

    '/donate': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, DonationPage)
        }
    },

    '/philosophy': {
        render: function (vnode){
            return m(Layout, vnode.attrs, PhilosophyPage)
        }
    },

    '/content': {
        render: function (vnode){
            return m(Layout, vnode.attrs, ContentShow)
        }
    }

})


/// HACEMOS LOGIN SOLO EN TENSTAGES-MANAGEMENT !!
function Layout() {
    let route = 'home'
    // DE MOMENTO PASAMOS EL USUARIO ASI !!!

    return {
        view: (vnode) => {
            return [
                m(TenStagesNavbar),
                

                vnode.children.map((child) => {

                    console.log('CHILD', child) 
                    
                    return m("main", [
                        /* m.route.get() != "/" ? 
                            m("div", { 
                                style:`width:100%;height:2em;background-color:${colorprin}`
                            }): null, */

                        m(child, vnode.attrs)
                    ])
                }),

                m(Footer)

            ]
        }
    }
}

