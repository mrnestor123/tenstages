import "./mithril-global.js";

import {
  AuthorPage,
  ContentShow,
  DonationPage,
  Footer,
  PhilosophyPage,
  PrivacyPage,
  SupportPage,
  TenStagesNavbar,
} from "./src/pages/landing.js"
import { LandingPage } from "./src/pages/LandingPage.js";

// Para que las rutas no necesiten el #!/ 
m.route.prefix = "";

// Rutas de la landing page
m.route(document.body, "/", {
  "/": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, LandingPage)
    },
  },

  "/support": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, SupportPage)
    },
  },

  "/author": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, AuthorPage)
    },
  },

  "/privacy": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, PrivacyPage)
    },
  },

  "/donate": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, DonationPage)
    },
  },

  "/philosophy": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, PhilosophyPage)
    },
  },

  "/content": {
    render: function (vnode) {
      return m(Layout, vnode.attrs, ContentShow)
    },
  },
})

// Layout base para todas las páginas
// Esto debería ir fuera de aqui
function Layout() {
  return {
    view: (vnode) => {
      return [
        m(TenStagesNavbar),
        vnode.children.map((child) => {
          return m("main", [
            m(child, vnode.attrs),
          ])
        }),
        m(Footer),
      ]
    },
  }
}
