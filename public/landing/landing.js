import { Button, Card, CardBody, Flex, Grid, Icon, Row, Section } from "../components/components.js"
import { LoginInput } from "../components/tenstages-components.js"


// COLOR veige #FFFAD5
function TenStagesNavbar() {
    return {
        view: () => {
            let route = m.route.get()
            console.log('route', route)

            return [
                m("div", {}, [
                    m("nav.uk-navbar-container", { 'uk-navbar': '', style:`${route && route != '/' ? 'border-bottom:1px solid lightgrey;background-color:white!important;': 'background-color: #FFFAD5;'} padding: 0px 25px` },
                        m("nav", { 'uk-navbar': '', style: "width:100vw;" },
                            m(".uk-navbar-left",
                                m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-horizontal.png', style: "max-height:95px; width:auto", onclick:(e)=>m.route.set('/')})),
                            ),
                            m(".uk-navbar-right",
                            m("ul.uk-navbar-nav", {}, [
                                m("li",{ class: route !='/support' ? 'uk-active': ''},   m("a", {  onclick: () => { m.route.set('/') }}, "Home")),
                                m("li",{ class: route =='/support' ? 'uk-active': ''},   m("a", { onclick: () => { m.route.set('/support') }}, "Support")),

                                //m("li", m("a", { onclick: () => { m.route.set('/') }}, "Philosophy")),
                                //m("li", m("a", { onclick: () => { m.route.set('/') }}, "About us")),
                            ]), 
                                
                            /*
                                m(".uk-navbar-item",
                                    m(Button,
                                        {
                                            style: "border: 1px solid; border-radius: 25px; background-color:transparent; padding: 0px 50px",
                                        },
                                        "JOIN"
                                    )
                                ),*/
                            )
                        )
                    )
                ])
            ]
        }
    }
}

function LandingPage() {

    // TELÉFONO CON EL TEXTO A LA IZQUIERDA O DERECHA
    function PhoneRow(){
        return {
            view:(vnode)=>{
                let {position, image, title, text} = vnode.attrs

                // HE AÑADIDO UK-FLEX PORQUE SINO NO SE CENTRABA
                return [
                    m(Grid,{childWidth: '1-2@l', verticalalign:true, center:true, style:"height:28%;position:relative;"},
                        m("div.uk-flex-column.uk-flex.uk-flex-center", 
                            m("div",{style:"padding-left:2em; max-width:70%; margin:0 auto;"}, [
                                m("h1", {style:"text-align:left;"}, title),
                                m("p", {style:"text-align:left;"}, text),
                            ])
                        ),
                        m(`div.uk-flex${window.innerWidth > 1200 ?  '.uk-flex-center' : ''}`,{style:"height:85%"}, 
                            // CON DIV NO HE CONSEGUIDO HACERLO IR, LO CAMBIO A IMG
                            m("img", {
                                src: image,
                                style: "object-fit:cover"
                            })
                        ),
                    )   
                        
                ]
            }

        }

    }


    function InfoCard(){
        return {
            view:(vnode)=>{
                let {icon, title, text} = vnode.attrs
                
                return [
                    m("div.uk-width-1-3@l",
                        m(Card,{style:"min-height:200px; background-color:#F2F2F2; border-radius:15px;margin:1em; min-width:200px;"},
                            m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                m(Icon,{icon: icon, size:window.innerWidth < 1200? 'verymassive':'massive'}),
                                m("h2", title),
                                m("p", text)
                            ])
                        )
                    ),
                ]
            }
        }
    }

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
                        "width":"100vw",
                        "display":"flex",
                        "flex-direction":"column"
                    }
                }, [
                    m(Section, { type:"muted", style:" margin-top:20vh; margin-left:15vw; background-color:transparent; " }, [
                        m("div.uk-width-1-3@l.uk-width-2-3@m", [
                            m("h1", { style: "text-align:left; margin-bottom:0.5em;" }, "A journey inside yourself"),

                            // m("br")
                            m("p", { style: "text-align:left; "}, "A complete meditation training system integrating buddhist wisdom with brain science.",m("br"),m("br"), "Based on The Mind Illuminated, created by John Yates."),
                            m("div", { style: "display:flex;justify-content:left" },
                                /* LO HE COMENTADO  PARA LA PRIMERA VERSIÓN
                                m(Button,
                                    {
                                        style: "background-color: transparent; border: 1px solid; border-radius:25px",
                                        onclick: (e) => {
                                           // m.route.set('/management')
                                        }
                                    },
                                    "Start Now"
                                ) */
                            )
                        ])
                    ])
                ]),
                // Benefits de TenStages
                m(Section, { size:"small" }, [
                    m("h1", {style: "text-align:center;"}, "Benefits of using TenStages"),
                    
                    m(Grid, {size:'small', match:true,  center:true}, [
                        m(InfoCard,{icon:'psychology_alt',title: "Understand your mind", text:"Learn how your mind works and how to train it"}),
                        m(InfoCard,{icon:'self_improvement', title: "Practice", text:"Learn from certified The Mind Illuminated teachers"}),
                        m(InfoCard,{icon:'checklist', title: "Clear and structured", text: "Know what you are doing and why"})
                    ])
                ]),

                // Imagen del camino
                
                m("div", { 
                    style: {
                        "background-image":"url('./assets/camino.png')", 
                        "background-size":"cover", 
                        "background-position":"center",
                        "height":"300vh",
                        "position":"relative",
                        "width":"100%"
                    }
                }, [
                    // PARA CUANDO ESTAMOS EN MÓVIL
                    window.innerWidth < 1200 ? m("div",{style:"height:20vh"}): null,
                    m(PhoneRow,{
                        image:'./assets/stage1.png', 
                        title:"Train the mind\nin TenStages", 
                        text:"Providing a step-by-step guidance from your very first sit all the way to mastery of the deepest states of peace and insight. "
                    }), 

                    m(PhoneRow,{
                        image: './assets/stage2.png',
                        title:"Understand your mind",
                        text: "At each stage we will provide you with information about your mind based on neuroscience. We will be expanding our model all the time through the ten stages. "
                    }),
                    
                    m(PhoneRow,{
                        image: './assets/stage3.png',
                        title:"Practice with certified teachers",
                        text: ""
                    }),

                ]),
                m(Section, { size:"small" }, [
                    m(Grid, {size:'small', match:true, childWidth:'1-2@l', center:true, verticalalign:true}, [
                        m("div",m("img", {src: "./assets/pexels-rfstudio-3059892.jpg", style:"margin:1em;"})),
                        m("div",m(Flex, {direction:'column', style:"padding:1em"}, 
                            m("h1",  "What is TenStages?"),
                            m("p", m.trust(`<p> The aim of TenStages is to give an overall understanding of what meditation is all about. We want you to understand what really is meditation, how your brain works and how you can become happier with what you have.</p>

                            </p><p> We hope that you enjoy the content and that you learn as much as we learn with everyone. Our aim is to improve the overall peace and make the world a better place. </p>
                            <p> Attentively,  </p>
                            
                            <p>The TenStages team </p>`)),
                        ))
                    ]),
                ]),
                /*
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
                ])*/
                m(Section, { style:"padding:0px" }, [
                    m(Flex, {direction:'column', hAlign:'center', style:'align-items:center; background:#ECD79D' }, [
                        m("h1", { style: "margin-top:64px" }, "Contact Us"),
                        m("p", { style:"font-size:20px; max-width:700px;margin-bottom:88px"}, "You can contact us at: ", m("a", {href:"mailto:"}, "support@tenstages.app"))    
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
                m("footer",{style:"border-top:1px solid lightgrey"},
                    m(Grid, {size:'small', match:true, childWidth:'1-3@m',center:true   }, [
                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column; align-items:center;'}, [
                                m("div", {style: styles.titles}, "DOWNLOAD THE APP"),
                                m("a", {href:"/", target:'_blank', style:"border:1.5px solid black;border-radius:16px;width:200px;height:60px;background-image:url('./assets/app-store.svg');background-size:cover; background-position:center;"}, ""),
                                m("a", {href:"https://play.google.com/store/apps/details?id=tenStages.meditationApp", target:'_blank', style:"margin-top:5px;border:1.5px solid black;border-radius:16px;width:200px;height:60px;background-image:url('./assets/google-play.svg');background-size:cover; background-position:center;"}, "")
                            ])
                        ]),

                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column;'}, [
                                m("div", {style: styles.titles}, "TEN STAGES"),
                                m("a", {onclick:()=> m.route.set("/privacy"), style: styles.links}, "PRIVACY POLICY"),
                                // m("a", {href:"/", style: styles.links}, "REDEEM A CODE"),
                                // m("a", {href:"/", style: styles.links}, "TEACHERS"),
                                // m("a", {href:"/", style: styles.links}, "WHAT IS MEDITATION?"),
                                // m("a", {href:"/", style: styles.links}, "WHAT ARE THE TEN STAGES?"),
                            ])
                        ]),
                        /*
                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column;'}, [
                                m("div", {style: styles.titles}, "ABOUT US"),
                                m("a", {href:"/", style: styles.links}, "TENSTAGES TEAM"),
                                m("a", {href:"/", style: styles.links}, "COURSES"),
                                m("a", {href:"/", style: styles.links}, "CAREERS"),
                            ])
                        ])*/
                    ])
                )
            ]
        }
    }
}


function SupportPage() {

    return {
        view: (vnode) => {
            return [
                m(Section,[
                    m(Flex, {direction:'column', hAlign:'center', style:'align-items:center; min-height:50vh;padding:1em;' }, [
                        //m("h1", "Support page"),
                        m("p", "We are currently working on a FAQ and a support page. In the meantime, if you have any questions or issues, please contact us at: "),

                        m("h1",m("a",{class:'header', href:"mailto:support@tenstages.app"}, "support@tenstages.app"))
                    ]),
                ])
            ]

        }
    }

}


function PrivacyPage(){


    let privacyText= `<div style="text-align:center;font-size:0.9rem"> Last update: 16 May of 2022 </div>  <br>
        <div>This Privacy Policy explains how TenStages ("we," "us," or "our") collects, uses, shares, and protects user 
        information when you use the TenStages Meditation App . We are committed to maintaining the privacy and confidentiality 
        of your personal information. By accessing or using the App, you agree to the terms of this Privacy Policy.</div>
        <div><br></div>
        <div>Information We Collect:</div><div>a. Personal Information: When you register and use the App,
        we may collect personal information, such as your name, email address, and other contact information. 
        We may also collect payment information if you make any purchases within the App.</div><div><br></div>
        <div>b. Usage Information: We may collect information about your interactions with the App, including 
        the meditations you complete, the features you use, and the content you access. This information may include 
        device information, IP address, browser type, operating system, and other usage details.</div><div><br></div>
        <div>How We Use Your Information:</div><div>a. Provide and Improve the App: We use the collected information 
        to deliver, personalize, and improve the functionality and user experience of the App. This includes providing 
        you with access to meditation content, recommending relevant content, and enhancing the overall performance of 
        the App.</div><div><br></div><div>b. Communication: We may use your contact information to communicate with you 
        regarding the App, respond to your inquiries, provide customer support, and send you important notices or 
        updates about the App.</div><div><br></div><div>c. Analytics and Research: We may use the collected information for analytical purposes,
        such as understanding user behavior, usage patterns, and preferences. This helps us improve the App, develop new features,
        and conduct research to enhance our meditation offerings.</div><div><br></div><div>d. Legal Compliance: We may use your information
        to comply with applicable laws, regulations, or legal processes, respond to lawful requests, and protect our rights or the rights of others.
        </div><div><br></div><div>Sharing of Information:</div><div>a. Service Providers: We may engage trusted third-party service providers to 
        perform certain functions on our behalf, such as hosting, data analysis, payment processing, or customer support. These providers have 
        access to your information only to the extent necessary to perform these tasks on our behalf and are obligated to maintain the confidentiality 
        and security of your information.</div><div><br></div><div>b. Aggregated or De-Identified Data: We may share aggregated or de-identified 
        information with third parties for analytical, research, marketing, or other purposes. This information does not personally identify you.
        </div><div><br></div><div>c. Legal Requirements: We may disclose your information if required to do so by law, or if we believe in good faith 
        that such action is necessary to comply with legal obligations, protect our rights, investigate fraud, or respond to a government request.
        </div><div><br></div><div>d. Business Transfers: In the event of a merger, acquisition, or any form of sale or transfer of some or all of our assets, 
        your information may be transferred as part of the transaction. We will notify you via prominent notice on our website or within the App of any 
        change in ownership or use of your personal information.</div><div><br></div><div>Data Security:</div><div>We take reasonable measures to protect 
        your personal information from unauthorized access, disclosure</div>`
    
    return {
        view:(vnode)=>{
            return [
                m(Section,[
                    m(Flex, {direction:'column',  style:'padding:1em;' }, [
                        m.trust(privacyText)
                    ]),
                ])
            ]

        }
    }
}

export { LandingPage, Footer, TenStagesNavbar, SupportPage, PrivacyPage}