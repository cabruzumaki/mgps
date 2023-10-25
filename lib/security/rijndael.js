
class Rijndael {

    constructor(keySize = 128, blockSize = 128) {
        this.Rcon = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145];
        this.SBox = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22];
        this.SBoxInverse = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125];
        this.keySize = keySize;
        this.blockSize = blockSize;
        this.roundsArray = [0, 0, 0, 0, [0, 0, 0, 0, 10, 0, 12, 0, 14], 0, [0, 0, 0, 0, 12, 0, 12, 0, 14], 0, [0, 0, 0, 0, 14, 0, 14, 0, 14]];
        this.shiftOffsets = [0, 0, 0, 0, [0, 1, 2, 3], 0, [0, 1, 2, 3], 0, [0, 1, 3, 4]];
        this.Nb = this.blockSize / 32;
        this.Nk = this.keySize / 32;
        this.Nr = this.roundsArray[this.Nk][this.Nb];
    }

    xtime(value) {
        value <<= 1;
        return (value & 256) ? value ^ 283 : value;
    }

    expandKey(key) {
        var w = new Array();
        var temp = new Array();
        var i = 0;
        while (i < this.Nk) {
            var r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
            w[i] = r;
            i++;
        }
        i = this.Nk;
        while (i < this.Nb * (this.Nr + 1)) {
            w[i] = new Array();
            var j = 0;
            while (j < 4) {
                temp[j] = w[i - 1][j];
                j++;
            }
            if (i % this.Nk == 0) {
                temp = this.subWord(this.rotWord(temp));
                temp[0] ^= this.Rcon[i / this.Nk];
            } else if (this.Nk > 6 && i % this.Nk == 4) {
                temp = this.subWord(temp);
            }
            var k = 0;
            while (k < 4) {
                w[i][k] = w[i - this.Nk][k] ^ temp[k];
                k++;
            }
            i++;
        }
        return w;
    }

    subWord(w) {
        var i = 0;
        while (i < 4) {
            w[i] = this.SBox[w[i]];
            i++;
        }
        return w;
    }

    rotWord(w) {
        var tmp = w[0];
        var i = 0;
        while (i < 3) {
            w[i] = w[i + 1];
            i++;
        }
        w[3] = tmp;
        return w;
    }

    byteSub(state, direction) {
        var SBox = direction == "encrypt" ? this.SBox : this.SBoxInverse;
        var i = 0;
        while (i < 4) {
            var j = 0;
            while (j < this.Nb) {
                state[i][j] = SBox[state[i][j]];
                j++;
            }
            i++;
        }
    }

    shiftRow(state, direction) {
        var i = 1;
        while (i < 4) {
            var t = new Array();
            var j = 0;
            while (j < this.Nb) {
                t[j] = state[i][(j + i * this.Nb) % (this.Nb * 4)];
                j++;
            }
            state[i] = t;
            i++;
        }
    }

    mixColumn(state, direction) {
        const tempState = new Array(4);
        for (let i = 0; i < 4; i++) {
            tempState[i] = new Array(this.Nb);
            for (let j = 0; j < this.Nb; j++) {
                tempState[i][j] = state[i][j];
            }
        }

        for (let col = 0; col < this.Nb; col++) {
            for (let row = 0; row < 4; row++) {
                if (direction === "encrypt") {
                    state[row][col] =
                        this.mult_GF256(tempState[row][col], 2) ^
                        this.mult_GF256(tempState[(row + 1) % 4][col], 3) ^
                        tempState[(row + 2) % 4][col] ^
                        tempState[(row + 3) % 4][col];
                } else {
                    state[row][col] =
                        this.mult_GF256(tempState[row][col], 14) ^
                        this.mult_GF256(tempState[(row + 1) % 4][col], 11) ^
                        this.mult_GF256(tempState[(row + 2) % 4][col], 13) ^
                        this.mult_GF256(tempState[(row + 3) % 4][col], 9);
                }
            }
        }
    }

    mult_GF256(a, b) {
        let result = 0;
        let mask = 1;

        while (mask < 256) {
            if (a & mask) {
                result ^= b;
            }
            mask *= 2;
            b = this.xtime(b); // Asumiendo que tienes una función llamada xtime
        }

        return result;
    }



    addRoundKey(state, roundKey) {
        var i = 0;
        while (i < 4) {
            var j = 0;
            while (j < this.Nb) {
                state[i][j] ^= roundKey[i][j];
                j++;
            }
            i++;
        }
    }

    encrypt(message, key, encryptionMethod) {
        let blockBytes = this.blockSize / 8;
        let iv, block;
        if (encryptionMethod === "CBC") {
            iv = this.getRandomBytes(blockBytes);
        }

        const formattedMessage = this.formatPlaintext(this.strToChars(message));
        const expandedKey = this.keyExpansion(this.strToChars(key));
        const encryptedBlocks = [];

        for (let i = 0; i < formattedMessage.length / blockBytes; i++) {
            block = formattedMessage.slice(i * blockBytes, (i + 1) * blockBytes);

            if (encryptionMethod === "CBC") {
                for (let j = 0; j < blockBytes; j++) {
                    block[j] ^= iv[j];
                }
            }

            iv = this.encryption(block, expandedKey);
            encryptedBlocks.push(...iv);
        }

        return this.charsToHex(encryptedBlocks);
    }

    decrypt(input, encryptionKey, mode = "CBC") {
        let blockSize = 128; // Tamaño del bloque en bits
        let keyExp = this.keyExpansion(this.strToChars(encryptionKey));
        let inputChars = this.hexToChars(input);
        let blockCount = Math.floor(inputChars.length * 8 / blockSize);

        let outputChars = [];

        for (let block = blockCount - 1; block > 0; block--) {
            let startIndex = block * (blockSize / 8);
            let endIndex = (block + 1) * (blockSize / 8);
            let inputBlock = inputChars.slice(startIndex, endIndex);

            let decryptedBlock = this.decryption(inputBlock, keyExp);

            if (mode === "CBC") {
                for (let i = 0; i < decryptedBlock.length; i++) {
                    outputChars[(block - 1) * (blockSize / 8) + i] = decryptedBlock[i] ^ inputChars[(block - 1) * (blockSize / 8) + i];
                }
            } else {
                outputChars = decryptedBlock.concat(outputChars);
            }
        }

        if (mode === "ECB") {
            let inputBlock = inputChars.slice(0, blockSize / 8);
            let decryptedBlock = this.decryption(inputBlock, keyExp);
            outputChars = decryptedBlock.concat(outputChars);
        }

        console.log(`[OUTPUT]: ${this.charsToStr(outputChars)}`)
        return this.charsToStr(outputChars);
    }

    decryption(input, roundKeys, blockSize, numRounds) {
        const state = this.packBytes(input);

        this.InverseFinalRound(state, roundKeys.slice(blockSize * numRounds));

        for (let round = numRounds - 1; round > 0; round--) {
            this.InverseRound(state, roundKeys.slice(blockSize * round, blockSize * (round + 1)));
        }

        this.addRoundKey(state, roundKeys);

        return this.unpackBytes(state);
    }

    keyExpansion(key) {
        const w = [];
        let temp = new Array(4);
        for (let i = 0; i < this.Nk; i++) {
            w[i] = [
                key[4 * i],
                key[4 * i + 1],
                key[4 * i + 2],
                key[4 * i + 3],
            ];
        }

        for (let i = this.Nk; i < this.Nb * (this.Nr + 1); i++) {
            w[i] = new Array(4);
            for (let t = 0; t < 4; t++) {
                temp[t] = w[i - 1][t];
            }
            if (i % this.Nk === 0) {
                temp = this.subWord(this.rotWord(temp));
                temp[0] ^= this.Rcon[i / this.Nk];
            } else if (this.Nk > 6 && i % this.Nk === 4) {
                temp = this.subWord(temp);
            }
            for (let t = 0; t < 4; t++) {
                w[i][t] = w[i - this.Nk][t] ^ temp[t];
            }
        }

        const expandedKey = [];
        for (let i = 0; i < this.Nb * (this.Nr + 1); i++) {
            expandedKey.push(...w[i]);
        }

        return expandedKey;
    }

    encryption(inputData, roundKeys) {
        inputData = this.packBytes(inputData);
        this.addRoundKey(inputData, roundKeys);
        let round = 1;
        while (round < this.Nr) {
            this.Round(inputData, roundKeys.slice(this.Nb * round, this.Nb * (round + 1)));
            round++;
        }
        this.FinalRound(inputData, roundKeys.slice(this.Nb * this.Nr));
        return this.unpackBytes(inputData);
    }

    Round(state, roundKey) {
        this.byteSub(state, "encrypt");
        this.shiftRow(state, "encrypt");
        this.mixColumn(state, "encrypt");
        this.addRoundKey(state, roundKey);
    }

    InverseRound(state, roundKey) {
        this.addRoundKey(state, roundKey);
        this.mixColumn(state, "decrypt");
        this.shiftRow(state, "decrypt");
        this.byteSub(state, "decrypt");
    }

    FinalRound(state, roundKey) {
        this.byteSub(state, "encrypt");
        this.shiftRow(state, "encrypt");
        this.addRoundKey(state, roundKey);
    }

    InverseFinalRound(state, roundKey) {
        this.addRoundKey(state, roundKey);
        this.shiftRow(state, "decrypt");
        this.byteSub(state, "decrypt");
    }

    packBytes(bytes) {
        var state = new Array();
        state[0] = new Array();
        state[1] = new Array();
        state[2] = new Array();
        state[3] = new Array();
        var i = 0;
        while (i < bytes.length) {
            state[0][i / 4] = bytes[i];
            state[1][i / 4] = bytes[i + 1];
            state[2][i / 4] = bytes[i + 2];
            state[3][i / 4] = bytes[i + 3];
            i += 4;
        }
        return state;
    }

    unpackBytes(state) {
        var bytes = new Array();
        var i = 0;
        while (i < state[0].length) {
            bytes[bytes.length] = state[0][i];
            bytes[bytes.length] = state[1][i];
            bytes[bytes.length] = state[2][i];
            bytes[bytes.length] = state[3][i];
            i++;
        }
        return bytes;
    }

    formatPlaintext(plaintext) {
        var blockSize = this.Nb * 4;
        var padding = blockSize - plaintext.length % blockSize;
        while (padding > 0 && padding < blockSize) {
            plaintext.push(0);
            padding--;
        }
        return plaintext;
    }

    getRandomBytes(length) {
        var bytes = new Array();
        var i = 0;
        while (i < length) {
            bytes[i] = Math.round(Math.random() * 255);
            i++;
        }
        return bytes;
    }

    hexToChars(hex) {
        var chars = new Array();
        var i = hex.substr(0, 2) == "0x" ? 2 : 0;
        while (i < hex.length) {
            chars.push(parseInt(hex.substr(i, 2), 16));
            i += 2;
        }
        return chars;
    }

    charsToHex(chars) {
        var hex = "";
        var i = 0;
        while (i < chars.length) {
            hex += (chars[i] >> 4).toString(16) + (chars[i] & 15).toString(16);
            i++;
        }
        return hex;
    }

    charsToStr(chars) {
        var str = "";
        var i = 0;
        while (i < chars.length) {
            str += String.fromCharCode(chars[i]);
            i++;
        }
        return str;
    }

    strToChars(str) {
        var chars = new Array();
        var i = 0;
        while (i < str.length) {
            chars.push(str.charCodeAt(i));
            i++;
        }
        return chars;
    }

    mult(a, b) {
        if (a == 0 || b == 0) {
            return 0;
        }
        return this.multTable[(this.logTable[a] + this.logTable[b]) % 255];
    }

    multInverse(a) {
        return this.multTable[255 - this.logTable[a]];
    }

    log(n) {
        var result = 0;
        while (this.pow(2, result) != n) {
            result++;
        }
        return result;
    }

    pow(x, y) {
        var result = 1;
        while (y > 0) {
            if (y & 1) {
                result *= x;
            }
            x *= x;
            y >>= 1;
        }
        return result;
    }

    init() {
        this.SBox = new Array(256);
        this.SBoxInverse = new Array(256);
        this.Rcon = new Array(30);
        this.logTable = new Array(256);
        this.expTable = new Array(256);
        this.multTable = new Array(256);
        var i = 0;
        while (i < 256) {
            if (i < 128) {
                this.multTable[i] = i << 1;
            } else {
                this.multTable[i] = (i << 1) ^ 0x11b;
            }
            i++;
        }
        var j = 0;
        var x = 1;
        while (j < 255) {
            this.expTable[j] = x;
            this.logTable[x] = j;
            x = this.mult(x, 3);
            j++;
        }
        var i = 0;
        while (i < 255) {
            var a = this.expTable[i];
            var b = this.expTable[255 - this.logTable[a]];
            this.SBox[i] = b;
            this.SBoxInverse[b] = i;
            i++;
        }
        var i = 0;
        while (i < 30) {
            this.Rcon[i] = new Array();
            this.Rcon[i][0] = this.expTable[i];
            this.Rcon[i][1] = 0;
            this.Rcon[i][2] = 0;
            this.Rcon[i][3] = 0;
            i++;
        }
    }
}

module.exports = { Rijndael };
