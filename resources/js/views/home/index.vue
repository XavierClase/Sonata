<template>
<!DOCTYPE html>
<html>
<body>
  <section class="banner">
    <div class="overlay"></div>
    <div class="iniciar_Session_Contenedor">
        <p class="iniciar_Session_P">¿tienes ya una cuenta? -></p>
        <button class="iniciar_Session_boton"  >Iniciar Sesión</button>
    </div>
    <div class="contenedor">
      <div class="contenido">
      <img src="/images/logo.svg" >
        <p class="descripcion">
          Sonata es tu nuevo hogar para disfrutar de música ilimitada. Diseñada para ofrecer una experiencia inmersiva, te permite explorar un mundo sonoro sin fronteras. Descubre artistas emergentes y tus clásicos favoritos.
        </p>
        <div class="caracteristicas">
          <div class="caracteristica">
           <img src="/images/IconoCheck.svg">
            <span>Biblioteca global accesible</span>
          </div>
          <div class="caracteristica">
            <img src="/images/IconoCheck.svg">
            <span>Interfaz moderna e intuitiva</span>
          </div>
          <div class="caracteristica">
            <img src="/images/IconoCheck.svg">
            <span>Música en cualquier dispositivo</span>
          </div>
        </div>
          <button class="boton_banner">Comenzar Gratis</button>
      </div>
      <div class="imagen_contenedor">
        <img src="/images/Captura.JPG" alt="Music Streaming" class="banner-image">
      </div>
    </div>
  </section>
</body>
</html>
</template>

<style scoped>
* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
    }

    .banner {
      position: relative;
      height: 80vh;
      background: linear-gradient(to bottom, #4338ca, #7e22ce);
      color: white;
      overflow: hidden;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    .iniciar_Session_Contenedor{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 12px 32px 0  0;
        gap: 20px;
        position: relative;
        z-index: 10;
    }

    .iniciar_Session_P{
        color: white;
        font-weight: 700;
        font-size: 16px;
    }

    .iniciar_Session_boton{
      background: linear-gradient(to right, #ec4899, #a855f7);
      padding: 12px 32px;
      border-radius: 500px;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .iniciar_Session_boton:hover{
      opacity: 0.7;
    }

    .contenedor {
      position: relative;
      z-index: 10;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 32px;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .contenido {
      width: 50%;
    }

    .contenido > * + * {
      margin-top: 24px;
    }



    .descripcion {
      font-size: 20px;
      color: #e5e7eb;
    }

    .caracteristicas {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .caracteristica {
      display: flex;
      align-items: center;
      gap: 12px;
    }

  


    .boton_banner {
      background: linear-gradient(to right, #ec4899, #a855f7);
      padding: 12px 32px;
      border-radius: 500px;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .boton_banner:hover {
      opacity: 0.7;
    }

    .imagen_contenedor {
      width: 50%;
      display: flex;
      justify-content: flex-end;
    }

    .banner-image {
      width: 500px;
      height: 400px;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transform: rotate(-6deg);
      transition: transform 0.3s;
      background-size: auto;
    }

    .banner-image:hover {
      transform: rotate(0);
    }

</style>
<!--
<template>
    <div class="demo" id="edit-demo">
        <div class="viewport" @click="select(null)" @mousedown.capture="blockEvents" @wheel.capture="blockEvents">
            <screen ref="screen">
                <g v-for="edge in graph.edges" @click.stop="select(edge)" :key="edge.id">
                    <edge :class="selection && selection.id === edge.id && 'selected'"
                          :data="edge"
                          :nodes="graph.nodes">
                    </edge>
                </g>
                <g v-for="node in graph.nodes" :key="node.id">
                    <node :data="node" ref="node" :class="isSelected(node) && 'selected'" :textSelect="node.textSelect" :useDrag="node.useDrag">
                        <div v-html="node.html" @click.stop="select(node)">
                        </div>
                    </node>
                </g>
            </screen>
        </div>
        <div class="sidebar">
            <codemirror v-model="editText" :options="{
          mode: 'text/javascript',
          theme: 'default',
          lineWrapping: true,
          scrollbarStyle: null,
          styleActiveLine: true,
          line: true,
        }"
                        style="font-size: 13.3333px; font-family: monospace; -webkit-text-size-adjust: 100%; height: 100%"
            ></codemirror>
        </div>
    </div>
</template>

<script>
import Screen from '../components/Screen.vue'
import Node from '../components/Node.vue'
import Edge from '../components/Edge.vue'
import graph from '../graph'
import pretty from 'pretty'
import stringify from 'javascript-stringify'
import { Codemirror } from 'vue-codemirror'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/lib/codemirror.css'

export default {
    components: {
        Screen,
        Node,
        Edge,
        Codemirror
    },
    data() {
        return {
            graph: new graph(),
            selection: null,
            editText: '/* click on a node or edge to start editing */',
        }
    },
    methods: {
        select (obj) {
            this.selection = obj
            if (!this.selection) {
                this.editText = '/* click on a node or edge to start editing */'
                return
            }
            const editText = { ...obj }
            delete editText.pathd
            if (editText.html) {
                editText.html = "\n" + pretty(editText.html) + "\n"
            }
            this.editText = stringify(editText, null, 2)
                .replace(/\\n/g, "\n")
                .replace(/html: '([^]*)\s'/g, 'html: `$1\n`')
        },
        applyChanges () {
            if (!this.selection) {
                return
            }
            try {
                const edit = eval('('+this.editText+')')
                Object.assign(this.selection, edit)
                this.$nextTick(() => {
                    this.$refs.node.forEach(node => {
                        node.fitContent()
                    })
                })
            } catch (_) {
                console.log('TODO invalid code')
            }
        },
        isSelected (node) {
            return this.selection
                && this.selection.id === node.id
        },
        /**
         * HACKS
         * support shortcut .no-drag and .no-wheel classes
         * to disable dragging and mouse-wheel behavior from editable html
         */
        blockEvents (e) {
            const path = e.path || e.composedPath?.();
            if (path?.find(el => el.classList?.contains('no-drag'))) { // @mousedown
                const pz = this.$refs.screen.panzoom
                pz.options.preventMouseEventsDefault = false // enable default events (text select, input click)
                document.addEventListener('mouseup', () => {
                    pz.options.preventMouseEventsDefault = true
                }, { once: true })
                e.stopPropagation() // disable node drag
            }
            if (path?.find(el => el.classList?.contains('no-wheel'))) { // @wheel
                e.stopPropagation() // disable wheel zoom
            }
        },
    },
    mounted () {
        this.graph.createNode({
            id: 'a',
            html: '<h5>A</h5>'
        })
        this.graph.createNode({
            id: 'b',
            x: 200,
            y: 200,
            textSelect: false,
            useDrag: true,
            html:
                `<div><h4>B</h4><p>Subtitle</p><button>Yo</button></div>`
        })
        this.graph.createNode({
            id: 'c',
            x: -100,
            y: 150,
            textSelect: false,
            useDrag: true,
            html: `<div> <h4>okay</h4> <textarea type="text" class="no-drag">Some text here</textarea><br/><select class="no-drag" name="cars" id="cars"><option value="volvo">Volvo</option><option value="saab">Saab</option><option value="mercedes">Mercedes</option><option value="audi">Audi</option></select></div>`
        })
        this.graph.createNode({
            id: 'd',
            x: 340,
            textSelect: false,
            useDrag: true,
            html: `<div>Okay</div>`
        })
        this.graph.createEdge({
            id: 'a:b',
            from: 'a',
            to: 'b',
            toAnchor: { x: '50%', y: '50%', snap: 'rect' },
            type: 'smooth'
        })
        this.graph.createEdge({ id: 'c:d', from: 'c', to: 'd', type: 'smooth' })
        this.$nextTick(() => {
            this.$refs.screen.zoomNodes(this.graph.nodes, {scale: 1})
        })
    },
    watch: {
        editText: 'applyChanges',
    },
}
</script>

<style>
#edit-demo .CodeMirror {
    width: 100%;
    height: 500px;
    margin: 0;
    overflow: hidden;
    position: relative;
    background-color: #f1f1f1;
    border: 1px solid #f1f1f1;
}
#edit-demo .node .background {
    /* background-color: #ccc; */
}

#edit-demo .node .content > div {
    padding: 25px;
}

#edit-demo .node .content h4,h5,p {
    margin: 0
}

#edit-demo .node:hover .background {
    background-color: rgb(90 200 90);
}

#edit-demo .node.selected .content {
    background-color: rgba(100, 200, 100, 1);
    box-shadow: 0px 0px 0px 2px #333;
}

#edit-demo .node .content {
    cursor: pointer;
}

#edit-demo .edge {
    cursor: pointer;
}
#edit-demo .edge:hover {
    /* stroke-width: 4 */
    stroke: rgb(90 200 90)
}
#edit-demo .edge.selected {
    /* stroke-width: 4 */
    stroke: #333
}
</style>
-->
