import { Footer, LandingPage, PrivacyPage, SupportPage, TenStagesNavbar } from "./landing.js"


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

    '/privacy': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, PrivacyPage)
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
                    return m("main", [
                        m(child, vnode.attrs)
                    ])
                }),

                m(Footer)

            ]
        }
    }
}

