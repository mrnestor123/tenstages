
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

// TODO: required attribute
function FormLabel(){
    return {
        view:(vnode)=>{
            return m("label.uk-form-label",{
                style:"width:100%!important;color: rgba(24, 24, 29, 0.7); display: block;margin-bottom: 10px;opacity: 0.7;font-size: 12px;line-height: 20px;font-weight: 500;text-transform: uppercase;"
            }, vnode.children)
        }
    }
}


function SubHeader(){

    return {
        view:(vnode)=>{
            return m("p",{
                style:"color: rgba(0, 0, 0, .65);font-size: 16px;line-height: 24px;white-space: initial;",
            },vnode.children
            )
        }
    }
}

function Header2(){
    return{
        view:(vnode)=>{
            return m("h2.uk-heading-line",vnode.children)
        }
    }
}

function Header3(){
    return{
        view:(vnode)=>{
            return m("h3.uk-heading-line",vnode.attrs, vnode.children)
        }
    }
}


export {DefaultText, Header, SeparatedHeader, FormLabel, SubHeader, Header2, Header3}