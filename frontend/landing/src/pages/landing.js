import m from "mithril";
import { Button, Card, CardBody, CardMedia, Chip, Column, Flex, Grid, Icon, Padding, Row, Section } from "../../../shared/components/components.js";
import { ContentCard } from "../../../shared/components/tenstages-components.js";
import { DefaultText, Header2 } from "../../../shared/components/texts.js";
import { contentTypes, getContent, getContentbycod } from "../../../shared/server/contentController.js";
import { getSettings } from "../../../shared/server/server.js";

import { FlexRow } from "../../../shared/components/layout.js";
import { PrivacyPage } from "./PrivacyPage.js";
import { SupportPage } from "./SupportPage.js";

// pasar a util??
let Page = {
    isMobile: false,
}

export let isMobile = false;

// COLOR veige #FFFAD5
function TenStagesNavbar() {

    let openMobileMenu = false;
    let clickedMenuButton = false;
    

    let menuOptions = [
        { name: 'Home', route: '/' },
       // { name: 'Donate', route: '/donate' },
     //   { name: 'Philosophy', route: '/philosophy' }
    ]

    window.addEventListener('resize', (e)=> {
        
        m.redraw()
    })

    return {
        view: () => {
            let route = m.route.get()
            isMobile = window.innerWidth < 1000

            console.log('route', route, route && route !='/')

            return [
                m(FlexRow,{ 
                    justifyContent: 'space-between', alignItems:'center', padding:'1em', zIndex:100, 
                    ...(route && route != '/' ? {
                        borderBottom:'1px solid lightgrey',
                        background:'white'
                    } : {
                        background:'#fffad4'
                    } )
                },[

                    m("img", { 
                        src: '/assets/logo-horizontal.png', 
                        style:  `max-height:${isMobile? '50px' :'100px'}; width:auto`, 
                        onclick:(e)=>m.route.set('/')
                    }),

                    isMobile ? 
                    m(Icon, {
                        icon: 'menu',
                        onclick: () => { 
                            openMobileMenu = !openMobileMenu; 
                            clickedMenuButton = true 
                        }
                    }) : 
                    m(FlexRow,{gap:'1em', alignItems:'center'},
                        menuOptions.map((item) => {
                            return m("a", { 
                                    style:route == item.route ? 'color:black!important;'  : 'color:grey;', 
                                    onclick: () => { m.route.set(item.route) } 
                                }, item.name)
                        }),
                        m(Button,{
                            type:"secondary",
                            style:"border-radius:1em;width:100%;",
                            onclick:(e) => { m.route.set('/donate'); openMobileMenu = false; m.redraw() }
                        }, "Donate") 

                    )
                ]),
                
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
                                    m(StoreImage, {href:"https://apps.apple.com/app/tenstages/id1592906074", src: '/assets/app-store.svg'}),
                                    m("div",{style:"height:1em;width:1em;"}),
                                    m(StoreImage, {href: "https://play.google.com/store/apps/details?id=tenStages.meditationApp", src: '/assets/google-play.svg'})
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

function DonationPage(){
    
    return {
        view: (vnode)=>{
            return [
                m("div",{style:"padding:1em 4em"},
                    m("div",{style:"height:20px"}),
                    m("p", "Our aim is to make meditation free and accessible for everyone, any help is appreciated. If you'd like to support us, you can donate through pressing the button below."),
                    
                    // create a paypal button with a link to the donation page
                    // make it more modern
                    m("div",{style:"height:20px"}),
                    m("a", {href:"https://www.paypal.com/pools/c/9eBy7RU9mQ", target:'_blank'},
                        //m(Icon,{icon:'paypal', size:'large'}),
                        m("img", {src:"https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"})
                    )
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
                            background-image:url(${data && name && data[name] ? data[name] : '/assets/buddha-sharing.webp'});
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

export { AuthorPage, ContentShow, DonationPage, Footer, PhilosophyPage, PrivacyPage, SupportPage, TenStagesNavbar };
