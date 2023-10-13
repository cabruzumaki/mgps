class MobjectData {

    constructor(key, value, type) {
        this.key = key;
        this.value = value;
        this.type = type;
    }

    getKey() {
        return this.key;
    }

    getValue() {
        return this.value;
    }

    getDataType() {
        return this.type;
    }

    toString() {
        return `<${this.key}:${this.type}=${this.value}>`;
    }
}

class MObject {
    #integers = {}
    #floats = {}
    #strings = {}
    #booleans = {}
    #mobjects = {}
    #integerArrays = {}
    #floatArrays = {}
    #stringArrays = {}
    #booleanArrays = {}
    #mobjectArrays = {}

    setInteger(name, value) {
        this.#integers[name] = value
    }

    setFloat(name, value) {
        this.#floats[name] = value
    }

    setString(name, value) {
        this.#strings[name] = value
    }

    setBoolean(name, value) {
        this.#booleans[name] = value
    }

    setMObject(name, value) {
        this.#mobjects[name] = value
    }

    setIntegerArrays(name, value) {
        this.#integerArrays[name] = value
    }

    setFloatArrays(name, value) {
        this.#floatArrays[name] = value
    }

    setStringArrays(name, value) {
        this.#stringArrays[name] = value
    }

    setBooleanArrays(name, value) {
        this.#booleanArrays[name] = value
    }

    setMObjectArrays(name, value) {
        this.#mobjectArrays[name] = value
    }

    /**
     * Returns the integer value associated with the given name.
     * @param {string} name - The name of the integer value to retrieve.
     * @returns {number} - The integer value associated with the given name.
     */
    getInteger(name) {
        return this.#integers[name]
    }

    /**
     * Returns the float value associated with the given name.
     * @param {string} name - The name of the float value to retrieve.
     * @returns {number} - The float value associated with the given name.
     */
    getFloat(name) {
        return this.#floats[name]
    }

    /**
     * Returns the string value associated with the given name.
     * @param {string} name - The name of the string value to retrieve.
     * @returns {string} - The string value associated with the given name.
     */
    getString(name) {
        return this.#strings[name]
    }

    /**
     * Returns the boolean value associated with the given name.
     * @param {string} name - The name of the boolean value to retrieve.
     * @returns {boolean} - The boolean value associated with the given name.
     */
    getBoolean(name) {
        return this.#booleans[name]
    }

    /**
     * Returns the MObject value associated with the given name.
     * @param {string} name - The name of the MObject value to retrieve.
     * @returns {MObject} - The MObject value associated with the given name.
     */
    getMObject(name) {
        return this.#mobjects[name]
    }

    /**
     * Returns the Integer on an Array value associated with the given name.
     * @param {string} name - The name of the IntegerArray value to retrieve.
     * @returns {Array} - The IntegerArray value associated with the given name.
     */
    getIntegerArray(name) {
        return this.#integerArrays[name];
    }

    /**
     * Returns the Float on an Array value associated with the given name.
     * @param {string} name - The name of the FloatArray value to retrieve.
     * @returns {Array} - The FloatArray value associated with the given name.
     */
    getFloatArray(name) {
        return this.#floatArrays[name];
    }

    /**
     * Returns the String on an Array value associated with the given name.
     * @param {string} name - The name of the StringArray value to retrieve.
     * @returns {Array} - The StringArray value associated with the given name.
     */
    getStringArray(name) {
        return this.#stringArrays[name];
    }

    /**
     * Returns the Boolean on an Array value associated with the given name.
     * @param {string} name - The name of the BooleanArray value to retrieve.
     * @returns {Array} - The BooleanArray value associated with the given name.
     */
    getBooleanArray(name) {
        return this.#booleanArrays[name];
    }

    /**
     * Returns the MObject on an Array value associated with the given name.
     * @param {string} name - The name of the MObjectArray value to retrieve.
     * @returns {Array} - The MObjectArray value associated with the given name.
     */
    getMObjectArray(name) {
        return this.#mobjectArrays[name];
    }

    hasInteger(name) {
        return name in this.#integers;
    }

    hasBoolean(name) {
        return name in this.#booleans;
    }


    toString() {
        let result = "";
        for (const item of this.iterator()) {
            result += `[${item.key}] ${item.value}\n`;
        }
        return result;
    }


}

class MobjectDataType {
    static STRING = 0;
    static BOOLEAN = 1;
    static INTEGER = 2;
    static FLOAT = 3;
    static MOBJECT = 4;
    static STRING_ARRAY = 5;
    static BOOLEAN_ARRAY = 6;
    static INTEGER_ARRAY = 7;
    static FLOAT_ARRAY = 8;
    static MOBJECT_ARRAY = 9;

    static infer(param1) {
        if (Array.isArray(param1)) {
            if (param1.length === 0) {
                throw new Error("MobjectDataType > Can't infer type from empty array");
            }
            return MobjectDataType.infer(param1[0]) + 5;
        }
        if (Number.isInteger(param1)) return MobjectDataType.INTEGER;
        if (typeof param1 === 'number') {
            return MobjectDataType.FLOAT;
        }
        if (typeof param1 === 'string') {
            return MobjectDataType.STRING;
        }
        if (typeof param1 === 'boolean') {
            return MobjectDataType.BOOLEAN;
        }
        if (param1 && typeof param1 === 'object') {
            return MobjectDataType.MOBJECT;
        }
        throw new Error("MobjectDataType > Could not infer type from " + param1);
    }
}

class MobjectCreator {
    constructor() { }

    convert(data) {
        if (MobjectDataType.infer(data) !== MobjectDataType.MOBJECT) {
            throw new Error("MobjectCreator.convert() > The data must be a literal object or a Mobject");
        }
        return this.createObjectFromData(data, MobjectDataType.MOBJECT);
    }

    createObjectFromData(data, dataType) {
        let createdObject = null;
        let propertyName, propertyValue, inferredType;

        switch (dataType) {
            case MobjectDataType.MOBJECT:
                if (data instanceof Mobject) {
                    return data;
                }
                createdObject = new Mobject();
                for (propertyName in data) {
                    propertyValue = data[propertyName];
                    if (Array.isArray(propertyValue) && propertyValue.length === 0) {
                        for (let arrayType of MobjectCreator.ARRAYS) {
                            createdObject.addData(new MobjectData(propertyName, propertyValue, arrayType));
                        }
                    } else {
                        inferredType = MobjectDataType.infer(propertyValue);
                        createdObject.addData(new MobjectData(propertyName, this.createObjectFromData(propertyValue, inferredType), inferredType));
                        if (inferredType === MobjectDataType.INTEGER) {
                            createdObject.setFloat(propertyName, propertyValue);
                        }
                    }
                }
                return createdObject;
            case MobjectDataType.INTEGER:
            case MobjectDataType.FLOAT:
            case MobjectDataType.STRING:
            case MobjectDataType.BOOLEAN:
            case MobjectDataType.INTEGER_ARRAY:
            case MobjectDataType.FLOAT_ARRAY:
            case MobjectDataType.STRING_ARRAY:
            case MobjectDataType.BOOLEAN_ARRAY:
                return data;
            case MobjectDataType.MOBJECT_ARRAY:
                const arrayLength = (data instanceof Array) ? data.length : 0;
                for (let index = arrayLength - 1; index >= 0; index--) {
                    data[index] = this.createObjectFromData(data[index], MobjectDataType.MOBJECT);
                }
                return data;
            default:
                throw new Error("MobjectCreator.convert() > Cannot handle data of type " + dataType);
        }
    }
}

module.exports = { MObject, MobjectDataType, MobjectData, MobjectCreator }