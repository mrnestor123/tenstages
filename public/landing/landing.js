import { Button, Card, CardBody, Flex, Grid, Row, Section } from "../components/components.js"
import { LoginInput } from "../components/tenstages-components.js"


function TenStagesNavbar() {
    return {
        view: () => {
            return [
                m("div", {"uk-sticky": "sel-target: nav.uk-navbar-container; cls-active: uk-navbar-sticky"}, [
                    m("nav.uk-navbar-container", { 'uk-navbar': '', style:"background-color: transparent" },
                        m("nav", { 'uk-navbar': '', style: "width:100%" },
                            m(".uk-navbar-left",
                                m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages.png', style: "max-height:95px; width:auto" })),
                                m("ul.uk-navbar-nav", {}, [
                                    m("li", m("a", { onclick: () => { m.route.set('/') }}, "Home")),
                                    m("li", m("a", {onclick:()=> m.route.set('/support')}, "Support"))
                                    //m("li", m("a", { onclick: () => { m.route.set('/') }}, "Philosophy")),
                                    //m("li", m("a", { onclick: () => { m.route.set('/') }}, "About us")),
                                ])
                            ),
                            m(".uk-navbar-right",
                                m(".uk-navbar-item",
                                    m(Button,
                                        {
                                            type: "primary",
                                            target: '',
                                            style: "border-radius: 16px;"
                                        },
                                        "Download for free"
                                    )
                                ),
                                m(".uk-navbar-item",
                                    localStorage.getItem('meditationcod') ?
                                    m("a.material-icons",
                                        {
                                            onclick:(e) => {
                                                m.route.set(`/login`)
                                                //m.route.set(`/profile/${localStorage.getItem('meditationcod')}`)
                                            }
                                        },
                                        'person'
                                    )
                                    :
                                    m(Button,
                                        {
                                            type: "secondary",
                                            onclick: () => { m.route.set('/login') }
                                            //target: '#login-modal'
                                        },
                                        "LOGIN"
                                    ),
                                    //m(LoginModal)
                                )
                            )
                        )
                    )
                ])
            ]
        }
    }
}

function LandingPage() {
    return {
        view: (vnode) => {
            return [
                m("div", { style: "background-image:url('./assets/slider.webp'); background-size:cover; background-position:center; height:100vh; width:100%;display:flex;flex-direction:column;" }, [
                    m("div", { style: "display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1" },[
                        m("h1", { style: "text-align:center" }, "Welcome to TenStages"),
                        m("p", { style: "text-align:center" }, "A platform to help you reach your full potential"),
                        m("div", { style: "display:flex;justify-content:center" },
                            m(Button,
                                {
                                    type: "primary",
                                    onclick: (e) => {
                                        m.route.set('/management')
                                    }
                                },
                                "Start Now"
                            )
                        )
                    ])
                ]),
                m(Section, {}, [
                    m(Flex, {direction:'column', hAlign:'center', style:'align-items:center' }, [
                        m("h1", { style: "font-size:56px" }, "What is TenStages?"),
                        m("p", { style: "font-size:20px;max-width:700px;margin-top:20px"}, "TenStages te cambia la vida flipao date cuenta que es lo mejor, descarga la app, que te lo digo yo. Que si flipao que meditas y se te va la olla de lo que mejora tu vida. Nuestro creador Zerni te lo asegura, que es como meterte un tripi nano, que te vuelves uno con la mama tierra jurao que si. Que brother imaginate tu volando y el resto andando, imaginatelo flipao que estás por encima del resto, a qué esperas para volar? Anda y descarga esta app que no te vas a arrepentir, que ya hay muchos volando, no te quedes atrás primo."),
                    ]),
                ]),
                m(Section, {type:'muted'}, [
                    m(Flex, {direction:'column', hAlign:'center', style:'align-items:center' }, [
                        m("h1", { style: "font-size:56px;" }, "≧◡≦"),
                    ]),
                ]),
                m(Section, {}, [
                    m(Flex, {direction:'column', hAlign:'center', style:'align-items:center' }, [
                        m("h1", { style: "font-size:56px;" }, "(づ｡◕‿‿◕｡)づ"),
                    ]),
                ]),
                m(Section, { style:"padding:0px" }, [
                    m(Flex, {direction:'column', hAlign:'center', style:'align-items:center; background:#ECD79D' }, [
                        m("h1", { style: "font-size:40px;margin-top:64px" }, "Contact Us"),
                        m("p", { style:"font-size:20px; max-width:700px;margin-bottom:88px"}, "You can contact us at: ", m("a", {href:"mailto:"}, "mrnestor123@tenstages.app"))    
                    ]),
                ])
            ]
        }
    }
}

function Footer() {
    let styles = {
        titles: 'font-size:14px;font-weight:700;letter-spacing:2.5px;padding-bottom:16px',
        links: 'color:#5a6175;font-size:14px;letter-spacing:2.5px;padding-bottom:16px'
    }
    return {
        view: () => {
            return [
                m(Row, {}, [
                    m(Grid, {size:'small', match:true, childWidth:'1-3@m'}, [
                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                m("div", {style: styles.titles}, "DOWNLOAD THE APP"),
                                m("a", {href:"/", style:"border:1.5px solid black;border-radius:16px;width:200px;height:60px;background-image:url('./assets/app-store.svg');background-size:cover; background-position:center;"}, ""),
                                m("a", {href:"/", style:"margin-top:5px;border:1.5px solid black;border-radius:16px;width:200px;height:60px;background-image:url('./assets/google-play.svg');background-size:cover; background-position:center;"}, "")
                            ])
                        ]),
                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column;'}, [
                                m("div", {style: styles.titles}, "TEN STAGES"),
                                m("a", {href:"/", style: styles.links}, "SUSCRIBE"),
                                m("a", {href:"/", style: styles.links}, "REDEEM A CODE"),
                                m("a", {href:"/", style: styles.links}, "TEACHERS"),
                                m("a", {href:"/", style: styles.links}, "WHAT IS MEDITATION?"),
                                m("a", {href:"/", style: styles.links}, "WHAT ARE THE TEN STAGES?"),
                            ])
                        ]),
                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column;'}, [
                                m("div", {style: styles.titles}, "ABOUT US"),
                                m("a", {href:"/", style: styles.links}, "TENSTAGES TEAM"),
                                m("a", {href:"/", style: styles.links}, "COURSES"),
                                m("a", {href:"/", style: styles.links}, "CAREERS"),
                            ])
                        ])
                    ])
                ])
            ]
        }
    }
}



export { LandingPage, Footer, TenStagesNavbar }