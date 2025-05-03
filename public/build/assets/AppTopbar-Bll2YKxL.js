import{p as g,C as D,w as se,H as oe,B as de,a as ce,o as r,b as l,m as z,h as e,I as ne,D as ae,E as re,k as f,v as o,J as ue,K as pe,L as me,F as I,i as V,t as m,e as w,M as ve,A as R,N as fe,f as F,x as A,n as U,O as E,d as te,P as ge,Q as he}from"./app-BArZ-JoB.js";import{u as be}from"./AppFooter-DRZBUV_0.js";import{_ as le}from"./_plugin-vue_export-helper-DlAUqK2U.js";function _e(){const u=g(""),v=g([]),c=g([]),p=g([]),h=g(!1),k=g(!1),L=S(u,500),d=D(()=>v.value.length>0||c.value.length>0||p.value.length>0);se(L,t=>{t&&t.length>=3?C(t):y()});const y=()=>{v.value=[],c.value=[],p.value=[]},$=()=>{u.value.length<3&&y()},C=async t=>{if(!(!t||t.length<3)){h.value=!0,y();try{const n=await oe.get("/api/buscador",{params:{query:t}});v.value=n.data.albums||[],c.value=n.data.listaReproduccion||[],p.value=n.data.usuario||[]}catch(n){console.error("Error en la búsqueda:",n)}finally{h.value=!1}}},x=t=>{const n=document.querySelector(".contenedor-buscador");n&&!n.contains(t.target)&&(k.value=!1)};function S(t,n=300){const a=g(t.value);let b;return se(t,B=>{clearTimeout(b),b=setTimeout(()=>{a.value=B},n)}),a}return{consultaBusqueda:u,albumes:v,listasReproduccion:c,usuarios:p,cargando:h,mostrarResultados:k,hayResultados:d,alBuscar:$,limpiarResultados:y,realizarBusqueda:C,manejarClicExterno:x}}var ke=function(v){var c=v.dt;return`
.p-progressspinner {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    display: inline-block;
}

.p-progressspinner::before {
    content: "";
    display: block;
    padding-top: 100%;
}

.p-progressspinner-spin {
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: p-progressspinner-rotate 2s linear infinite;
}

.p-progressspinner-circle {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;
    stroke: `.concat(c("progressspinner.color.1"),`;
    animation: p-progressspinner-dash 1.5s ease-in-out infinite, p-progressspinner-color 6s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes p-progressspinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes p-progressspinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
@keyframes p-progressspinner-color {
    100%,
    0% {
        stroke: `).concat(c("progressspinner.color.1"),`;
    }
    40% {
        stroke: `).concat(c("progressspinner.color.2"),`;
    }
    66% {
        stroke: `).concat(c("progressspinner.color.3"),`;
    }
    80%,
    90% {
        stroke: `).concat(c("progressspinner.color.4"),`;
    }
}
`)},ye={root:"p-progressspinner",spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},Ce=de.extend({name:"progressspinner",theme:ke,classes:ye}),$e={name:"BaseProgressSpinner",extends:ce,props:{strokeWidth:{type:String,default:"2"},fill:{type:String,default:"none"},animationDuration:{type:String,default:"2s"}},style:Ce,provide:function(){return{$pcProgressSpinner:this,$parentInstance:this}}},j={name:"ProgressSpinner",extends:$e,inheritAttrs:!1,computed:{svgStyle:function(){return{"animation-duration":this.animationDuration}}}},we=["fill","stroke-width"];function xe(u,v,c,p,h,k){return r(),l("div",z({class:u.cx("root"),role:"progressbar"},u.ptmi("root")),[(r(),l("svg",z({class:u.cx("spin"),viewBox:"25 25 50 50",style:k.svgStyle},u.ptm("spin")),[e("circle",z({class:u.cx("circle"),cx:"50",cy:"50",r:"20",fill:u.fill,"stroke-width":u.strokeWidth,strokeMiterlimit:"10"},u.ptm("circle")),null,16,we)],16))],16)}j.render=xe;const Ae={class:"grupo-entrada contenedor-buscador"},Le={class:"busqueda-contenedor"},Be={key:0,class:"contenedor-resultados"},Pe={class:"resultados-busqueda"},Re={class:"seccion-resultado"},Se={key:0,class:"contenedor-carga"},qe={key:1,class:"sin-resultados"},Ee={key:2,class:"lista-resultados"},Me=["onClick"],Ne={class:"elemento-resultado"},Te=["src"],Ue={class:"info-resultado"},De={class:"titulo-resultado"},Ie={class:"subtitulo-resultado"},je={class:"subtitulo-resultado"},ze={class:"seccion-resultado"},Ve={key:0,class:"contenedor-carga"},Fe={key:1,class:"sin-resultados"},Ke={key:2,class:"lista-resultados"},We=["onClick"],He={class:"elemento-resultado"},Oe=["src"],Qe={class:"info-resultado"},Je={class:"titulo-resultado"},Ge={class:"subtitulo-resultado"},Xe={class:"seccion-resultado"},Ye={key:0,class:"contenedor-carga"},Ze={key:1,class:"sin-resultados"},es={key:2,class:"lista-resultados"},ss=["onClick"],ts={class:"elemento-resultado"},os=["src"],ns={class:"info-resultado"},as={class:"titulo-resultado"},rs={class:"subtitulo-resultado"},ls={__name:"buscador",setup(u){const v=ne(),{consultaBusqueda:c,albumes:p,listasReproduccion:h,usuarios:k,cargando:L,mostrarResultados:d,alBuscar:y,manejarClicExterno:$}=_e();ae(()=>{document.addEventListener("click",$)}),re(()=>{document.removeEventListener("click",$)});const C=t=>{d.value=!1,v.push({name:"app.album",params:{id:t.id}})},x=t=>{d.value=!1,v.push({name:"app.lista",params:{id:t.id}})},S=t=>{var b,B,M,N,T;d.value=!1;const a=(((M=(B=(b=t==null?void 0:t.roles)==null?void 0:b[0])==null?void 0:B.nombre)==null?void 0:M.toLowerCase())||((T=(N=t==null?void 0:t.rolNombre)==null?void 0:N[0])==null?void 0:T.toLowerCase()))==="artista"?"artista.perfil":"app.perfil";v.push({name:a,params:{id:(t==null?void 0:t.id)||0}})};return(t,n)=>(r(),l("div",Ae,[e("div",Le,[f(o(me),{modelValue:o(c),"onUpdate:modelValue":n[0]||(n[0]=a=>ue(c)?c.value=a:null),placeholder:"¿Qué quieres encontrar?",class:"buscador",onInput:o(y),onFocus:n[1]||(n[1]=a=>d.value=!0),onKeydown:n[2]||(n[2]=pe(a=>d.value=!1,["esc"]))},null,8,["modelValue","onInput"]),n[3]||(n[3]=e("i",{class:"pi pi-search icono-busqueda"},null,-1))]),o(d)&&o(c).length>=3?(r(),l("div",Be,[e("div",Pe,[e("div",Re,[n[4]||(n[4]=e("h3",null,"Álbumes",-1)),o(L)?(r(),l("div",Se,[f(o(j),{style:{width:"30px",height:"30px"}})])):o(p).length===0?(r(),l("div",qe," No se encontraron álbumes ")):(r(),l("ul",Ee,[(r(!0),l(I,null,V(o(p),a=>{var b;return r(),l("li",{key:"album-"+a.id,onClick:B=>C(a)},[e("div",Ne,[e("img",{src:a.portada,alt:"Portada",class:"imagen-resultado"},null,8,Te),e("div",Ue,[e("span",De,m(a.nombre),1),e("span",Ie,"Álbum • "+m((b=a.user)==null?void 0:b.name),1),e("span",je,m(a.tipo),1)])])],8,Me)}),128))]))]),e("div",ze,[n[5]||(n[5]=e("h3",null,"Listas",-1)),o(L)?(r(),l("div",Ve,[f(o(j),{style:{width:"30px",height:"30px"}})])):o(h).length===0?(r(),l("div",Fe," No se encontraron listas ")):(r(),l("ul",Ke,[(r(!0),l(I,null,V(o(h),a=>(r(),l("li",{key:"list-"+a.id,onClick:b=>x(a)},[e("div",He,[e("img",{src:a.portada,alt:"Portada",class:"imagen-resultado"},null,8,Oe),e("div",Qe,[e("span",Je,m(a.nombre),1),e("span",Ge,"Lista • "+m(a.num_canciones||0)+" canciones",1)])])],8,We))),128))]))]),e("div",Xe,[n[6]||(n[6]=e("h3",null,"Usuarios",-1)),o(L)?(r(),l("div",Ye,[f(o(j),{style:{width:"30px",height:"30px"}})])):o(k).length===0?(r(),l("div",Ze," No se encontraron usuarios ")):(r(),l("ul",es,[(r(!0),l(I,null,V(o(k),a=>(r(),l("li",{key:"user-"+a.id,onClick:b=>S(a)},[e("div",ts,[e("img",{src:a.avatar,alt:"Perfil",class:"imagen-resultado imagen-usuario"},null,8,os),e("div",ns,[e("span",as,m(a.name),1),e("span",rs,m(a.rolNombre[0]),1)])])],8,ss))),128))]))])])])):w("",!0)]))}},is=le(ls,[["__scopeId","data-v-2508f853"]]),ds={class:"layout-topbar row"},cs={class:"layout-topbar-centro col-md-6"},us={class:"buscador-container"},ps={class:"p-link layout-topbar-button layout-topbar-button-c nav-item dropdown",role:"button","data-bs-toggle":"dropdown"},ms={class:"perfil-imagen-container"},vs=["src"],fs={class:"dropdown-menu dropdown-menu-end border-0 shadow-sm"},gs={key:0},hs={key:1},bs=["disabled"],_s={class:"mobile-menu-header"},ks={class:"perfil-imagen-container-mobile"},ys=["src"],Cs={class:"perfil-info"},$s={class:"mobile-menu-links"},ws=["disabled"],xs={class:"flex justify-end gap-3"},As={__name:"AppTopbar",setup(u){const v=ve(),c=g(!1),p=R().user;g([]),be();const{processing:h,logout:k}=fe(),L=g(!1),d=g(!1),y=g(!1),$=ne(),C=g(!1),x=D(()=>{var i,s;return((s=(i=R().user)==null?void 0:i.roles)==null?void 0:s.some(_=>_.name.toLowerCase()==="admin"))||!1}),S=D(()=>({"layout-topbar-menu-mobile-active":L.value})),t=()=>{d.value=!d.value,d.value?document.body.classList.add("menu-open"):document.body.classList.remove("menu-open"),y.value&&(y.value=!1)},n=D(()=>{var i,s;return((s=(i=R().user)==null?void 0:i.roles)==null?void 0:s.length)>0?R().user.roles[0].name:""}),a=()=>{C.value=!0},b=()=>{C.value=!0,d.value=!1},B=()=>{$.push({name:"admin.index"}),d.value=!1},M=()=>{$.push({name:"app.index"}),d.value=!1},N=()=>{d.value=!1,k()},T=async()=>{c.value=!0;try{const i=await oe.post("/api/users/cambiarRol",{role:"artista"}),s=R();s.user=i.data.data,v.add({severity:"success",summary:"¡Cambio exitoso!",detail:"Ahora eres un artista y puedes empezar a subir tu música.",life:3e3}),C.value=!1,setTimeout(()=>{window.location.reload()},1500)}catch(i){console.error("Error al cambiar rol:",i),v.add({severity:"error",summary:"Error",detail:"No se pudo cambiar tu rol. Por favor, inténtalo de nuevo más tarde.",life:3e3})}finally{c.value=!1}};function K(){return(p==null?void 0:p.avatar)||"/images/default-avatar.png"}const W=()=>{window.innerWidth>500&&d.value&&(d.value=!1,document.body.classList.remove("menu-open"))},H=i=>{const s=document.querySelector(".perfil-container"),_=document.querySelector(".mobile-menu"),q=document.querySelector(".hamburger-menu");s&&!s.contains(i.target)&&y.value&&(y.value=!1),_&&q&&!_.contains(i.target)&&!q.contains(i.target)&&d.value&&(d.value=!1,document.body.classList.remove("menu-open"))};return ae(()=>{window.addEventListener("resize",W),document.addEventListener("click",H)}),re(()=>{window.removeEventListener("resize",W),document.removeEventListener("click",H),document.body.classList.remove("menu-open")}),(i,s)=>{var O,Q,J,G;const _=F("router-link"),q=F("Button"),ie=F("Dialog");return r(),l(I,null,[s[11]||(s[11]=e("div",{class:"show"},null,-1)),e("div",ds,[f(_,{to:"/app",class:"layout-topbar-logo col-md-2"},{default:A(()=>s[6]||(s[6]=[e("img",{src:"/images/logo.svg",alt:"logo"},null,-1),e("span",null,null,-1)])),_:1}),e("div",cs,[f(_,{to:"/app"},{default:A(()=>s[7]||(s[7]=[e("img",{src:"/images/home-icon.svg",alt:"",class:"layout-topbar-home-icon"},null,-1)])),_:1}),e("div",us,[f(is)]),e("div",{class:"hamburger-menu",onClick:t},s[8]||(s[8]=[e("span",null,null,-1),e("span",null,null,-1),e("span",null,null,-1)]))]),e("div",{class:U(["layout-topbar-menu col-md-4",S.value])},[f(_,{class:"topbar-link",to:{name:"app.biblioteca"}},{default:A(()=>[E(m(i.$t("Biblioteca")),1)]),_:1}),n.value==="user"?(r(),l("a",{key:0,class:"topbar-link",href:"#",onClick:a},m(i.$t("¡Conviertete en artista!")),1)):w("",!0),n.value==="artista"?(r(),te(_,{key:1,class:"topbar-link",to:"/app/artista/estadisticas"},{default:A(()=>[E(m(i.$t("Panel de artista")),1)]),_:1})):w("",!0),e("button",ps,[e("div",ms,[e("img",{src:K(),alt:"Perfil",class:"perfil-imagen"},null,8,vs)]),e("ul",fs,[e("li",null,[e("a",{class:"dropdown-item",href:"javascript:void(0)",onClick:s[0]||(s[0]=ge(P=>{var X,Y,Z,ee;return o($).push({name:((Z=(Y=(X=o(p))==null?void 0:X.roles)==null?void 0:Y[0])==null?void 0:Z.name.toLowerCase())==="artista"?"artista.perfil":"app.perfil",params:{id:(ee=o(p))==null?void 0:ee.id}})},["prevent"]))},m(i.$t("Perfil")),1)]),x.value?(r(),l("li",gs,[e("a",{class:"dropdown-item",href:"#",onClick:s[1]||(s[1]=P=>o($).push({name:"admin.index"}))},"Panel Admin")])):w("",!0),x.value?(r(),l("li",hs,[e("a",{class:"dropdown-item",onClick:s[2]||(s[2]=P=>o($).push({name:"app.index"}))},"Panel Usuario")])):w("",!0),s[9]||(s[9]=e("li",null,[e("hr",{class:"dropdown-divider"})],-1)),e("li",null,[e("a",{class:U(["dropdown-item",{"opacity-25":o(h)}]),disabled:o(h),href:"javascript:void(0)",onClick:s[3]||(s[3]=(...P)=>o(k)&&o(k)(...P))},"Cerrar sesión",10,bs)])])])],2),e("div",{class:U(["mobile-menu",{active:d.value}])},[e("div",_s,[e("div",ks,[e("img",{src:K(),alt:"Perfil",class:"perfil-imagen"},null,8,ys)]),e("div",Cs,[e("span",null,"Hola, "+m(o(R)().user.name),1)]),e("div",{class:"close-menu",onClick:t},"✕")]),e("div",$s,[f(_,{class:"mobile-link",to:{name:"app.biblioteca"},onClick:t},{default:A(()=>[E(m(i.$t("Biblioteca")),1)]),_:1}),n.value==="user"?(r(),l("a",{key:0,class:"mobile-link",href:"#",onClick:b},m(i.$t("¡Conviertete en artista!")),1)):w("",!0),n.value==="artista"?(r(),te(_,{key:1,class:"mobile-link",to:"/app/artista/estadisticas",onClick:t},{default:A(()=>[E(m(i.$t("Panel de artista")),1)]),_:1})):w("",!0),f(_,{class:"mobile-link",to:{name:((J=(Q=(O=o(p))==null?void 0:O.roles)==null?void 0:Q[0])==null?void 0:J.name.toLowerCase())==="artista"?"artista.perfil":"app.perfil",params:{id:(G=o(p))==null?void 0:G.id}},onClick:t},{default:A(()=>[E(m(i.$t("Perfil")),1)]),_:1},8,["to"]),x.value?(r(),l("a",{key:2,class:"mobile-link",href:"#",onClick:B},"Panel Admin")):w("",!0),x.value?(r(),l("a",{key:3,class:"mobile-link",href:"#",onClick:M},"Panel Usuario")):w("",!0),e("a",{class:U(["mobile-link logout",{"opacity-25":o(h)}]),disabled:o(h),href:"javascript:void(0)",onClick:N},"Cerrar sesión",10,ws)])],2),f(o(he)),f(ie,{class:"dialog_diseño",visible:C.value,"onUpdate:visible":s[5]||(s[5]=P=>C.value=P),modal:"",header:"¡Conviértete en Artista!",appendTo:".show"},{default:A(()=>[s[10]||(s[10]=e("div",{class:"mensaje_advertencia mb-6"},[e("p",{class:"text-surface-500 dark:text-surface-400"}),e("p",null," ¿Estás seguro que deseas convertirte en artista?"),e("p",null," Este cambio te permitirá subir y gestionar tu música en la plataforma."),e("p",{class:"text-warning"},"¡Importante! Este cambio no es reversible.")],-1)),e("div",xs,[f(q,{type:"button",label:"Cancelar",class:"boton_secundario",onClick:s[4]||(s[4]=P=>C.value=!1)}),f(q,{type:"button",label:"Confirmar",onClick:T})])]),_:1},8,["visible"])])],64)}}},Rs=le(As,[["__scopeId","data-v-ddafb619"]]);export{Rs as A};
