import Struct from 'js-struct';

class TMD {
    static createHeader() {
        return Struct.create(
            Struct.uint32("id", Struct.LITTLE_ENDIAN),
            Struct.uint32("flags", Struct.LITTLE_ENDIAN),
            Struct.uint32("numObjects", Struct.LITTLE_ENDIAN)
        );
    }

    static createObject() {
        return Struct.create(
            Struct.skip(4), // vertices start address - skip
            Struct.uint32("numVertices", Struct.LITTLE_ENDIAN),
            Struct.skip(4), // normals start address - skip
            Struct.uint32("numNormals", Struct.LITTLE_ENDIAN),
            Struct.skip(4), // primites start address - skip
            Struct.uint32("numPrimitives", Struct.LITTLE_ENDIAN),
            Struct.int32("scale", Struct.LITTLE_ENDIAN)
        );
    }

    static createPrimitive() {
        return Struct.create(
            Struct.uint8("olen", Struct.LITTLE_ENDIAN),
            Struct.uint8("ilen", Struct.LITTLE_ENDIAN),
            Struct.uint8("flag", Struct.LITTLE_ENDIAN),
            Struct.uint8("mode", Struct.LITTLE_ENDIAN)
        );
    }

    static createPrimitiveData_3_Gouraud_Tex() {
        return Struct.create(
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
    }

    static createPrimitiveData_3_Gouraud_Notex_Solid() {
        return Struct.create(
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
    }

    static createVertex() {
        return Struct.create(
            Struct.int16("vx", Struct.LITTLE_ENDIAN),
            Struct.int16("vy", Struct.LITTLE_ENDIAN),
            Struct.int16("vz", Struct.LITTLE_ENDIAN),
            Struct.skip(2) // padding
        );
    }

    static createNormal() {
        return Struct.create(
            Struct.int16("nx", Struct.LITTLE_ENDIAN),
            Struct.int16("ny", Struct.LITTLE_ENDIAN),
            Struct.int16("nz", Struct.LITTLE_ENDIAN),
            Struct.skip(2) // padding
        );
    }
}

export default TMD;