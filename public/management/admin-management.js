import { Button, Column, Flex, Grid, Section } from "../components/components.js"

function AdminManagement() {
    return {
        view: (vnode) => {
            return [
                m(AdminNavbar),
                m(Grid, {size:"small"}, [
                    m(Column, {width:"1-5", style:"background-color:white;height:100vh"}, [
                        m(Sidebar)
                    ]),
                    m(Column, {width:"4-5", style:"background-color:F5F6FC;height:100vh"}, [
                        m(Section, { style:"background-color:white;height:100vh;padding:20px;margin:25px;border-radius:20px"}, [
                            m("h1", "Email")
                        ])
                    ]),
                ])
            ]
        }
    }

    function Sidebar() {
        return {
            view: (vnode) => {
                return [
                    m(Flex, {direction:"column", style:""}, [
                        m("div.uk-grid-small uk-flex-middle", {"uk-grid":"", style:"padding:20px"}, [
                            m("div.uk-width-auto", [
                                m("img.uk-border-circle", {width:"50", height:"50", src:"./assets/logo-tenstages.png", alt:"Avatar"})
                            ]),
                            m("div.uk-width-expand", [
                                m("h3.uk-card-title.uk-margin-remove-bottom", "Pepe Perez"),
                                m("p.uk-text-meta.uk-margin-remove-top", "Admin")
                            ])
                        ]),
                        m(Button, {style:"background-color:white;margin-top:50px"}, "Users"),
                        m(Button, {style:"background-color:white"}, "Email"),
                        m(Button, {style:"background-color:white"}, "Courses"),
                        m(Button, {style:"background-color:white"}, "Content"),
                        m(Button, {style:"background-color:white"}, "Stages"),
                    ])
                ]
            }
        }
    }

    function AdminNavbar() {
        return {
            view: (vnode) => {
                return [
                        m("nav.uk-navbar-container", { 'uk-navbar': '', style:"height:95px;background-color: white" },
                            m("nav", { 'uk-navbar': '', style: "width:100%;background-color:2C2C2C" },
                                m(".uk-navbar-center",
                                    m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages-white.png', style: "max-height:95px; width:auto" })),
                                )
                            )
                        )

                ]
            }
        }
    }
}

export { AdminManagement }
