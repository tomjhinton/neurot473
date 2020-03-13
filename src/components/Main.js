import React from 'react'
import axios from 'axios'
const THREE = require('three')
import TweenMax from 'gsap'


import * as vertexShader from './vertexShader.vert'
import * as fragmentShader from './fragmentShader.frag'




class Main extends React.Component{
  constructor(){
    super()
    this.state = {
      data: {},
      error: ''

    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.mouseMove = this.mouseMove.bind(this)






  }


  componentDidMount(){
    axios.get('/api/works')
      .then(res => {
        this.setState({works: res.data})
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0xffffff )
        scene.add( new THREE.AmbientLight( 0x666666 ) )
        const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.5, 10000 )
        camera.position.x=0
        camera.position.y=1
        camera.position.z=25
        scene.add( camera )
        const light = new THREE.DirectionalLight( 0xffffff, 0.5 )
        scene.add(light)
        const renderer = new THREE.WebGLRenderer({alpha: true})
        renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.appendChild( renderer.domElement )
        let texture, texture2
        if(this.state.works){
          texture = new THREE.TextureLoader().load( `data:image/png;base64,  ${this.state.works[0].dat.slice(2).slice(0, -1)}` )
          texture2 = new THREE.TextureLoader().load( `data:image/png;base64,  ${this.state.works[1].dat.slice(2).slice(0, -1)}` )
        }

        const geometry = new THREE.PlaneBufferGeometry(16, 8, 1, 1)
        let material2 = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, map: texture, side: THREE.DoubleSide } )
        const mouse = new THREE.Vector2(0, 0)
        const uniforms = {
          u_image: { type: 't', value: texture },
          u_imagehover: { type: 't', value: texture2 },
          u_mouseX: { value: Math.abs(mouse.x) },
          u_mouseY: { value: Math.abs(mouse.Y) },
          u_time: { value: 0 },
          u_res: { value: new THREE.Vector2(window.innerWidth/2, window.innerHeight/2) }
        }

        const material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          defines: {
            PR: window.devicePixelRatio.toFixed(1)

          },
          side: THREE.DoubleSide,
          transparent: true
        })

        const mesh1 = new THREE.Mesh(geometry, material)
        const mesh2 = new THREE.Mesh(geometry, material2)




        scene.add(mesh1, mesh2)

        window.addEventListener('mousemove', (ev) => {
          onMouseMove(ev)
        })



        function onMouseMove(event) {
          TweenMax.to(mouse, 0.5, {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
          })

          TweenMax.to(mesh1.rotation, 0.5, {
            x: -mouse.y * 0.3,
            y: mouse.x * (Math.PI / 6)
          })
          TweenMax.to(mesh2.rotation, 0.5, {
            x: -mouse.y * 0.3,
            y: mouse.x * (Math.PI / 6)
          })

          console.log(mouse.x)
          uniforms.u_mouseX.value = Math.abs(mouse.x)
          uniforms.u_mouseY.value = Math.abs(mouse.y)
        }


        function animate() {
          scene.rotation.x+=0.01
          uniforms.u_time.value += 0.01
          /* render scene and camera */
          renderer.render(scene,camera)
          requestAnimationFrame(animate)
        }



        requestAnimationFrame(animate)


      })

  }

  componentDidUpdate(){



  }

  mouseMove(e){

    //console.log(e)

    this.setState({bass: `${e.screenX /100000} ${e.screenY /100000} `, scale: `${e.screenY /2}` })
  }




  render() {



    return (
      <div onMouseMove={this.mouseMove} className="body">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="svg-filters">
          <defs>
            <filter id="filter">
              <feTurbulence type="fractalNoise" baseFrequency={this.state.bass} numOctaves="5" result="warp"></feTurbulence>
              <feDisplacementMap xChannelSelector="R" yChannelSelector="B" scale={this.state.scale} in="SourceGraphic" in2="warpOffset" />
            </filter>

          </defs>
        </svg>
        <h1 className="text"  onMouseMove={this.mouseMove}>The intersection of art  and technology</h1>




      </div>




    )
  }
}
export default Main
