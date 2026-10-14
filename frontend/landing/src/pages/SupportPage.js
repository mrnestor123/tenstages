import m from "mithril"
import { Section, Flex } from "../../../shared/components/components.js"

export function SupportPage() {
  return {
    view: (vnode) => {
      return [
        m(Section, [
          m(Flex,
            {
              direction: "column",
              hAlign: "center",
              style: "align-items:center; min-height:50vh;padding:1em;",
            }, [
              //m("h1", "Support page"),
              m("p","We are currently working on a FAQ and a support page. In the meantime, if you have any questions or issues, please contact us at: "),
              m("h1",
                m("a",
                  { class: "header", href: "mailto:support@tenstages.app" },
                  "support@tenstages.app"
                )
              ),
            ]
          ),
        ]),
      ]
    },
  }
}
