import { Button, Card, CardBody, Flex, Grid, Row, Section } from "../components/components.js"
import { LoginInput } from "../components/tenstages-components.js"


// COLOR veige #FFFAD5

function TenStagesNavbar() {
    return {
        view: () => {
            return [
                m("div", {}, [
                    m("nav.uk-navbar-container", { 'uk-navbar': '', style:"background-color: #FFFAD5; padding: 0px 25px" },
                        m("nav", { 'uk-navbar': '', style: "width:100%" },
                            m(".uk-navbar-left",
                                m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-horizontal.png', style: "max-height:95px; width:auto" })),
                            ),
                            m(".uk-navbar-right",
                            m("ul.uk-navbar-nav", {}, [
                                m("li", m("a", { onclick: () => { m.route.set('/') }}, "Philosophy")),
                                m("li", m("a", { onclick: () => { m.route.set('/') }}, "About us")),
                            ]),
                                m(".uk-navbar-item",
                                    m(Button,
                                        {
                                            style: "border: 1px solid; border-radius: 25px; background-color:transparent; padding: 0px 50px",
                                        },
                                        "JOIN"
                                    )
                                ),
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
                // Imagen de montaña
                m("div", { 
                    style: {
                        "background-image":"url('./assets/slider.webp')", 
                        "background-size":"cover", 
                        "background-position":"center",
                        "height":"100vh",
                        "width":"100%",
                        "display":"flex",
                        "flex-direction":"column"
                    }
                }, [
                    m(Section, { type:"muted", style:"width:260px; height:350px; margin-top:20vh; margin-left:20vw; background-color:transparent; scale:1.2" }, [
                        m(Flex, {direction:'column'}, [

                            m("h1", { style: "text-align:left; margin-bottom:0px; font-family:'Gotham Rounded'; font-weight:350" }, "Answer the "),
                            m("h1", { style: "text-align:left; margin-top:0px; font-family:'Gotham Rounded'; font-weight:350" }, "awakening call"),
                            m("p", { style: "text-align:left; font-family:'Gotham Rounded'; font-weight:300"}, "A complete meditation training system integrating buddhist wisdom with brain science. Based on The Mind Iuminated."),
                            m("div", { style: "display:flex;justify-content:left" },
                                m(Button,
                                    {
                                        style: "background-color: transparent; border: 1px solid; border-radius:25px",
                                        onclick: (e) => {
                                            m.route.set('/management')
                                        }
                                    },
                                    "Start Now"
                                )
                            )
                        ])
                    ])
                ]),
                // Benefits de TenStages
                m(Section, { size:"small" }, [
                    m("h1", {style: "text-align:center; margin:0px; font-family:'Gotham Rounded'; font-weight:350"}, "Benefits of using TenStages"),
                    m(Row, {}, [
                        m(Grid, {size:'small', match:true, childWidth:'1-3@m'}, [
                            m(Card, [
                                m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                    m("div", {style:"height:200px; width:100%; background-color:#F2F2F2; border-radius:15px"}, ""),
                                ])
                            ]),
                            m(Card, {}, [
                                m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                    m("div", {style:"height:200px; width:100%; background-color:#F2F2F2; border-radius:15px"}, ""),
                                ])
                            ]),
                            m(Card, {}, [
                                m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                    m("div", {style:"height:200px; width:100%; background-color:#F2F2F2; border-radius:15px"}, ""),,
                                ])
                            ])
                        ])
                    ]),
                ]),
                // Imagen del camino
                m("div", { 
                    style: {
                        "background-image":"url('./assets/camino.png')", 
                        "background-size":"auto", 
                        "background-position":"center",
                        "height":"300vh",
                        "width":"100%",
                        "display":"flex",
                        "flex-direction":"column"
                    }
                }, [
                    // movil 1
                    m("div", {
                        style:{
                            "background-image":"url('./assets/stage1.png')", 
                            "background-size":"cover",
                            "background-position":"center",
                            "height":"120vh",
                            "width":"120vh",
                            "margin-left":"43vw",
                            "margin-top":"12vh",
                            "overflow":"hidden"
                        }
                    }, [
                    ]),
                    // movil 2
                    m("div", {
                        style:{
                            "background-image":"url('./assets/stage2.png')", 
                            "background-size":"cover",
                            "background-position":"center",
                            "height":"120vh",
                            "width":"120vh",
                            "margin-left":"-6vw",
                            "margin-top":"-35vh",
                            "overflow":"hidden"
                        }
                    }, [
                    ]),
                    // movil 3
                    m("div", {
                        style:{
                            "background-image":"url('./assets/stage3.png')", 
                            "background-size":"cover",
                            "background-position":"center",
                            "height":"120vh",
                            "width":"120vh",
                            "margin-left":"43vw",
                            "margin-top":"-15vh",
                            "overflow":"hidden"
                        }
                    }, [
                    ]),
                    // texto 1
                    m("div", {
                        style:{
                            "background":"transparent",
                            "height":"400px",
                            "width":"400px",
                            "margin-left":"15vw",
                            "margin-top":"-300vh",
                            "overflow":"hidden",
                            "scale":"1.2"
                        }
                    }, [
                        m("h1", {style:"text-align:left; font-family:'Gotham Rounded'; font-weight:350"}, "Training the mind ", m("br"), "in TenStages"),
                        m("p", {style:"text-align:left; font-family:'Gotham Rounded'; font-weight:300;"}, "Based on ancient buddhist texts, providing a step-by-step guidance from your very first sit all the way to mastery of the deepest states of peace and insight. At TenStages, we procide a comprehensive guide to meditation with a focus on developing a deep understanding of the mind and its workings."),
                    ]),
                    // texto 2
                    m("div", {
                        style:{
                            "background":"transparent",
                            "height":"400px",
                            "width":"500px",
                            "margin-left":"60vw",
                            "margin-top":"65vh",
                            "overflow":"hidden",
                            "scale":"1.2"
                        }
                    }, [
                        m("h1", {style:"text-align:left; font-family:'Gotham Rounded'; font-weight:350"}, "Understand how ", m("br"), "your mind works"),
                        m("p", {style:"text-align:left; font-family:'Gotham Rounded'; font-weight:300;"}, "Based on ancient buddhist texts, providing a step-by-step guidance from your very first sit all the way to mastery of the deepest states of peace and insight. At TenStages, we procide a comprehensive guide to meditation with a focus on developing a deep understanding of the mind and its workings."),
                    
                    ]),
                    // texto 3
                    m("div", {
                        style:{
                            "background":"transparent",
                            "height":"400px",
                            "width":"500px",
                            "margin-left":"15vw",
                            "margin-top":"40vh",
                            "overflow":"hidden",
                            "scale":"1.2"
                        }
                    }, [
                        m("h1", {style:"text-align:left; font-family:'Gotham Rounded'; font-weight:350"}, "Practice with ", m("br"), "certified teachers"),
                        m("p", {style:"text-align:left; font-family:'Gotham Rounded'; font-weight:300;"}, "Based on ancient buddhist texts, providing a step-by-step guidance from your very first sit all the way to mastery of the deepest states of peace and insight. At TenStages, we procide a comprehensive guide to meditation with a focus on developing a deep understanding of the mind and its workings."),
                    ]),
                ]),
                m(Section, { size:"small" }, [
                    m(Flex, {direction:'row', hAlign:'center', style:'align-items:center' }, [
                        m("img", {src: "./assets/pexels-rfstudio-3059892.jpg"}),
                        m("h1", { style: "font-size:56px" }, "What is TenStages?"),
                        m("p", { style: "font-size:20px;max-width:700px;margin-top:20px"}, "TenStages te cambia la vida flipao date cuenta que es lo mejor, descarga la app, que te lo digo yo. Que si flipao que meditas y se te va la olla de lo que mejora tu vida. Nuestro creador Zerni te lo asegura, que es como meterte un tripi nano, que te vuelves uno con la mama tierra jurao que si. Que brother imaginate tu volando y el resto andando, imaginatelo flipao que estás por encima del resto, a qué esperas para volar? Anda y descarga esta app que no te vas a arrepentir, que ya hay muchos volando, no te quedes atrás primo."),
                    ]),
                ]),
                m(Section, { size:"small" }, [
                    m("h1", {style: "text-align:center; margin:0px; font-family:'Gotham Rounded'; font-weight:350"}, "What people say about TenStages"),
                    m(Row, {}, [
                        m(Grid, {size:'small', match:true, childWidth:'1-3@m'}, [
                            m(Card, [
                                m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                    m("div", {style:"height:200px; width:100%; background-color:#F2F2F2; border-radius:15px"}, ""),
                                ])
                            ]),
                            m(Card, {}, [
                                m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                    m("div", {style:"height:200px; width:100%; background-color:#F2F2F2; border-radius:15px"}, ""),
                                ])
                            ]),
                            m(Card, {}, [
                                m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                    m("div", {style:"height:200px; width:100%; background-color:#F2F2F2; border-radius:15px"}, ""),,
                                ])
                            ])
                        ])
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

function LoginPage() {
    let data = {}
    let errorMsg;

    async function log({type, email, password}){

        var result = await login({type:type, email:email, password:password})
        
        if(result.user || result.uid) {
            
            let uid = result.uid || result.user.uid
            console.log('meditationcod', uid)
            localStorage.setItem('meditationcod', uid) // ?????? QUE COJONES ??????
         // user  = await getUser(result.uid)
            location.reload()
        } else {
            errorMsg = result;
            console.log("error login", errorMsg)
        }
    }

    return {
        oninit: () => { window.scrollTo(0,0) },
        view: () => {
            return [
                m("div", { style: "background-image:url('./assets/side-wave_background.svg'); background-size:cover; background-position:center; height:500px; margin: 95px 0px 0px 0px; width:100%; display:flex ;flex-direction:column; align-items:center; justify-content:center" }, [
                    m(Card, {type:"default", style:"border-radius:16px"}, [
                        m(CardBody, {}, [
                            m("h2", {style:"text-align:center; margin-bottom:25px"}, "Login"),
                            m("form", { onsubmit: (e) => { e.preventDefault(); } },
                                m(LoginInput, { label:'Email', type: "input", data: data, name: "email", id:"email"}),
                                m(LoginInput, { label: "Password", type: "password", name: "password", id: "password", data: data }),
                                m(".", {style: "margin-bottom:15px;"}, m("a", {href: "/forgot-password"},"Forgot your password?")),
                                m(Flex, {direction:"row"}, [
                                    m(Button, { style: "border-radius:20px;padding:0px 10px;height:48px;width:100%;", type: "primary", onclick: () => { login(); } }, "Login with email"),
                                    m(Button, { onclick: () => log({type:'google'}), style: "border-radius:20px;padding:0px 10px;margin-left:5px"}, [
                                        m("img", {src:"./assets/icons8-google.svg"})
                                    ]),
                                    // m(Button, { style: "border-radius:20px;padding:0px 10px;margin-left:5px"}, [
                                    //     m("img", {src:"./assets/icons8-facebook.svg"})
                                    // ]),
                                ]),
                                m(".", {style: "margin-top:15px;"}, "First time here? ", m("a", {href: "/register"}, "Register for free!")),
                            )
                        ])
                    ])
                ]),
                
            ]
        }
    }
}

export { LandingPage, Footer, TenStagesNavbar, LoginPage }