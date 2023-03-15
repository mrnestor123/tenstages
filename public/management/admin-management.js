import { Button, Column, Flex, Grid, Section, TextField, Select } from "../components/components.js"
import { api_get } from "../util/util.js"
import * as htmlConverter from 'https://cdn.jsdelivr.net/npm/@eraserlabs/quill-delta-to-html@0.12.1/+esm';
//import { htmlConverter } from "quill-delta-to-html"

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
                            m(EmailTool)
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

function EmailTool() {

    let quill;
    let converter;

    let emailData = {
        emails: [],
        subject: "",
        message: ""
    }
    let emails = [];

    return {
        oninit: async () => {

            /**
             * Sacar todos los usuarios de admin.auth. véase https://bigcodenerd.org/get-all-users-auth-firebase-cloud-functions/#:~:text=To%20get%20all%20the%20users,lot%20of%20functionality%20built%2Din.
             */
            let authUsers = await api_get("http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default/users/auth");
            let users = await api_get("http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default/users/");

            // New object with with coduser, email and role properties
            emails = authUsers.users.map( u => {
                return {
                    coduser: u.uid,
                    email: u.email,
                    role: users.find(u2 => u2.coduser === u.uid) ? users.find(u2 => u2.coduser === u.uid).role : "meditator"
                }
            }); 

        },
        view: () => {
            return [

                m("h1", "Email tool"),

                m("h4", "Emails:"),
                m(Select, {data: emailData, name: "emails"}, ["Teachers", "All", "Prueba"]),

                m("h4", "Subject:"),
                m(TextField, {data: emailData, name: "subject"}),

                m("h4", "Message:"),
                m('div', {
                    style: "height:320px",
                    oncreate: () => {
                        let cfg = {
                            placeholder: "Edit this text",
                            modules: {
                                toolbar: [
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    [{ 'color': [] }, { 'background': [] }],       
                                    ["bold", "italic", "underline", "strike", "blockquote", "link", "image", "clean"],
                                    ["list"]
                                ]
                            },
                            theme: "snow"
                        }
                        quill = new Quill('#editor', cfg);
                    },
                    oninput: (e) => {
                        let delta = quill.getContents();
                        let QuillDeltaToHtmlConverter = htmlConverter.QuillDeltaToHtmlConverter;
                        let converter = new QuillDeltaToHtmlConverter(delta.ops, {encodeHtml: false});
                        emailData.message = converter.convert();
                    }, 
                    id:'editor'}
                ),

                m(Button, { type:"primary", disabled:true, style:"margin-top:20px", onclick: () => sendEmail(emailData) }, "Send email")
            ]
        }
    }

    function sendEmail(emailData) {
        if(emailData.emails === "Teachers") {
            //emailData.emails = ["pepeperezvalenzuela@gmail.com", "pisitoreviews@gmail.com"]
            emailData.emails = emails.filter(u => u.role === "teacher").map(u => u.email);
        } else if (emailData.emails === "All") {
            emailData.emails = emails.map(u => u.email);
        } else {
            emailData.emails = ["pisitoreviews@gmail.com"]
        }
        api_get("http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default/email/", "POST", emailData)
    }
}

export { AdminManagement }
