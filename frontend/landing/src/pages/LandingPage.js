import m from "mithril";
import { Card, CardBody, Flex, Grid, Icon, Section } from "../../../shared/components/components.js";
import { FlexCol } from "../../../shared/components/layout.js";
import { isMobile } from "./landing.js";

export function LandingPage() {

    // TELÉFONO CON EL TEXTO A LA IZQUIERDA O DERECHA
    function PhoneRow() {
        let image, title, text;

        function Text() {
            return {
                view: (vnode) => {
                    return m("div.uk-flex-column.uk-flex.uk-flex-center",
                        m("div", { style: "padding-left:2em; max-width:70%; margin:0 auto;" }, [
                            m("h1", { style: "text-align:left;" }, title),
                            m("p", { style: "text-align:left;" }, text),
                        ])
                    );
                }
            };
        }

        function Phone() {
            return {
                view: (vnode) => {
                    return m("img", {
                        src: image,
                        style: `object-fit:contain;height:70%; ${isMobile ? ' margin:0 auto' : ''}`
                    });
                }
            };
        }

        return {
            view: (vnode) => {
                let { textposition } = vnode.attrs;

                image = vnode.attrs.image;
                title = vnode.attrs.title;
                text = vnode.attrs.text;

                // HE AÑADIDO UK-FLEX PORQUE SINO NO SE CENTRABA
                return [
                    m(Grid, { childWidth: '1-2@l', verticalalign: true, center: true, style: "height:28%;position:relative;" },
                        textposition == 'right' && !isMobile ?
                            [m(Phone), m(Text)] : [m(Text), m(Phone)]
                    )
                ];
            }
        };
    }

    function InfoCard() {
        return {
            view: (vnode) => {
                let { icon, title, text } = vnode.attrs;

                return [
                    m("div.uk-width-1-3@l",
                        m(Card, { style: "min-height:200px; background-color:#F2F2F2; border-radius:15px;margin:1em; min-width:200px;" },
                            m(CardBody, { style: 'display:flex; flex-direction:column; align-items:center;' }, [
                                m(Icon, { icon: icon, style: 'font-size:60px;' }),
                                m("h2", { style: "margin-top:0em" }, title),
                                m("p", { style: "text-align:center" }, text)
                            ])
                        )
                    ),
                ];
            }
        };
    }

    return {
        oninit: (vnode) => {
            console.log('LandingPage oninit');
        },
        view: (vnode) => {
            return [
                // Imagen de montaña
                m("div", {
                    style: {
                        "background-image": "url('/assets/slider.webp')",
                        "background-size": "cover",
                        "background-position": "center",
                        "height": "100vh",
                        "width": "100vw",
                        "display": "flex",
                        "flex-direction": "column"
                    }
                }, [
                    m(Section, { type: "muted", style: " margin-top:20vh; margin-left:15vw; background-color:transparent; " }, [
                        m("div.uk-width-1-3@l.uk-width-2-3@m", [
                            m("h1", { style: "text-align:left; margin-bottom:0.5em;" }, "A journey inside yourself"),
                            //LO HE COMENTADO  PARA LA PRIMERA VERSIÓN
                            m("p", { style: "text-align:left; " }, "A complete meditation training system integrating buddhist wisdom with brain science", m("br"), m("br"), "Inspired by The Mind Illuminated"),
                        ])
                    ])
                ]),

                // Benefits de TenStages
                m(Section, { size: "small" }, [
                    m("h1", { style: "text-align:center;" }, "Benefits of using TenStages"),

                    m(Grid, { size: 'small', match: true, center: true }, [
                        m(InfoCard, { icon: 'psychology_alt', title: "Understand why", text: "Learn how your mind works and how to work with it" }),
                        m(InfoCard, { icon: 'self_improvement', title: "Practice", text: "Practice meditations from certified The Mind Illuminated teachers" }),
                        m(InfoCard, { icon: 'checklist', title: "Clear and structured", text: "Know what you are doing and why" })
                    ])
                ]),

                // Imagen del camino
                m("div", {
                    style: {
                        "background-image": "url('/assets/camino.png')",
                        "background-size": "cover",
                        "background-position": "center",
                        "height": "300vh",
                        "position": "relative",
                        "width": "100%"
                    }
                }, [
                    // PARA CUANDO ESTAMOS EN MÓVIL
                    window.innerWidth < 1200 ? m("div", { style: "height:20vh" }) : null,
                    m(PhoneRow, {
                        image: '/assets/stage1.png',
                        title: "Train in TenStages",
                        text: "Providing a step-by-step guidance from your very first sit all the way to mastery of the deepest states of peace and insight. "
                    }),

                    m(PhoneRow, {
                        image: '/assets/stage2.png',
                        title: "Understand why",
                        textposition: 'right',
                        text: "At each stage we will provide you with information about your mind based on neuroscience. We will be expanding our model all the time through the ten stages. "
                    }),

                    m(PhoneRow, {
                        image: '/assets/stage3.png',
                        title: "Practice with certified teachers",
                        text: "Listen to guided meditations, clear your doubts with our teachers and learn from the community. "
                    })
                ]),

                m(Section, { size: "small" }, [
                    m(Grid, { size: 'small', match: true, childWidth: '1-2@l', center: true, verticalalign: true }, [
                        m("div", m("img", { src: "/assets/pexels-rfstudio-3059892.jpg", style: "margin:1em;max-width:80vw; width:30vw;" })),
                        m("div", m(Flex, { direction: 'column', style: "padding:1em" },
                            m("h1", "What is TenStages?"),
                            m("p",
                                m.trust(`<p> The aim of TenStages is to give an overall understanding of what meditation is all about. We want you to understand what really is meditation, how your brain works and how you can become happier with what you have.</p>
                                </p><p> We hope that you enjoy the content and that you learn as much as we learn with everyone.  </p>
                                <p> Attentively,  </p>
                                <p> The TenStages team </p>`)
                            )
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
                m(Section, [
                    m(FlexCol, { alignItems: 'center', background: '#ECD79D', paddingBottom: '80px' }, [
                        m("h1", { style: "margin-top:64px" }, "Contact Us"),
                        m("a", { href: "mailto:" }, "support@tenstages.app")
                    ]),
                ])
            ];
        }
    };
}
