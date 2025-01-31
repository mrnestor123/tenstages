import { Button, Card, CardBody, CardFooter, CardMedia, Chip, Column, Flex, Form, FormLabel, Grid, Icon, Padding, Row, Section, Select, TextEditor, TextField } from "../components/components.js"
import { ContentCard, LoginInput } from "../components/tenstages-components.js"
import { DefaultText, Header, Header2 } from "../components/texts.js";
import { getContent, getContentbycod, contentTypes,  stagenumbers, types } from "../server/contentController.js";
import { getSettings } from "../server/server.js";


// COLOR veige #FFFAD5
function TenStagesNavbar() {

    let openMobileMenu = false;
    let clickedMenuButton = false;

    let menuOptions = [
        { name: 'Home', route: '/' },
      //  { name: 'Support', route: '/support' },
     //   { name: 'Philosophy', route: '/philosophy' }
    ]

    return {
        view: () => {
            let route = m.route.get()
            let isMobile = window.innerWidth < 1200

            return [
                m("nav.uk-navbar-container", { 
                    'uk-navbar': '', 
                    style:`${route && route != '/' ? 'border-bottom:1px solid lightgrey;background-color:white!important;': 'background-color: #FFFAD5;'} padding: 0px 25px` 
                },
                    
                    m(".uk-navbar-left",
                        m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-horizontal.png', style:  `max-height:${isMobile? '150px' :'100px'}; width:auto`, onclick:(e)=>m.route.set('/')})),
                    ),
                    m(".uk-navbar-right",
                        isMobile ? 
                        m("img", {
                            src:  openMobileMenu ? './assets/close_icon.svg' : './assets/menu_icon.svg',
                            onclick: () => { openMobileMenu = !openMobileMenu; clickedMenuButton = true }
                        }) : 
                        m("ul.uk-navbar-nav", {}, [
                            menuOptions.map((item) => {
                                return m("li", { 
                                    }, m("a", { 
                                        style:route == item.route ? 'font-weight:bold;color:black!important;'  : '', 
                                        onclick: () => { m.route.set(item.route) } 
                                    }, item.name)
                                )
                            }),
                            /*
                            m(Button,{
                                type:"secondary",
                                style:"border-radius:1em;",
                                onclick:(e)=> m.route.set('/donate')
                            }, "Donate")*/
                        ]) 
                    ),
                ),
                
                clickedMenuButton ?
                m("div", {
                    class: openMobileMenu ? 'slideup':'slidedown',
                    style:"position:fixed;border-top:2px solid lightgrey;bottom:0px; left:0px; right:0px; background-color:white; z-index:1000; padding:1em;border-top-radius:1em"
                }, 
                    m("ul.uk-list.uk-list-divider.uk-list-large",
                        menuOptions.map((item) =>{
                            return m("li", {
                                style:"text-align:center!mportant;text-transform:uppercase;padding:0.5em;" + (route == item.route ? 'font-weight:bold':''),
                                onclick: () => { m.route.set(item.route); openMobileMenu = false } 
                            },  item.name)
                        }),
                        m("div.uk-navbar-item",m(Button,{
                            type:"secondary",
                            style:"border-radius:1em;width:100%;",
                            onclick:(e) => { m.route.set('/donate'); openMobileMenu = false }
                        }, "Donate")) 
                    )
                ) : null,
            ]
        }
    }
}

function LandingPage() {

    // TELÉFONO CON EL TEXTO A LA IZQUIERDA O DERECHA
    function PhoneRow(){
        let image,title,text;

        function Text(){
            return {
                view:(vnode)=>{
                    return m("div.uk-flex-column.uk-flex.uk-flex-center", 
                        m("div",{style:"padding-left:2em; max-width:70%; margin:0 auto;"}, [
                            m("h1", {style:"text-align:left;"}, title),
                            m("p", {style:"text-align:left;"}, text),
                        ])
                    )
                }
            }
        }

        function Phone(){
            return {
                view:(vnode)=>{
                    
                    return m(`div.uk-flex${window.innerWidth > 1200 ?  '.uk-flex-center' : ''}`,{style:"height:75%"}, 
                    // CON DIV NO HE CONSEGUIDO HACERLO IR, LO CAMBIO A IMG
                    m("img", {
                        src: image,
                        style: "object-fit:cover"
                    })
                    )
                }
            }
        }

        return {
            view:(vnode)=>{
                let {textposition} = vnode.attrs
                
                image = vnode.attrs.image
                title = vnode.attrs.title
                text = vnode.attrs.text

                // HE AÑADIDO UK-FLEX PORQUE SINO NO SE CENTRABA
                return [
                    m(Grid,{childWidth: '1-2@l', verticalalign:true, center:true, style:"height:28%;position:relative;"},
                        textposition == 'right' && window.innerWidth > 1200 ? 
                        [ m(Phone), m(Text)] : 
                        [ m(Text), m(Phone)]
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
                                m("h2",{style:"margin-top:0em"}, title),
                                m("p",{style:"text-align:center"}, text)
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
                            //LO HE COMENTADO  PARA LA PRIMERA VERSIÓN
                            m("p", { style: "text-align:left; "}, "A complete meditation training system integrating buddhist wisdom with brain science", m("br"),m("br"), "Inspired by The Mind Illuminated"),
                           
                        ])
                    ])
                ]),
            
                // Benefits de TenStages
                m(Section, { size:"small" }, [
                    m("h1", {style: "text-align:center;"}, "Benefits of using TenStages"),
                    
                    m(Grid, {size:'small', match:true,  center:true}, [
                        m(InfoCard,{icon:'psychology_alt',title: "Understand your mind", text:"Learn how your mind works and how to work with it"}),
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
                        title:"Train in TenStages", 
                        text:"Providing a step-by-step guidance from your very first sit all the way to mastery of the deepest states of peace and insight. "
                    }), 

                    m(PhoneRow,{
                        image: './assets/stage2.png',
                        title:"Understand your mind",
                        textposition:'right',
                        text: "At each stage we will provide you with information about your mind based on neuroscience. We will be expanding our model all the time through the ten stages. "
                    }),
                    
                    m(PhoneRow,{
                        image: './assets/stage3.png',
                        title:"Practice with certified teachers",
                        text: "Listen to guided meditations, clear your doubts with our teachers and learn from the community. "
                    })

                ]),

                m(Section, { size:"small" }, [
                    m(Grid, {size:'small', match:true, childWidth:'1-2@l', center:true, verticalalign:true}, [
                        m("div",m("img", {src: "./assets/pexels-rfstudio-3059892.jpg", style:"margin:1em;"})),
                        m("div",m(Flex, {direction:'column', style:"padding:1em"}, 
                            m("h1",  "What is TenStages?"),
                            m("p", m.trust(`<p> The aim of TenStages is to give an overall understanding of what meditation is all about. We want you to understand what really is meditation, how your brain works and how you can become happier with what you have.</p>
                            </p><p> We hope that you enjoy the content and that you learn as much as we learn with everyone. Our aim is to improve the overall peace and make the world a better place. </p>
                            <p> Attentively,  </p>
                            <p> The TenStages team </p>`)),
                        ))
                    ]),
                ]),


                /*m(Section, { size:"small" }, [
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
                ]),*/
                
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
        titles: 'font-weight:700;letter-spacing:2.5px;padding-bottom:16px',
        links: 'color:#5a6175;letter-spacing:2.5px;padding-bottom:16px;cursor:pointer;'
    }

    function StoreImage(){

        return {
            view: (vnode)=>{
                let {href,src} = vnode.attrs

                return m("a",{
                    style:"border:1.5px solid black;border-radius:16px;width:80%;height:auto;padding:1em;display:flex;justify-content:center;align-items:center",
                    target:'_blank',
                    href:href
                }, m("img", {src:src, style:"width:70%;height:auto;"}))
            }
        }
    }

    return {
        view: () => {
            let isMobile = window.innerWidth < 1200
            return [
                m("footer",{style:"border-top:1px solid lightgrey"},
                    m(Grid, {size:'small', match:true, childWidth:'1-3@l 1-2@m',center:true   }, [
                        m(Card, {}, [
                            m(CardBody, {style:`display:flex; flex-direction:column; `}, [
                                m("div", {style: styles.titles}, "DOWNLOAD THE APP"),
                                m("div",{style:`display:flex; flex-direction:${isMobile ? 'row':'column'};`},
                                    m(StoreImage, {href:"https://apps.apple.com/app/tenstages/id1592906074", src: './assets/app-store.svg'}),
                                    m("div",{style:"height:1em;width:1em;"}),
                                    m(StoreImage, {href: "https://play.google.com/store/apps/details?id=tenStages.meditationApp", src: './assets/google-play.svg'})
                                )
                            ])
                        ]),

                        m(Card, {}, [
                            m(CardBody, {style:'display:flex; flex-direction:column;'}, [
                                m("div", {style: styles.titles}, "TEN STAGES"),
                                m("div", {onclick:()=> m.route.set("/donate"), style: styles.links}, "DONATE"),
                                //m("div", {onclick:()=> m.route.set("/author"), style: styles.links}, "ABOUT THE AUTHOR"),
                                m("div", {onclick:()=> m.route.set("/privacy"), style: styles.links}, "PRIVACY POLICY"),
                                //m("a", {href:"/", style: styles.links}, "TEACHERS"),
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
        <div>This Privacy Policy explains how TenStages ("we," "us," or "our") collects, uses, shares, and protects User 
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
        to deliver, personalize, and improve the functionality and User experience of the App. This includes providing 
        you with access to meditation content, recommending relevant content, and enhancing the overall performance of 
        the App.</div><div><br></div><div>b. Communication: We may use your contact information to communicate with you 
        regarding the App, respond to your inquiries, provide customer support, and send you important notices or 
        updates about the App.</div><div><br></div><div>c. Analytics and Research: We may use the collected information for analytical purposes,
        such as understanding User behavior, usage patterns, and preferences. This helps us improve the App, develop new features,
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


function DonationPage(){
    
    return {
        view: (vnode)=>{
            return [
                m("div",{style:"padding:1em"},
                    m("p", "This project is currently maintained by three people." )
                ),
            ]
        }
    }

}


function AuthorPage(){
    let settings = {}

    return {
        oninit:(vnode)=>{
            getSettings().then((res)=>{
                settings = res
                console.log('settings',settings)
                m.redraw()
            })
        },
        view : (vnode)=>{
            return m("div",{style:"padding:1em"},
                m("div", {style:"display:flex;flex-direction:column; padding:1em;border-radius:1em;border:1px solid lightgrey;"},
                    m("h2", "My story"),
                    settings.aboutMe  ? m.trust(settings.aboutMe) : null

                )
            )
        }
    }
}


function PhilosophyPage(){

    return {
        view: (vnode)=>{
            return [
                m("div",{style:"padding:1em"},
                    "If you give a man a fish you feed him for one day. But if you give him a fishing rod, you feed him for a lifetime."
                ),

                

            ]
        }
    }
}



function ContentShow() {
    let selectedContent = {}

    let state = 0;
    let basic_info = 0;
    let texts = 1;
    let file = 2;
    let article_texts = 3;

    
    let stageContent=[]



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
                        }, m("p",{style:"color:white;text-align:center;"},
                            "Press to change the image of the content"
                        ))
                    ),
                ]
            }
        }
    }

    function BasicInfo(){

        let categories = [
            'meditation',
            'mind',
            'philosophy',
            'science'
        ]

        return {
            view:(vnode)=>{
                return m(Grid,{verticalalign:true},
                    m(Column,{width:'2-5'},
                        m(Padding, 
                            m("img",{src:selectedContent['image'], style:"width:90%;height:auto;"})
                        )
                    
                    ),

                    m(Column,{width:'3-5', style:"align-items:center" },
                        m(Row,
                            m(Header2,{style:"margin-bottom:0px"}, selectedContent.title),

                            m("div",{style:"width:15px"}),

                            m(Chip,
                                m(Icon,{icon:'landscape'}),
                                m("div",{style:"width:10px"}),
                                m(DefaultText, selectedContent.stagenumber)
                            ) 
                        ),

                        m(DefaultText, selectedContent.description),
                        
                        //m(Icon,{icon:'book'}),

                        m(Row,
                            
                        ),

                        m("div",{style:"height:20px"}),

                        m(Button,{
                            type:'primary',
                            onclick:(e)=> {
                                state = texts
                            }
                        }, "Start reading")
                    )
                )
            }
        }
    }

    function Texts(){
        
        let page = 0
    
        let pages = 1;

        function Slide() {

            let showingBasicInfo = false;
            
            return {
                view: (vnode) => {
                    let { data, name, index } = vnode.attrs

                    console.log('DATA', data[name])
    
                    return [
                        
                        m(Card, { size: "small", style:"border:1px solid lightgrey;background-color:white;"},
                            
                            data[name].image ? 
                            m(CardMedia,{style:"padding:1.5em"},
                                m("img",{src: data[name].image})
                            ): null,

                            m(CardBody, 
                                data[name].help ? [
                                    m("div",{
                                        onclick:(e)=>showingBasicInfo=!showingBasicInfo,
                                        style: "cursor:pointer;position:absolute;right:0px;top:0px;padding:0.5em;background-color:black; border:1px solid lightgrey;"
                                    }, 
                                        m(Icon,{icon:!showingBasicInfo? 'info': 'close', color:'white',  size:'tiny'})
                                    ),
                                    m("div",{style:"height:10px;"})
                                ] : null,

                               

                                m("p",{style:"font-size:1.3rem!important"}, m.trust( showingBasicInfo ? data[name].help: data[name].text)),
                                m("div",{style:"height:10px"}),
                                m("p",{style:"float:right;"}, index+1)

                            )
                        )
                    ]
                }
            }
        }

        return {
            oninit:(vnode)=>{
                // PARA UNIFICAR EL MODELO !!!
                if(selectedContent.content && !selectedContent.text){

                    if(!selectedContent.text){
                        selectedContent.text = []
                    }

                    Object.keys(selectedContent.content).map((key)=>{
                        selectedContent.text.push(selectedContent.content[key])
                    })
                }

                if(selectedContent.text && selectedContent.text.length){
                    pages = Math.ceil(selectedContent.text.length / 4)
                }
            },
            view:(vnode)=>{
                return [                    
                    m(Padding,{horizontal:true},
                        m(Header2, selectedContent.title),
                        m(Grid, [
                            selectedContent.text ? [
                                // CAMBIAR ESTO POR NAVIGATION
                                pages > 1  ? [
                                    m(Row,
                                    // buttons for left and right navigation
                                    
                                    m(Button, {
                                        type:'default',
                                        class: page == 0 ? 'uk-disabled':'',
                                        style:"padding:1em;aspect-ratio:1;"+(page == 0 ? 'opacity:0.5':''),
                                        onclick:(e)=>{
                                            if(page > 0){
                                                page--
                                            }
                                        },
                                        }, m(Icon,{icon:'arrow_back_ios'})
                                    ),

                                    m(Button, {
                                        type:'default',
                                        class: page == pages ? 'uk-disabled':'',
                                        style:"padding:1em;aspect-ratio:1"+ (page==pages-1 ? 'opacity:0.5':''),
                                        onclick:(e)=>{
                                            console.log('PAGES',pages, page)
                                            if(page != pages-1){
                                                page++
                                            }
                                        },
                                        }, m(Icon,{icon:'arrow_forward_ios'})
                                    ),
                                

                                    m("ul",{class:"uk-dotnav",style:"margin:0 auto"},
                                    Array.from(Array(pages).keys()).map((k,i)=>{
                                        return m("li", {
                                                class: i == page ? 'uk-active':'',
                                                onclick:(e)=>{
                                                    page = i 
                                                }
                                            },
                                            m("a",{})
                                        )})
                                    ))
                                ]:  m(Row),

                                selectedContent.text.slice(page*4, (page*4)+4).map((key,i) => {
                                    return m(Column, { width: '1-4' },
                                        m(Slide, { data: selectedContent.text, name: i+(page*4), index: i + (page*4)})
                                    )
                                })
                            ] : null  
                        ])
                    )
                ]
            }
        }
    }

    function ContentList(){

        return {
            view:(vnode)=>{
                let {list} = vnode.attrs
                
                return[
                    list.map((content)=>{
                        return m(Column,{
                                width:'1-5'
                            },  m(ContentCard,{
                                content:content,
                                onclick:(e)=>{
                                    selectedContent = content
                                },
                                bottomText: 'VIEW',
                            })
                        )
                    })
                ]
            }
        }
    }

    return {
        oninit: (vnode) => {

            if(vnode.attrs.cod){
                getContentbycod(vnode.attrs.cod).then((res) => {
                    selectedContent = res;
                    m.redraw()
                })
            }

            if(vnode.attrs.stage){
                getContent(Number(vnode.attrs.stage)).then((res)=>{
                    stageContent=res.filter(c=> c.position != null && c.type != 'meditation-game').sort((a,b)=> a.position - b.position)
                    console.log('GETTING STAGE CONTENT', stageContent)
                    m.redraw()
                })
            }
            
        },
        view: (vnode) => {
            return [
                m("style", `p{font-size:1.3rem!important} div{font-size:1.3rem!important} i{font-size:1.3rem!important}`),

                selectedContent.cod ? 
                m(Padding, m(Grid,{center:true, verticalalign:true},
                    m(Column,{width:'4-6'},[
                        m(Section,{type:'muted', style:"margin:0em 1em;"},
                            stageContent.length ? 
                            m(Button,{
                                style:"margin-left:3em;margin-bottom:1em;", type:'secondary', 
                                onclick:(e)=> { state == basic_info ? selectedContent = {} : state = basic_info}
                            }, "Back") 
                            : null,

                            state == basic_info ? m(BasicInfo) : m(Texts)
                        )
                    ]),
                    m("div",{style:"height:200px"}),
                ))
                : 
            
                stageContent.length ?
                m(Padding,m(Section,{type:"muted"}, 

                    m(Padding, {horizontal:true},m(Grid,
                        m(Column,{width:'1-1'},
                            m(Header2, "Stage " + vnode.attrs.stage + ' content'),
                            m("p", "Press on view to read or practice the content"),
                        ),

                        m(Row, m("div",{style:"padding:1em; color:white; background-color:black;"}, "Lessons")),
                        
                        m(ContentList,{
                            list:stageContent.filter((a)=> a.type == contentTypes.Lesson)
                        }),
                        
                        m(Row, m("div",{style:"padding:1em; color:white; background-color:black;"},"Meditations")),
                        m(ContentList,{
                            list: stageContent.filter((a)=> a.type == contentTypes.Meditation)
                        })
                    )
                )))
                : null
            ]
        }
    }
}



export { LandingPage, Footer, TenStagesNavbar, ContentShow, SupportPage, PrivacyPage, DonationPage, AuthorPage, PhilosophyPage}