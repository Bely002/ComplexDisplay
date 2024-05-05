import * as THREE from 'three';
import * as math from 'mathjs'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const areasize = 10
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282c34)
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 5, 5, 10 );
controls.update();

const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper )

function mapArgToColor(arg) {
    var normalizedArg = (arg + Math.PI) / (2 * Math.PI);
    var color1 = new THREE.Color(1, 0, 0); // Red
    var color2 = new THREE.Color(0, 1, 0); // Green
    var color3 = new THREE.Color(0, 0, 1); // Blue
    var interpolatedColor;
    if (normalizedArg < 0.5) {
        interpolatedColor = new THREE.Color().lerpColors(color1, color2, normalizedArg * 2);
    } else {
        interpolatedColor = new THREE.Color().lerpColors(color2, color3, (normalizedArg - 0.5) * 2);
    }

    return interpolatedColor;
}

function module(x){
    return math.sqrt(x.re**2+x.im**2)
}

function displayFunction(f){
    let arrayResults = []
    let arrayColors= []
    for(let x=-areasize;x<areasize;x+=0.1){
        for(let y=-areasize;y<areasize;y+=0.1){
            const result = f(`${x} + ${y}i`)
            arrayResults.push(x,module(result),y)
            const color=mapArgToColor(result.arg())
            arrayColors.push(color.r,color.g,color.b)
        }
    }
    const vertices = new Float32Array(arrayResults)
    const colors = new Float32Array(arrayColors)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.1, vertexColors:true });
    const curve = new THREE.Points(geometry, material);
    scene.add( curve );
    return curve
}
function removePoints(curve) {
    scene.remove(curve);
    curve.geometry.dispose();
    curve.material.dispose();
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

animate()

let curvesaved
input.addEventListener("input",(e)=>{
    if(!input.value.startsWith('f(S)=')){
        input.value='f(S)='
    }
})
const buttonSubmit = document.getElementById("submitFunction")
buttonSubmit.addEventListener("click",async ()=>{
    if(curvesaved!=null){
        removePoints(curvesaved)
    }
    const getExpression = new Function('s',`const expression=input.value.split("=")[1].replace(/S/g,s);  return expression`)
    const f = (s)=> {return math.complex(math.evaluate(getExpression(s)))}
    curvesaved= displayFunction(f)
})