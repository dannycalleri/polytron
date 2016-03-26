"use strict"
var Polytron = function()
{
  this.WIDTH = window.innerWidth/2;
  this.HEIGHT = window.innerHeight/2;

  // creating webgl renderer
  this.renderer = new THREE.WebGLRenderer({ alpha: true });
	this.renderer.setSize( this.WIDTH, this.HEIGHT );
  this.renderer.setClearColor( 0xffffff, 0);

  // appending canvas element to body
	document.getElementById("scene").appendChild( this.renderer.domElement );

  // creating scene that will contain our meshes
  this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 75, this.WIDTH / this.HEIGHT, 0.1, 1000 );

	// at the moment only one "test" material for rendering
	// this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
  this.material = new THREE.MeshLambertMaterial( { color: 0xffffff, overdraw: 0.5 } )

  // ======================================================
  // debug geometry
  // this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // this.cube = new THREE.Mesh( this.geometry, this.material );
  // this.scene.add( this.cube );
  // ======================================================

  this.camera.position.x = 0;
	this.camera.position.y = 0;
	this.camera.position.z = 200;

  // var canvas = document.getElementsByTagName("canvas")[0];
  document.addEventListener( "keydown", this.update.bind(this), true);

  // just testing
  this.mesh = null;

  // var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
  var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, -70, 100 ).normalize();
  // pointLight.position.set( 10, 10, 10 );
  this.scene.add(directionalLight);
  this.scene.add( new THREE.AmbientLight( 0x00020 ) );

  this.render();
};

Polytron.MODELS_PATH = "MODELS/";

// .TMD model format

Polytron.TMD_Header = Struct.create(
  Struct.uint32("id", Struct.LITTLE_ENDIAN),
  Struct.uint32("flags", Struct.LITTLE_ENDIAN),
  Struct.uint32("numObjects", Struct.LITTLE_ENDIAN)
);

Polytron.TMD_Object = Struct.create(
  Struct.skip(4), // vertices start address - skip
  Struct.uint32("numVertices", Struct.LITTLE_ENDIAN),
  Struct.skip(4), // normals start address - skip
  Struct.uint32("numNormals", Struct.LITTLE_ENDIAN),
  Struct.skip(4), // primites start address - skip
  Struct.uint32("numPrimitives", Struct.LITTLE_ENDIAN),
  Struct.int32("scale", Struct.LITTLE_ENDIAN)
);

Polytron.TMD_Primitive = Struct.create(
  Struct.uint8("olen", Struct.LITTLE_ENDIAN),
  Struct.uint8("ilen", Struct.LITTLE_ENDIAN),
  Struct.uint8("flag", Struct.LITTLE_ENDIAN),
  Struct.uint8("mode", Struct.LITTLE_ENDIAN)
);

Polytron.TMD_PrimitiveData_3_GOURAUD_TEX = Struct.create(
  Struct.uint8("u0"),
  Struct.uint8("v0"),
  Struct.uint16("cba", Struct.LITTLE_ENDIAN),
  Struct.uint8("u1"),
  Struct.uint8("v1"),
  Struct.uint16("tsb", Struct.LITTLE_ENDIAN),
  Struct.uint8("u2"),
  Struct.uint8("v2"),
  Struct.skip(2), // skip 2 bytes
  Struct.uint16("n0", Struct.LITTLE_ENDIAN),
  Struct.uint16("v0", Struct.LITTLE_ENDIAN),
  Struct.uint16("n1", Struct.LITTLE_ENDIAN),
  Struct.uint16("v1", Struct.LITTLE_ENDIAN),
  Struct.uint16("n2", Struct.LITTLE_ENDIAN),
  Struct.uint16("v2", Struct.LITTLE_ENDIAN)
);

Polytron.TMD_PrimitiveData_3_GOURAUD_NOTEX_SOLID = Struct.create(
  Struct.uint8("r"),
  Struct.uint8("g"),
  Struct.uint8("b"),
  Struct.uint8("mode"),
  Struct.uint16("n0", Struct.LITTLE_ENDIAN),
  Struct.uint16("v0", Struct.LITTLE_ENDIAN),
  Struct.uint16("n1", Struct.LITTLE_ENDIAN),
  Struct.uint16("v1", Struct.LITTLE_ENDIAN),
  Struct.uint16("n2", Struct.LITTLE_ENDIAN),
  Struct.uint16("v2", Struct.LITTLE_ENDIAN)
);

Polytron.TMD_Vertex = Struct.create(
  Struct.int16("vx", Struct.LITTLE_ENDIAN),
  Struct.int16("vy", Struct.LITTLE_ENDIAN),
  Struct.int16("vz", Struct.LITTLE_ENDIAN),
  Struct.skip(2) // padding
);

Polytron.TMD_Normal = Struct.create(
  Struct.int16("nx", Struct.LITTLE_ENDIAN),
  Struct.int16("ny", Struct.LITTLE_ENDIAN),
  Struct.int16("nz", Struct.LITTLE_ENDIAN),
  Struct.skip(2) // padding
);

Polytron.prototype.request = function(url, callback)
{
  var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.responseType = "arraybuffer";

	if( req.overrideMimeType )
  {
		req.overrideMimeType('text/plain; charset=x-user-defined');
	}
	else
  {
		req.setRequestHeader('Accept-Charset', 'x-user-defined');
	}

	req.onload = function(ev)
  {
		if( req.status == 200 )
    {
			callback(req.response);
		}
	};

  req.send();
};

Polytron.prototype.loadAssets = function(callback)
{
  var offset = 0;

  this.request(Polytron.MODELS_PATH + "I02V.tmd", function(buffer){
    // console.log(buffer);

    // read one element of this struct type from buffer
    // starting from offset (0 in this case)
    // note: readStructs returns an array
    var header = Polytron.TMD_Header.readStructs(buffer, 0, 1)[0];
    offset += Polytron.TMD_Header.byteLength;
    console.log(header);

    console.log("# OBJECT LIST START = "+offset);

    var objects = Polytron.TMD_Object.readStructs(buffer, offset, header.numObjects);
    offset += Polytron.TMD_Object.byteLength * header.numObjects;
    console.log(objects);

    console.log("# PRIMITIVE LIST START = "+offset);

    for(var i=0; i < objects.length; i++)
    {
      for(var j=0; j < objects[i].numPrimitives; j++)
      {
        // read primitive data
        if(!objects[i].primitives)
          objects[i].primitives = [];

        objects[i].primitives.push(Polytron.TMD_Primitive.readStructs(buffer, offset, 1)[0]);
        offset += Polytron.TMD_Primitive.byteLength;

        // read the correct packet data based on olen,ilen,flag,mode

        var primitive = objects[i].primitives[j];

        // 3 vertex polygon with light source calcs
        // flat, no texture (solid)
        if(
            primitive.olen == 0x04 &&
            primitive.ilen == 0x03 &&
            primitive.flag == 0x00 &&
            primitive.mode == 0x20
          )
         {
           console.log("3 vertex primitive with light source - flat, no texture");
         }
         // gouraud, no texture (solid)
         else if
         (
           primitive.olen == 0x06 &&
           primitive.ilen == 0x04 &&
           primitive.flag == 0x00 &&
           primitive.mode == 0x30
         )
         {
           console.log("3 vertex primitive with light source - gouraud, no texture");

           primitive.data = Polytron.TMD_PrimitiveData_3_GOURAUD_NOTEX_SOLID.readStructs(buffer, offset, 1)[0];
           offset += Polytron.TMD_PrimitiveData_3_GOURAUD_NOTEX_SOLID.byteLength;
         }
         // flat, no texture (gradation)
         else if
         (
           primitive.olen == 0x06 &&
           primitive.ilen == 0x05 &&
           primitive.flag == 0x04 &&
           primitive.mode == 0x20
         )
         {
           console.log("3 vertex primitive with light source - flat, no texture (gradation)");
         }
         // gouraud, no texture (gradation)
         else if
         (
           primitive.olen == 0x06 &&
           primitive.ilen == 0x06 &&
           primitive.flag == 0x04 &&
           primitive.mode == 0x30
         )
         {
           console.log("3 vertex primitive with light source - gouraud, no texture (gradation)");
         }
         // flat, texture
         else if
         (
           primitive.olen == 0x07 &&
           primitive.ilen == 0x05 &&
           primitive.flag == 0x00 &&
           primitive.mode == 0x24
         )
         {
           console.log("3 vertex primitive with light source - flat, textured");
         }
         // gouraud, texture
         else if
         (
           primitive.olen == 0x09 &&
           primitive.ilen == 0x06 &&
           primitive.flag == 0x00 &&
           primitive.mode == 0x34
         )
         {
           console.log("3 vertex primitive with light source - gouraud, textured");

           primitive.data = Polytron.TMD_PrimitiveData_3_GOURAUD_TEX.readStructs(buffer, offset, 1)[0];
           offset += Polytron.TMD_PrimitiveData_3_GOURAUD_TEX.byteLength;
         }
         // 4 vertices polygon with light source calcs
         // flat, no texture (solid)
         else if(
             primitive.olen == 0x05 &&
             primitive.ilen == 0x04 &&
             primitive.flag == 0x00 &&
             primitive.mode == 0x28
           )
          {
            console.log("4 vertex primitive with light source - flat, no texture");
          }
          // gouraud, no texture (solid)
          else if
          (
            primitive.olen == 0x08 &&
            primitive.ilen == 0x05 &&
            primitive.flag == 0x00 &&
            primitive.mode == 0x38
          )
          {
            console.log("4 vertex primitive with light source - gouraud, no texture");
          }
          // flat, no texture (gradation)
          else if
          (
            primitive.olen == 0x08 &&
            primitive.ilen == 0x07 &&
            primitive.flag == 0x04 &&
            primitive.mode == 0x28
          )
          {
            console.log("4 vertex primitive with light source - flat, no texture (gradation)");
          }
          // gouraud, no texture (gradation)
          else if
          (
            primitive.olen == 0x08 &&
            primitive.ilen == 0x08 &&
            primitive.flag == 0x04 &&
            primitive.mode == 0x38
          )
          {
            console.log("4 vertex primitive with light source - gouraud, no texture (gradation)");
          }
          // flat, texture
          else if
          (
            primitive.olen == 0x09 &&
            primitive.ilen == 0x07 &&
            primitive.flag == 0x00 &&
            primitive.mode == 0x2c
          )
          {
            console.log("4 vertex primitive with light source - flat, textured");
          }
          // gouraud, texture
          else if
          (
            primitive.olen == 0x0c &&
            primitive.ilen == 0x08 &&
            primitive.flag == 0x00 &&
            primitive.mode == 0x3c
          )
          {
            console.log("4 vertex primitive with light source - gouraud, textured");
          }
          // 3 vertex polygon WITHOUT light source calcs
          // flat, no texture (solid)
          else if(
              primitive.olen == 0x04 &&
              primitive.ilen == 0x03 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x21
            )
           {
             console.log("3 vertex primitive WITHOUT light source - flat, no texture");
           }
           // gradation, no texture (solid)
           else if
           (
             primitive.olen == 0x06 &&
             primitive.ilen == 0x05 &&
             primitive.flag == 0x01 &&
             primitive.mode == 0x31
           )
           {
             console.log("3 vertex primitive WITHOUT light source - gradation, no texture");
           }
           // flat, texture
           else if
           (
             primitive.olen == 0x07 &&
             primitive.ilen == 0x06 &&
             primitive.flag == 0x01 &&
             primitive.mode == 0x25
           )
           {
             console.log("3 vertex primitive WITHOUT light source - flat, texture");
           }
           // gradation, texture
           else if
           (
             primitive.olen == 0x09 &&
             primitive.ilen == 0x08 &&
             primitive.flag == 0x01 &&
             primitive.mode == 0x35
           )
           {
             console.log("3 vertex primitive WITHOUT light source - gouraud, texture");
           }
           // 4 vertices polygon WITHOUT light source calcs
           // flat, no texture
           else if(
               primitive.olen == 0x05 &&
               primitive.ilen == 0x04 &&
               primitive.flag == 0x01 &&
               primitive.mode == 0x29
             )
            {
              console.log("4 vertex primitive WITHOUT light source - flat, no texture");
            }
            // gradation, no texture
            else if
            (
              primitive.olen == 0x08 &&
              primitive.ilen == 0x06 &&
              primitive.flag == 0x01 &&
              primitive.mode == 0x39
            )
            {
              console.log("4 vertex primitive WITHOUT light source - gradation, no texture");
            }
            // flat, texture
            else if(
                primitive.olen == 0x09 &&
                primitive.ilen == 0x07 &&
                primitive.flag == 0x01 &&
                primitive.mode == 0x2d
              )
             {
               console.log("4 vertex primitive WITHOUT light source - flat, texture");
             }
             // gradation, texture
             else if
             (
               primitive.olen == 0x0c &&
               primitive.ilen == 0x0a &&
               primitive.flag == 0x01 &&
               primitive.mode == 0x3d
             )
             {
               console.log("4 vertex primitive WITHOUT light source - gradation, texture");
             }
             // straight line packet
             // gradation off
             else if(
                 primitive.olen == 0x03 &&
                 primitive.ilen == 0x02 &&
                 primitive.flag == 0x01 &&
                 primitive.mode == 0x40
               )
              {
                console.log("straight line - gradation off");
              }
              // gradation on
              else if
              (
                primitive.olen == 0x04 &&
                primitive.ilen == 0x03 &&
                primitive.flag == 0x01 &&
                primitive.mode == 0x50
              )
              {
                console.log("straight line - gradation on");
              }
              // sprites
              // free size
              else if(
                  primitive.olen == 0x05 &&
                  primitive.ilen == 0x03 &&
                  primitive.flag == 0x01 &&
                  primitive.mode == 0x64
                )
               {
                 console.log("sprites - free size");
               }
               // 1x1
               else if
               (
                 primitive.olen == 0x04 &&
                 primitive.ilen == 0x02 &&
                 primitive.flag == 0x01 &&
                 primitive.mode == 0x6c
               )
               {
                 console.log("sprites - 1x1");
               }
               // 8x8
               else if
               (
                 primitive.olen == 0x04 &&
                 primitive.ilen == 0x02 &&
                 primitive.flag == 0x01 &&
                 primitive.mode == 0x74
               )
               {
                 console.log("sprites - 8x8");
               }
               // 16x16
               else if
               (
                 primitive.olen == 0x04 &&
                 primitive.ilen == 0x02 &&
                 primitive.flag == 0x01 &&
                 primitive.mode == 0x7c
               )
               {
                 console.log("sprites - 16x16");
               }

      }
    }

    // skipping all the packets
    // offset += Polytron.TMD_Packet.byteLength;

    // read vertices

    for(var i=0; i < objects.length; i++)
    {
      objects[i].vertices = Polytron.TMD_Vertex.readStructs(buffer, offset, objects[i].numVertices);
      offset += Polytron.TMD_Vertex.byteLength * objects[i].numVertices;
    }

    // read normals

    for(var i=0; i < objects.length; i++)
    {
      objects[i].normals = Polytron.TMD_Normal.readStructs(buffer, offset, objects[i].numNormals);
      offset += Polytron.TMD_Normal.byteLength * objects[i].numNormals;
    }

    callback(objects);

    // var primitives =

    //
    //
    // for(var i=0; i < header.numObjects; i++)
    // {
    //
    // }
  });
};

Polytron.prototype.update = function(e)
{
  // console.log(e.keyCode);

  if(e.keyCode == 87) //upddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
  {
    this.camera.position.y -= 10;
  }
  else if(e.keyCode == 83) //down
  {
    this.camera.position.y += 10;
  }
  else if(e.keyCode == 68) //right
  {
    this.camera.position.x += 10;
  }
  else if(e.keyCode == 65) //left
  {
    this.camera.position.x -= 10;
  }

  this.camera.lookAt(new THREE.Vector3(0,0,0));

};

Polytron.prototype.render = function()
{
  requestAnimationFrame( this.render.bind(this) );
	this.renderer.render( this.scene, this.camera );
  // this.cube.rotation.y += 0.1;

  if(this.mesh)
    this.mesh.rotation.y += 0.01;
};

var poly = new Polytron();

// poly.render();

poly.loadAssets(function(objects){

  // try to render object
  // var geometries = [];

  var meshes = [];

  for (var i = 0; i < objects.length; i++)
  {
    var obj = objects[i];
    var geometry = new THREE.Geometry();

    for(var j = 0; j < obj.vertices.length; j++)
    {
      var v = obj.vertices[j];
      geometry.vertices.push(
        new THREE.Vector3(
          v.vx * 0.05, // scale down a little bit
          -v.vy * 0.05,
          v.vz * 0.05
        )
      );
    }

    for(var j = 0; j < obj.primitives.length; j++)
    {
      var primitive = obj.primitives[j];
      geometry.faces.push(
        new THREE.Face3(
          primitive.data.v0,
          primitive.data.v1,
          primitive.data.v2
        )
      );
    }

    poly.mesh = new THREE.Mesh(geometry, poly.material);
    poly.mesh.geometry.computeFaceNormals();
    poly.scene.add(poly.mesh);
  }

  setTimeout(function(){
    $('header, #main').addClass('unveil');
  },1000);


});
