import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import * as THREE from 'three/build/three.modules';
// import {Math as ThreeMath} from 'three/build/three.modules' 
// should also work to avoid name clashes.
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Geometry,
  MeshLambertMaterial,
  MeshBasicMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  Vector3,
  Face3
} from 'three';

import TMD from '../formats/TMD.js';

class PolytronScene extends Component {
  constructor() {
    super();
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    // creating webgl renderer
    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(0xffffff, 0);
    // creating scene that will contain our meshes
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, this.WIDTH / this.HEIGHT, 0.1, 1000);

    // at the moment only one "test" material for rendering
    // this.material = new MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    this.material = new MeshLambertMaterial({ color: 0x691E30, overdraw: 0.5 });

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 200;

    // var pointLight = new PointLight( 0xff0000, 1, 100 );
    var directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    // pointLight.position.set( 10, 10, 10 );
    this.scene.add(directionalLight);
    this.scene.add(new AmbientLight(0x00020));

    this.renderWebGL = this.renderWebGL.bind(this);
    this.loadModel = this.loadModel.bind(this);
    this.request = this.request.bind(this);
  }

  request(url) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";

      if (req.overrideMimeType) {
        req.overrideMimeType('text/plain; charset=x-user-defined');
      }
      else {
        req.setRequestHeader('Accept-Charset', 'x-user-defined');
      }

      req.onload = function (ev) {
        if (req.status == 200) {
          resolve(req.response);
        }
      };

      req.send();
    });
  }

  loadModel(path){
    this.request(path)
      .then((data) => {
        // remove previous mesh if not null
        if(this.mesh){
          this.scene.remove(this.mesh);
        }

        var offset = 0;
        var headerStruct = TMD.createHeader();
        // console.log(headerStruct);
        var header = headerStruct.readStructs(data, 0, 1)[0];
        offset += headerStruct.byteLength;
        console.log(header);

        console.log("# OBJECT LIST START = " + offset);

        var objectStruct = TMD.createObject();
        var objects = objectStruct.readStructs(data, offset, header.numObjects);
        offset += objectStruct.byteLength * header.numObjects;
        console.log(objects);

        console.log("# PRIMITIVE LIST START = " + offset);

        for (var i = 0; i < objects.length; i++) {
          for (var j = 0; j < objects[i].numPrimitives; j++) {
            // read primitive data
            if (!objects[i].primitives) {
              objects[i].primitives = [];
            }

            var primitiveStruct = TMD.createPrimitive();
            objects[i].primitives.push(primitiveStruct.readStructs(data, offset, 1)[0]);
            offset += primitiveStruct.byteLength;

            // read the correct packet data based on olen,ilen,flag,mode

            var primitive = objects[i].primitives[j];

            // 3 vertex polygon with light source calcs
            // flat, no texture (solid)
            if (
              primitive.olen == 0x04 &&
              primitive.ilen == 0x03 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x20
            ) {
              console.log("3 vertex primitive with light source - flat, no texture");
            }
            // gouraud, no texture (solid)
            else if
                        (
              primitive.olen == 0x06 &&
              primitive.ilen == 0x04 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x30
            ) {
              console.log("3 vertex primitive with light source - gouraud, no texture");

              var customPrimitiveStruct = TMD.createPrimitiveData_3_Gouraud_Notex_Solid();
              primitive.data = customPrimitiveStruct.readStructs(data, offset, 1)[0];
              offset += customPrimitiveStruct.byteLength;
            }
            // flat, no texture (gradation)
            else if
                        (
              primitive.olen == 0x06 &&
              primitive.ilen == 0x05 &&
              primitive.flag == 0x04 &&
              primitive.mode == 0x20
            ) {
              console.log("3 vertex primitive with light source - flat, no texture (gradation)");
            }
            // gouraud, no texture (gradation)
            else if
                        (
              primitive.olen == 0x06 &&
              primitive.ilen == 0x06 &&
              primitive.flag == 0x04 &&
              primitive.mode == 0x30
            ) {
              console.log("3 vertex primitive with light source - gouraud, no texture (gradation)");
            }
            // flat, texture
            else if
                        (
              primitive.olen == 0x07 &&
              primitive.ilen == 0x05 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x24
            ) {
              console.log("3 vertex primitive with light source - flat, textured");
            }
            // gouraud, texture
            else if
                        (
              primitive.olen == 0x09 &&
              primitive.ilen == 0x06 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x34
            ) {
              console.log("3 vertex primitive with light source - gouraud, textured");

              var customPrimitiveStruct = TMD.createPrimitiveData_3_Gouraud_Tex();
              primitive.data = customPrimitiveStruct.readStructs(data, offset, 1)[0];
              offset += customPrimitiveStruct.byteLength;
            }
            // 4 vertices polygon with light source calcs
            // flat, no texture (solid)
            else if (
              primitive.olen == 0x05 &&
              primitive.ilen == 0x04 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x28
            ) {
              console.log("4 vertex primitive with light source - flat, no texture");
            }
            // gouraud, no texture (solid)
            else if
                        (
              primitive.olen == 0x08 &&
              primitive.ilen == 0x05 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x38
            ) {
              console.log("4 vertex primitive with light source - gouraud, no texture");
            }
            // flat, no texture (gradation)
            else if
                        (
              primitive.olen == 0x08 &&
              primitive.ilen == 0x07 &&
              primitive.flag == 0x04 &&
              primitive.mode == 0x28
            ) {
              console.log("4 vertex primitive with light source - flat, no texture (gradation)");
            }
            // gouraud, no texture (gradation)
            else if
                        (
              primitive.olen == 0x08 &&
              primitive.ilen == 0x08 &&
              primitive.flag == 0x04 &&
              primitive.mode == 0x38
            ) {
              console.log("4 vertex primitive with light source - gouraud, no texture (gradation)");
            }
            // flat, texture
            else if
                        (
              primitive.olen == 0x09 &&
              primitive.ilen == 0x07 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x2c
            ) {
              console.log("4 vertex primitive with light source - flat, textured");
            }
            // gouraud, texture
            else if
                        (
              primitive.olen == 0x0c &&
              primitive.ilen == 0x08 &&
              primitive.flag == 0x00 &&
              primitive.mode == 0x3c
            ) {
              console.log("4 vertex primitive with light source - gouraud, textured");
            }
            // 3 vertex polygon WITHOUT light source calcs
            // flat, no texture (solid)
            else if (
              primitive.olen == 0x04 &&
              primitive.ilen == 0x03 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x21
            ) {
              console.log("3 vertex primitive WITHOUT light source - flat, no texture");
            }
            // gradation, no texture (solid)
            else if
                        (
              primitive.olen == 0x06 &&
              primitive.ilen == 0x05 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x31
            ) {
              console.log("3 vertex primitive WITHOUT light source - gradation, no texture");
            }
            // flat, texture
            else if
                        (
              primitive.olen == 0x07 &&
              primitive.ilen == 0x06 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x25
            ) {
              console.log("3 vertex primitive WITHOUT light source - flat, texture");
            }
            // gradation, texture
            else if
                        (
              primitive.olen == 0x09 &&
              primitive.ilen == 0x08 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x35
            ) {
              console.log("3 vertex primitive WITHOUT light source - gouraud, texture");
            }
            // 4 vertices polygon WITHOUT light source calcs
            // flat, no texture
            else if (
              primitive.olen == 0x05 &&
              primitive.ilen == 0x04 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x29
            ) {
              console.log("4 vertex primitive WITHOUT light source - flat, no texture");
            }
            // gradation, no texture
            else if
                        (
              primitive.olen == 0x08 &&
              primitive.ilen == 0x06 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x39
            ) {
              console.log("4 vertex primitive WITHOUT light source - gradation, no texture");
            }
            // flat, texture
            else if (
              primitive.olen == 0x09 &&
              primitive.ilen == 0x07 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x2d
            ) {
              console.log("4 vertex primitive WITHOUT light source - flat, texture");
            }
            // gradation, texture
            else if
                        (
              primitive.olen == 0x0c &&
              primitive.ilen == 0x0a &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x3d
            ) {
              console.log("4 vertex primitive WITHOUT light source - gradation, texture");
            }
            // straight line packet
            // gradation off
            else if (
              primitive.olen == 0x03 &&
              primitive.ilen == 0x02 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x40
            ) {
              console.log("straight line - gradation off");
            }
            // gradation on
            else if
                        (
              primitive.olen == 0x04 &&
              primitive.ilen == 0x03 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x50
            ) {
              console.log("straight line - gradation on");
            }
            // sprites
            // free size
            else if (
              primitive.olen == 0x05 &&
              primitive.ilen == 0x03 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x64
            ) {
              console.log("sprites - free size");
            }
            // 1x1
            else if
                        (
              primitive.olen == 0x04 &&
              primitive.ilen == 0x02 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x6c
            ) {
              console.log("sprites - 1x1");
            }
            // 8x8
            else if
                        (
              primitive.olen == 0x04 &&
              primitive.ilen == 0x02 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x74
            ) {
              console.log("sprites - 8x8");
            }
            // 16x16
            else if
                        (
              primitive.olen == 0x04 &&
              primitive.ilen == 0x02 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x7c
            ) {
              console.log("sprites - 16x16");
            }

          }
        }

        // skipping all the packets
        // offset += Polytron.TMD_Packet.byteLength;

        // read vertices

        for (var i = 0; i < objects.length; i++) {
          var vertexStruct = TMD.createVertex();
          objects[i].vertices = vertexStruct.readStructs(data, offset, objects[i].numVertices);
          offset += vertexStruct.byteLength * objects[i].numVertices;
        }

        // read normals

        for (var i = 0; i < objects.length; i++) {
          var normalStruct = TMD.createNormal();
          objects[i].normals = normalStruct.readStructs(data, offset, objects[i].numNormals);
          offset += normalStruct.byteLength * objects[i].numNormals;
        }

        //
        var meshes = [];

        for (var i = 0; i < objects.length; i++) {
          var obj = objects[i];
          var geometry = new Geometry();

          for (var j = 0; j < obj.vertices.length; j++) {
            var v = obj.vertices[j];
            geometry.vertices.push(
              new Vector3(
                v.vx * 0.05, // scale down a little bit
                -v.vy * 0.05,
                v.vz * 0.05
              )
            );
          }

          for (var j = 0; j < obj.primitives.length; j++) {
            var primitive = obj.primitives[j];
            geometry.faces.push(
              new Face3(
                primitive.data.v0,
                primitive.data.v1,
                primitive.data.v2
              )
            );
          }

          this.mesh = new Mesh(geometry, this.material);
          this.mesh.geometry.computeFaceNormals();
          this.scene.add(this.mesh);
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.model !== undefined){
      this.loadModel(nextProps.model);
    }
  }

  componentDidMount() {
    // appending canvas element to body
    ReactDOM.findDOMNode(this).appendChild(this.renderer.domElement);
    if(this.props.model !== undefined){
      this.loadModel(this.props.model);
    }

    this.renderWebGL();
  }

  renderWebGL() {
    requestAnimationFrame(this.renderWebGL);
    this.renderer.render(this.scene, this.camera);
    if (this.mesh) {
      this.mesh.rotation.y += 0.03;
    }
  }

  render() {
    return (
      <div className="scene">
      </div>
    )
  }
}

export default PolytronScene;