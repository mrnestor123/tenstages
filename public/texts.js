
// hay que crear responsive textos

function DefaultText() {
    return{
        view:(vnode)=>{
            return m("div.uk-text-default",vnode.children)
        }
    }
}

// size can be small,medium, large,xlarge, 2xlarge
function Header() {
    return {
        view:(vnode)=>{
            return m(`h2.uk-heading-${vnode.attrs.size || 'small'}`,vnode.children)
       }
    }
}

// HAY QUE HACER LA SEPARACIÓN D E IZQUIERDA A DERECHA
function SeparatedHeader() {
    return {
        view:(vnode)=>{
            return m("h1.uk-heading-line",vnode.children)
        }
    }

}

export { DefaultText, Header, SeparatedHeader }