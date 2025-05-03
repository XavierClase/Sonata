import{B as H,s as V,a as R,m as h,o as i,b as o,d as y,n as C,r as N,e as p,t as I,f as A,h as s,F as M,i as P,j as W,k as w,u as T,l as U,p as L,q as G,w as _,v as S,x as B,y as J,z as Q,T as X,A as K,C as D,S as Y}from"./app-BArZ-JoB.js";import{A as Z}from"./AppTopbar-Bll2YKxL.js";import{u as q,A as ee}from"./AppFooter-DRZBUV_0.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";var te=function(r){var t=r.dt;return`
.p-breadcrumb {
    background: `.concat(t("breadcrumb.background"),`;
    padding: `).concat(t("breadcrumb.padding"),`;
    overflow-x: auto;
}

.p-breadcrumb-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: `).concat(t("breadcrumb.gap"),`;
}

.p-breadcrumb-separator {
    display: flex;
    align-items: center;
    color: `).concat(t("breadcrumb.separator.color"),`;
}

.p-breadcrumb-separator-icon:dir(rtl) {
    transform: rotate(180deg);
}

.p-breadcrumb::-webkit-scrollbar {
    display: none;
}

.p-breadcrumb-item-link {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: `).concat(t("breadcrumb.item.gap"),`;
    transition: background `).concat(t("breadcrumb.transition.duration"),", color ").concat(t("breadcrumb.transition.duration"),", outline-color ").concat(t("breadcrumb.transition.duration"),", box-shadow ").concat(t("breadcrumb.transition.duration"),`;
    border-radius: `).concat(t("breadcrumb.item.border.radius"),`;
    outline-color: transparent;
    color: `).concat(t("breadcrumb.item.color"),`;
}

.p-breadcrumb-item-link:focus-visible {
    box-shadow: `).concat(t("breadcrumb.item.focus.ring.shadow"),`;
    outline: `).concat(t("breadcrumb.item.focus.ring.width")," ").concat(t("breadcrumb.item.focus.ring.style")," ").concat(t("breadcrumb.item.focus.ring.color"),`;
    outline-offset: `).concat(t("breadcrumb.item.focus.ring.offset"),`;
}

.p-breadcrumb-item-link:hover .p-breadcrumb-item-label {
    color: `).concat(t("breadcrumb.item.hover.color"),`;
}

.p-breadcrumb-item-label {
    transition: inherit;
}

.p-breadcrumb-item-icon {
    color: `).concat(t("breadcrumb.item.icon.color"),`;
    transition: inherit;
}

.p-breadcrumb-item-link:hover .p-breadcrumb-item-icon {
    color: `).concat(t("breadcrumb.item.icon.hover.color"),`;
}
`)},ie={root:"p-breadcrumb p-component",list:"p-breadcrumb-list",homeItem:"p-breadcrumb-home-item",separator:"p-breadcrumb-separator",separatorIcon:"p-breadcrumb-separator-icon",item:function(r){var t=r.instance;return["p-breadcrumb-item",{"p-disabled":t.disabled()}]},itemLink:"p-breadcrumb-item-link",itemIcon:"p-breadcrumb-item-icon",itemLabel:"p-breadcrumb-item-label"},ne=H.extend({name:"breadcrumb",theme:te,classes:ie}),ae={name:"BaseBreadcrumb",extends:R,props:{model:{type:Array,default:null},home:{type:null,default:null}},style:ne,provide:function(){return{$pcBreadcrumb:this,$parentInstance:this}}},F={name:"BreadcrumbItem",hostName:"Breadcrumb",extends:R,props:{item:null,templates:null,index:null},methods:{onClick:function(r){this.item.command&&this.item.command({originalEvent:r,item:this.item})},visible:function(){return typeof this.item.visible=="function"?this.item.visible():this.item.visible!==!1},disabled:function(){return typeof this.item.disabled=="function"?this.item.disabled():this.item.disabled},label:function(){return typeof this.item.label=="function"?this.item.label():this.item.label},isCurrentUrl:function(){var r=this.item,t=r.to,v=r.url,u=typeof window<"u"?window.location.pathname:"";return t===u||v===u?"page":void 0}},computed:{ptmOptions:function(){return{context:{item:this.item,index:this.index}}},getMenuItemProps:function(){var r=this;return{action:h({class:this.cx("itemLink"),"aria-current":this.isCurrentUrl(),onClick:function(v){return r.onClick(v)}},this.ptm("itemLink",this.ptmOptions)),icon:h({class:[this.cx("icon"),this.item.icon]},this.ptm("icon",this.ptmOptions)),label:h({class:this.cx("label")},this.ptm("label",this.ptmOptions))}}}},re=["href","target","aria-current"];function le(e,r,t,v,u,n){return n.visible()?(i(),o("li",h({key:0,class:[e.cx("item"),t.item.class]},e.ptm("item",n.ptmOptions)),[t.templates.item?(i(),y(N(t.templates.item),{key:1,item:t.item,label:n.label(),props:n.getMenuItemProps},null,8,["item","label","props"])):(i(),o("a",h({key:0,href:t.item.url||"#",class:e.cx("itemLink"),target:t.item.target,"aria-current":n.isCurrentUrl(),onClick:r[0]||(r[0]=function(){return n.onClick&&n.onClick.apply(n,arguments)})},e.ptm("itemLink",n.ptmOptions)),[t.templates&&t.templates.itemicon?(i(),y(N(t.templates.itemicon),{key:0,item:t.item,class:C(e.cx("itemIcon",n.ptmOptions))},null,8,["item","class"])):t.item.icon?(i(),o("span",h({key:1,class:[e.cx("itemIcon"),t.item.icon]},e.ptm("itemIcon",n.ptmOptions)),null,16)):p("",!0),t.item.label?(i(),o("span",h({key:2,class:e.cx("itemLabel")},e.ptm("itemLabel",n.ptmOptions)),I(n.label()),17)):p("",!0)],16,re))],16)):p("",!0)}F.render=le;var j={name:"Breadcrumb",extends:ae,inheritAttrs:!1,components:{BreadcrumbItem:F,ChevronRightIcon:V}};function oe(e,r,t,v,u,n){var k=A("BreadcrumbItem"),m=A("ChevronRightIcon");return i(),o("nav",h({class:e.cx("root")},e.ptmi("root")),[s("ol",h({class:e.cx("list")},e.ptm("list")),[e.home?(i(),y(k,h({key:0,item:e.home,class:e.cx("homeItem"),templates:e.$slots,pt:e.pt,unstyled:e.unstyled},e.ptm("homeItem")),null,16,["item","class","templates","pt","unstyled"])):p("",!0),(i(!0),o(M,null,P(e.model,function(d,b){return i(),o(M,{key:d.label+"_"+b},[e.home||b!==0?(i(),o("li",h({key:0,class:e.cx("separator"),ref_for:!0},e.ptm("separator")),[W(e.$slots,"separator",{},function(){return[w(m,h({"aria-hidden":"true",class:e.cx("separatorIcon"),ref_for:!0},e.ptm("separatorIcon")),null,16,["class"])]})],16)):p("",!0),w(k,{item:d,index:b,templates:e.$slots,pt:e.pt,unstyled:e.unstyled},null,8,["item","index","templates","pt","unstyled"])],64)}),128))],16)],16)}j.render=oe;const se={key:0},ce={key:0,class:"layout-menuitem-root-text"},ue=["href","target"],me={class:"layout-menuitem-text"},de={key:0,class:"pi pi-fw pi-angle-down layout-submenu-toggler"},be={class:"layout-menuitem-text"},pe={key:0,class:"pi pi-fw pi-angle-down layout-submenu-toggler"},he={class:"layout-submenu"},fe={__name:"AppMenuItem",props:{item:{type:Object,default:()=>({})},index:{type:Number,default:0},root:{type:Boolean,default:!0},parentItemKey:{type:String,default:null}},setup(e){const{can:r}=T(),t=U(),{layoutConfig:v,layoutState:u,setActiveMenuItem:n,onMenuToggle:k}=q(),m=e,d=L(!1),b=L(null);G(()=>{b.value=m.parentItemKey?m.parentItemKey+"-"+m.index:String(m.index);const a=u.activeMenuItem;d.value=a===b.value||a?a.startsWith(b.value+"-"):!1}),_(()=>v.activeMenuItem.value,a=>{d.value=a===b.value||a.startsWith(b.value+"-")});const O=(a,c)=>{if(c.disabled){a.preventDefault();return}const{overlayMenuActive:f,staticMenuMobileActive:g}=u;(c.to||c.url)&&(g.value||f.value)&&k(),c.command&&c.command({originalEvent:a,item:c});const l=c.items?d.value?m.parentItemKey:b:b.value;n(l)},E=a=>t.path===a.to;return(a,c)=>{const f=A("router-link"),g=A("app-menu-item",!0);return e.root||e.item.permision==="all"||S(r)(e.item.permision)?(i(),o("div",se,[s("li",{class:C({"layout-root-menuitem":e.root,"active-menuitem":d.value})},[e.root&&e.item.visible!==!1?(i(),o("div",ce,I(e.item.label),1)):p("",!0),(!e.item.to||e.item.items)&&e.item.visible!==!1?(i(),o("a",{key:1,href:e.item.url,onClick:c[0]||(c[0]=l=>O(l,e.item,e.index)),class:C(e.item.class),target:e.item.target,tabindex:"0"},[s("i",{class:C([e.item.icon,"layout-menuitem-icon"])},null,2),s("span",me,I(e.item.label),1),e.item.items?(i(),o("i",de)):p("",!0)],10,ue)):p("",!0),e.item.to&&!e.item.items&&e.item.visible!==!1?(i(),y(f,{key:2,onClick:c[1]||(c[1]=l=>O(l,e.item,e.index)),class:C([e.item.class,{"active-route":E(e.item)}]),tabindex:"0",to:e.item.to},{default:B(()=>[s("i",{class:C([e.item.icon,"layout-menuitem-icon"])},null,2),s("span",be,I(e.item.label),1),e.item.items?(i(),o("i",pe)):p("",!0)]),_:1},8,["class","to"])):p("",!0),e.item.items&&e.item.visible!==!1?(i(),y(X,{key:3,name:"layout-submenu"},{default:B(()=>[J(s("ul",he,[(i(!0),o(M,null,P(e.item.items,(l,x)=>(i(),y(g,{key:l,index:x,item:l,parentItemKey:b.value,root:!1},null,8,["index","item","parentItemKey"]))),128))],512),[[Q,e.root?!0:d.value]])]),_:1})):p("",!0)],2)])):p("",!0)}}},ve={class:"relative overflow-hidden w-full p-link flex align-items-center p-2 pl-0 text-color hover:surface-200 border-noround"},ye={class:"inline-flex flex-column"},ke={class:"font-bold"},ge={class:"text-sm mr-2"},Ce={class:"layout-menu"},we={key:1,class:"menu-separator"},Ie={__name:"AppMenu",setup(e){T(),K();const r=L([{label:"Home",permision:"all",items:[{label:"Dashboard",icon:"pi pi-fw pi-home",to:"/admin",permision:"all"}]},{label:"Usuarios",items:[{label:"Users",icon:"pi pi-fw pi-id-card",to:"/admin/users",permision:"user-list"},{label:"Roles",icon:"pi pi-fw pi-check-square",to:"/admin/roles",permision:"role-list"},{label:"Permisos",icon:"pi pi-fw pi-bookmark",to:"/admin/permissions",permision:"permission-list"}]},{label:"Posts",items:[{label:"Posts",icon:"pi pi-fw pi-id-card",to:"/admin/posts",permision:"post-list"},{label:"Categorias",icon:"pi pi-fw pi-id-card",to:"/admin/categories",permision:"category-list"}]},{label:"Musica",items:[{label:"Albums",icon:"pi pi-fw pi-headphones",to:"/admin/albumes",permision:"role-list"},{label:"Canciones",icon:"pi pi-fw pi-play-circle",to:"/admin/canciones",permision:"role-list"},{label:"Listas",icon:"pi pi-fw pi-file",to:"/admin/listas",permision:"role-list"}]}]);return(t,v)=>{var n,k,m;const u=A("Avatar");return i(),o(M,null,[s("button",ve,[w(u,{image:(n=S(K)().user)==null?void 0:n.avatar,class:"mr-3",shape:"circle"},null,8,["image"]),s("span",ye,[s("span",ke,I((k=S(K)().user)==null?void 0:k.name),1),s("span",null,[(i(!0),o(M,null,P((m=S(K)().user)==null?void 0:m.roles,d=>(i(),o("span",ge,I(d.name),1))),256))])])]),s("ul",Ce,[(i(!0),o(M,null,P(r.value,(d,b)=>(i(),o(M,{key:d},[d.separator?p("",!0):(i(),y(fe,{key:0,item:d,index:b},null,8,["item","index"])),d.separator?(i(),o("li",we)):p("",!0)],64))),128))])],64)}}},xe={__name:"AppSidebar",setup(e){return(r,t)=>(i(),y(Ie))}},Me={class:"layout-sidebar"},Ae={class:"layout-main-container"},Se={class:"card mb-2 bread"},Be=["href","onClick"],Le={class:"text-primary font-semibold"},Oe=["href","target"],$e={class:"text-color"},Ke={class:"layout-main"},Re={__name:"Authenticated",setup(e){const r=U(),t=L({icon:"pi pi-home",route:"/admin"}),v=D(()=>{let a=r.path.split("/");return a.shift(),a.reduce((f,g,l)=>{var x,$;return f.push({route:f[l-1]?""+f[l-1].route+"/"+g:"/"+g,label:((x=r.matched[l])==null?void 0:x.meta.breadCrumb)||g,disabled:l+1===a.length||(($=r.matched[l])==null?void 0:$.meta.linked)===!1}),f},[])}),{layoutConfig:u,layoutState:n,isSidebarActive:k}=q(),m=L(null);_(k,a=>{a?b():O()});const d=D(()=>({"layout-theme-light":u.darkTheme.value==="light","layout-theme-dark":u.darkTheme.value==="dark","layout-overlay":u.menuMode.value==="overlay","layout-static":u.menuMode.value==="static","layout-static-inactive":n.staticMenuDesktopInactive.value&&u.menuMode.value==="static","layout-overlay-active":n.overlayMenuActive.value,"layout-mobile-active":n.staticMenuMobileActive.value,"p-input-filled":u.inputStyle.value==="filled","p-ripple-disabled":!u.ripple.value})),b=()=>{m.value||(m.value=a=>{E(a)&&(n.overlayMenuActive.value=!1,n.staticMenuMobileActive.value=!1,n.menuHoverActive.value=!1)},document.addEventListener("click",m.value))},O=()=>{m.value&&(document.removeEventListener("click",m),m.value=null)},E=a=>{const c=document.querySelector(".layout-sidebar"),f=document.querySelector(".layout-menu-button");return!(c.isSameNode(a.target)||c.contains(a.target)||f.isSameNode(a.target)||f.contains(a.target))};return(a,c)=>{const f=A("router-link"),g=A("router-view");return i(),o("div",{class:C(["layout-wrapper",d.value])},[w(Z),s("div",Me,[w(xe)]),s("div",Ae,[s("div",Se,[w(S(j),{home:t.value,model:v.value},{item:B(({item:l,props:x})=>[l.route?(i(),y(f,{key:0,to:l.route,custom:""},{default:B(({href:$,navigate:z})=>[s("a",h({href:$},x.action,{class:"btn btn-link",onClick:z}),[s("span",{class:C([l.icon,"text-color"])},null,2),s("span",Le,I(l.label),1)],16,Be)]),_:2},1032,["to"])):(i(),o("a",h({key:1,href:l.url,target:l.target},x.action),[s("span",$e,I(l.label),1)],16,Oe))]),_:1},8,["home","model"])]),s("div",Ke,[(i(),y(Y,null,{default:B(()=>[w(g)]),_:1}))]),w(ee)]),c[0]||(c[0]=s("div",{class:"layout-mask"},null,-1))],2)}}};export{Re as default};
