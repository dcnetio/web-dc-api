// HPACK Implementation
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
export class HPACK {
    dynamicTable: [string, string][];
    dynamicTableSize: number;
    maxDynamicTableSize: number;
    staticTable: [string, string][];
    huffmanTable: { codes: Uint32Array, lengths: Uint8Array };

    constructor(maxDynamicTableSize = 4096) {
        // 初始化动态表
        this.dynamicTable = [];
        this.dynamicTableSize = 0;
        this.maxDynamicTableSize = maxDynamicTableSize;
        
        // 初始化静态表
        this.staticTable = [
            [ '', '' ], // Index 0 is not used
            [ ':authority', '' ],
            [ ':method', 'GET' ],
            [ ':method', 'POST' ],
            [ ':path', '/' ],
            [ ':path', '/index.html' ],
            [ ':scheme', 'http' ],
            [ ':scheme', 'https' ],
            [ ':status', '200' ],
            [ ':status', '204' ],
            [ ':status', '206' ],
            [ ':status', '304' ],
            [ ':status', '400' ],
            [ ':status', '404' ],
            [ ':status', '500' ],
            [ 'accept-charset', '' ],
            [ 'accept-encoding', 'gzip, deflate' ],
            [ 'accept-language', '' ],
            [ 'accept-ranges', '' ],
            [ 'accept', '' ],
            [ 'access-control-allow-origin', '' ],
            [ 'age', '' ],
            [ 'allow', '' ],
            [ 'authorization', '' ],
            [ 'cache-control', '' ],
            [ 'content-disposition', '' ],
            [ 'content-encoding', '' ],
            [ 'content-language', '' ],
            [ 'content-length', '' ],
            [ 'content-location', '' ],
            [ 'content-range', '' ],
            [ 'content-type', '' ],
            [ 'cookie', '' ],
            [ 'date', '' ],
            [ 'etag', '' ],
            [ 'expect', '' ],
            [ 'expires', '' ],
            [ 'from', '' ],
            [ 'host', '' ],
            [ 'if-match', '' ],
            [ 'if-modified-since', '' ],
            [ 'if-none-match', '' ],
            [ 'if-range', '' ],
            [ 'if-unmodified-since', '' ],
            [ 'last-modified', '' ],
            [ 'link', '' ],
            [ 'location', '' ],
            [ 'max-forwards', '' ],
            [ 'proxy-authenticate', '' ],
            [ 'proxy-authorization', '' ],
            [ 'range', '' ],
            [ 'referer', '' ],
            [ 'refresh', '' ],
            [ 'retry-after', '' ],
            [ 'server', '' ],
            [ 'set-cookie', '' ],
            [ 'strict-transport-security', '' ],
            [ 'transfer-encoding', '' ],
            [ 'user-agent', '' ],
            [ 'vary', '' ],
            [ 'via', '' ],
            [ 'www-authenticate', '' ]
        ];
        
        // Huffman编码表
        this.huffmanTable = this.buildHuffmanTable();
    }

    // 编码headers
    encode(headers: { [key: string]: string }) {
        const buffer : number[] = [];
        
        for (const [name, value] of Object.entries(headers)) {
            // 查找静态表索引
            const staticIndex = this.findInStaticTable(name, value);
            if (staticIndex !== -1) {
                // 使用索引编码
                buffer.push(...this.encodeInteger(staticIndex, 7, 0x80));
                continue;
            }

            // 查找动态表索引
            const dynamicIndex = this.findInDynamicTable(name, value);
            if (dynamicIndex !== -1) {
                buffer.push(...this.encodeInteger(
                    dynamicIndex + this.staticTable.length, 
                    7, 
                    0x80
                ));
                continue;
            }

            // 字面量编码
            this.encodeLiteral(buffer, name, value);
        }

        return new Uint8Array(buffer);
    }

    // // 解码二进制数据
    // decode(buffer: Uint8Array): { [key: string]: string } {
    //     const headers: { [key: string]: string } = {};
    //     let pos = 0;

    //     while (pos < buffer.length) {
    //         const firstByte = buffer[pos];
    //         // 检查是否是索引头部字段
    //         if ((firstByte & 0x80) === 0x80) {
    //             const { value: index, bytesRead } = this.decodeInteger(
    //                 buffer.slice(pos),
    //                 7
    //             );
    //             pos += bytesRead;

    //             const [name, value] = this.getIndexedHeader(index);
    //             if (name !== undefined && value !== undefined) {
    //                 headers[name] = value;
    //             }
    //         }
    //         // 字面量头部字段
    //         else {
    //             const { name, value, bytesRead } = this.decodeLiteral(
    //                 buffer.slice(pos)
    //             );
    //             pos += bytesRead;
    //             headers[name] = value;
    //         }
    //     }

    //     return headers;
    // }

    // 编码整数
    encodeInteger(value: number, prefixBits: number, prefix = 0) {
        const buffer : number[] = [];
        const mask = (1 << prefixBits) - 1;
        
        if (value < mask) {
            buffer.push(prefix | value);
            return buffer;
        }

        buffer.push(prefix | mask);
        value -= mask;

        while (value >= 128) {
            buffer.push((value & 127) | 128);
            value = value >> 7;
        }
        buffer.push(value);

        return buffer;
    }

    // // 解码整数
    // decodeInteger(buffer: Uint8Array, prefixBits: number) {
    //     let value = buffer[0] & ((1 << prefixBits) - 1);
    //     let bytesRead = 1;

    //     if (value === (1 << prefixBits) - 1) {
    //         let shift = 0;
    //         do {
    //             value += (buffer[bytesRead] & 127) << shift;
    //             shift += 7;
    //             bytesRead++;
    //         } while (buffer[bytesRead - 1] & 128);
    //     }

    //     return { value, bytesRead };
    // }

    // 编码字符串
    encodeString(str: string) {
        const buffer : number[] = [];
        const bytes = new TextEncoder().encode(str);
        
        // 尝试Huffman编码
        const huffmanEncoded = this.huffmanEncode(bytes);
        
        if (huffmanEncoded.length < bytes.length) {
            // 使用Huffman编码
            buffer.push(...this.encodeInteger(huffmanEncoded.length, 7, 0x80));
            buffer.push(...huffmanEncoded);
        } else {
            // 不使用Huffman编码
            buffer.push(...this.encodeInteger(bytes.length, 7, 0x00));
            buffer.push(...bytes);
        }

        return buffer;
    }

  
    // 在静态表中查找
    findInStaticTable(name: string, value: string) {
        for (let i = 1; i < this.staticTable.length; i++) {
            if (this.staticTable[i][0] === name && 
                this.staticTable[i][1] === value) {
                return i;
            }
        }
        return -1;
    }

    // 在动态表中查找
    findInDynamicTable(name: string, value: string) {
        for (let i = 0; i < this.dynamicTable.length; i++) {
            if (this.dynamicTable[i][0] === name && 
                this.dynamicTable[i][1] === value) {
                return i;
            }
        }
        return -1;
    }

    // 编码字面量头部字段
    encodeLiteral(buffer: number[], name: string, value: string) {
        const nameIndex = this.findInStaticTable(name, '');
        
        if (nameIndex !== -1) {
            // 名称索引存在
            buffer.push(...this.encodeInteger(nameIndex, 6, 0x40));
        } else {
            // 名称需要字面量编码
            buffer.push(0x40);
            buffer.push(...this.encodeString(name));
        }
        
        // 值总是需要字面量编码
        buffer.push(...this.encodeString(value));

        // 添加到动态表
        this.addToDynamicTable(name, value);
    }

   

    // 添加到动态表
    addToDynamicTable(name: string, value: string) {
        const size = name.length + value.length + 32; // 32 bytes overhead

        // 确保不超过最大大小
        while (this.dynamicTableSize + size > this.maxDynamicTableSize && 
               this.dynamicTable.length > 0) {
            const entry = this.dynamicTable.pop();
            if (entry) {
                this.dynamicTableSize -= entry[0].length + entry[1].length + 32;
            }
        }

        if (size <= this.maxDynamicTableSize) {
            this.dynamicTable.unshift([name, value]);
            this.dynamicTableSize += size;
        }
        this.dynamicTable.push([name, value]);  
    }

    // 获取索引的头部
    getIndexedHeader(index: number) {
        if (index <= this.staticTable.length - 1) {
            return this.staticTable[index];
        }
        return this.dynamicTable[index - this.staticTable.length];
    }

    buildHuffmanTable() {  
        // HTTP/2规范中定义的完整Huffman编码表  
        return {  
            codes: new Uint32Array([  
                0x1ff8, 0x7fffd8, 0xfffffe2, 0xfffffe3, 0xfffffe4, 0xfffffe5, 0xfffffe6, 0xfffffe7,  
                0xfffffe8, 0xffffea, 0x3ffffffc, 0xfffffe9, 0xfffffea, 0x3ffffffd, 0xfffffeb, 0xfffffec,  
                0xfffffed, 0xfffffee, 0xfffffef, 0xffffff0, 0xffffff1, 0xffffff2, 0x3ffffffe, 0xffffff3,  
                0xffffff4, 0xffffff5, 0xffffff6, 0xffffff7, 0xffffff8, 0xffffff9, 0xffffffa, 0xffffffb,  
                0x14, 0x3f8, 0x3f9, 0xffa, 0x1ff9, 0x15, 0xf8, 0x7fa,  
                0x3fa, 0x3fb, 0xf9, 0x7fb, 0xfa, 0x16, 0x17, 0x18,  
                0x0, 0x1, 0x2, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,  
                0x1e, 0x1f, 0x5c, 0xfb, 0x7ffc, 0x20, 0xffb, 0x3fc,  
                0x1ffa, 0x21, 0x5d, 0x5e, 0x5f, 0x60, 0x61, 0x62,  
                0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a,  
                0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72,  
                0xfc, 0x73, 0xfd, 0x1ffb, 0x7fff0, 0x1ffc, 0x3ffc, 0x22,  
                0x7ffd, 0x3, 0x23, 0x4, 0x24, 0x5, 0x25, 0x26,  
                0x27, 0x6, 0x74, 0x75, 0x28, 0x29, 0x2a, 0x7,  
                0x2b, 0x76, 0x2c, 0x8, 0x9, 0x2d, 0x77, 0x78,  
                0x79, 0x7a, 0x7b, 0x7ffe, 0x7fc, 0x3ffd, 0x1ffd, 0xffffffc,  
                0xfffe6, 0x3fffd2, 0xfffe7, 0xfffe8, 0x3fffd3, 0x3fffd4, 0x3fffd5, 0x7fffd9,  
                0x3fffd6, 0x7fffda, 0x7fffdb, 0x7fffdc, 0x7fffdd, 0x7fffde, 0xffffeb, 0x7fffdf,  
                0xffffec, 0xffffed, 0x3fffd7, 0x7fffe0, 0xffffee, 0x7fffe1, 0x7fffe2, 0x7fffe3,  
                0x7fffe4, 0x1fffdc, 0x3fffd8, 0x7fffe5, 0x3fffd9, 0x7fffe6, 0x7fffe7, 0xffffef,  
                0x3fffda, 0x1fffdd, 0xfffe9, 0x3fffdb, 0x3fffdc, 0x7fffe8, 0x7fffe9, 0x1fffde,  
                0x7fffea, 0x3fffdd, 0x3fffde, 0xfffff0, 0x1fffdf, 0x3fffdf, 0x7fffeb, 0x7fffec,  
                0x1fffe0, 0x1fffe1, 0x3fffe0, 0x1fffe2, 0x7fffed, 0x3fffe1, 0x7fffee, 0x7fffef,  
                0xfffea, 0x3fffe2, 0x3fffe3, 0x3fffe4, 0x7ffff0, 0x3fffe5, 0x3fffe6, 0x7ffff1,  
                0x3ffffe0, 0x3ffffe1, 0xfffeb, 0x7fff1, 0x3fffe7, 0x7ffff2, 0x3fffe8, 0x1ffffec,  
                0x3ffffe2, 0x3ffffe3, 0x3ffffe4, 0x7ffffde, 0x7ffffdf, 0x3ffffe5, 0xfffff1, 0x1ffffed,  
                0x7fff2, 0x1fffe3, 0x3ffffe6, 0x7ffffe0, 0x7ffffe1, 0x3ffffe7, 0x7ffffe2, 0xfffff2,  
                0x1fffe4, 0x1fffe5, 0x3ffffe8, 0x3ffffe9, 0xffffffd, 0x7ffffe3, 0x7ffffe4, 0x7ffffe5,  
                0xfffec, 0xfffff3, 0xfffed, 0x1fffe6, 0x3fffe9, 0x1fffe7, 0x1fffe8, 0x7ffff3,  
                0x3fffea, 0x3fffeb, 0x1ffffee, 0x1ffffef, 0xfffff4, 0xfffff5, 0x3ffffea, 0x7ffff4,  
                0x3ffffeb, 0x7ffffe6, 0x3ffffec, 0x3ffffed, 0x7ffffe7, 0x7ffffe8, 0x7ffffe9, 0x7ffffea,  
                0x7ffffeb, 0xffffffe, 0x7ffffec, 0x7ffffed, 0x7ffffee, 0x7ffffef, 0x7fffff0, 0x3ffffee  
            ]),  
            lengths: new Uint8Array([  
                13, 23, 28, 28, 28, 28, 28, 28, 28, 24, 30, 28, 28, 30, 28, 28,  
                28, 28, 28, 28, 28, 28, 30, 28, 28, 28, 28, 28, 28, 28, 28, 28,  
                6, 10, 10, 12, 13, 6, 8, 11, 10, 10, 8, 11, 8, 6, 6, 6,  
                5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 8, 15, 6, 12, 10,  
                13, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  
                7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 8, 13, 19, 13, 14, 6,  
                15, 5, 6, 5, 6, 5, 6, 6, 6, 5, 7, 7, 6, 6, 6, 5,  
                6, 7, 6, 5, 5, 6, 7, 7, 7, 7, 7, 15, 11, 14, 13, 28,  
                20, 22, 20, 20, 22, 22, 22, 23, 22, 23, 23, 23, 23, 23, 24, 23,  
                24, 24, 22, 23, 24, 23, 23, 23, 23, 21, 22, 23, 22, 23, 23, 24,  
                22, 21, 20, 22, 22, 23, 23, 21, 23, 22, 22, 24, 21, 22, 23, 23,  
                21, 21, 22, 21, 23, 22, 23, 23, 20, 22, 22, 22, 23, 22, 22, 23,  
                26, 26, 20, 19, 22, 23, 22, 25, 26, 26, 26, 27, 27, 26, 24, 25,  
                19, 21, 26, 27, 27, 26, 27, 24, 21, 21, 26, 26, 28, 27, 27, 27,  
                20, 24, 20, 21, 22, 21, 21, 23, 22, 22, 25, 25, 24, 24, 26, 23,  
                26, 27, 26, 26, 27, 27, 27, 27, 27, 28, 27, 27, 27, 27, 27, 26  
            ])  
        };  
    }  
    /**  
     * 解码Uint8Array为字符串  
     * @param input 编码后的Uint8Array  
     * @returns 解码后的字符串  
     */  
    public decode(input: Uint8Array): string {  
        let result = '';  
        let accumulator = 0;  
        let bits = 0;  

        for (let i = 0; i < input.length; i++) {  
            const byte = input[i];  
            accumulator = (accumulator << 8) | byte;  
            bits += 8;  

            while (bits >= 5) {  
                const decoded = this.findSymbol(accumulator, bits);  
                if (!decoded) {
                    break;
                }

                const [symbol, length] = decoded;  
                result += String.fromCharCode(symbol);  
                accumulator &= (1 << (bits - length)) - 1;  
                bits -= length;  
            }  
        }  

        // 验证填充  
        if (bits > 0) {  
            const mask = (1 << bits) - 1;  
            if ((accumulator & mask) !== mask) {  
                throw new Error('Invalid Huffman padding');  
            }  
        }  

        return result;  
    }  

    /**  
     * 在Huffman树中查找符号  
     */  
    private findSymbol(value: number, bits: number): [number, number] | null {  
        for (let i = 0; i < this.huffmanTable.codes.length; i++) {  
            const length = this.huffmanTable.lengths[i];  
            if (bits < length) continue;  

            const code = (value >> (bits - length)) & ((1 << length) - 1);  
            if (code === this.huffmanTable.codes[i]) {  
                return [i, length];  
            }  
        }  
        return null;  
    }  
    // Huffman编码实现  
    huffmanEncode(bytes: Uint8Array) {  
        let result : number[] = [];  
        let current = 0;  
        let bits = 0;  

        for (let i = 0; i < bytes.length; i++) {  
            const b = bytes[i];  
            const code = this.huffmanTable.codes[b];  
            const length = this.huffmanTable.lengths[b];  

            bits += length;  
            current = (current << length) | code;  

            while (bits >= 8) {  
                bits -= 8;  
                result.push((current >> bits) & 0xFF);  
            }  
        }  

        // 处理剩余的位  
        if (bits > 0) {  
            current = (current << (8 - bits)) | ((1 << (8 - bits)) - 1);  
            result.push(current & 0xFF);  
        }  

        return new Uint8Array(result);  
    }  



    decodeHeaderFields(buffer:Uint8Array) {  
        const headers = new Map();  
        let index = 0;  
        while (index < buffer.length) {  
            const firstByte = buffer[index];  
            
            // 检查首字节的类型  
            if ((firstByte & 0x80) !== 0) {  // 1xxxxxxx - Indexed Header Field  
                const [name, value, newIndex] = this.decodeIndexedHeader(buffer, index);  
                if (name && value) headers.set(name, value);  
                index = newIndex;  
            }  
            else if ((firstByte & 0x40) !== 0) {  // 01xxxxxx - Literal Header Field with Incremental Indexing  
                const [name, value, newIndex] = this.decodeLiteralHeaderWithIndexing(buffer, index);  
                if (name && value) headers.set(name, value);  
                index = newIndex;  
            }  
            else if ((firstByte & 0x20) !== 0) {  // 001xxxxx - Dynamic Table Size Update  
                index++; // 简单跳过，实际应该更新动态表大小  
            }  
            else if ((firstByte & 0x10) !== 0) {  // 0001xxxx - Literal Header Field Never Indexed  
                const [name, value, newIndex] = this.decodeLiteralHeaderWithoutIndexing(buffer, index);  
                if (name && value) headers.set(name, value);  
                index = newIndex;  
            }  
            else {  // 0000xxxx - Literal Header Field without Indexing  
                const [name, value, newIndex] = this.decodeLiteralHeaderWithoutIndexing(buffer, index);  
                if (name && value) headers.set(name, value);  
                index = newIndex;  
            }  
        }  
        
        return headers;  
    }  
    
    
    decodeInteger(buffer:Uint8Array, startIndex:number, prefixBits:number) { 
        const prefix = (1 << prefixBits) - 1;  
        const firstByte = buffer[startIndex];  
        let index = startIndex;  
        let value = firstByte & prefix;  
    
        if (value < prefix) {  
            return [value, index + 1];  
        }  
    
        index++;  
        let shift = 0;  
        while (index < buffer.length) {  
            const byte = buffer[index++];  
            value += (byte & 0x7F) << shift;  
            shift += 7;  
            if ((byte & 0x80) === 0) {  
                break;  
            }  
        }  
    
        return [value, index];  
    } 
    
     decodeLiteralString(buffer:Uint8Array, startIndex:number): [string, number] {  
        if (startIndex >= buffer.length) {  
            return ['', startIndex];  
        }  
    
        const firstByte = buffer[startIndex];  
        const isHuffman = (firstByte & 0x80) !== 0;  
        const [length, index] = this.decodeInteger(buffer, startIndex, 7);  
        
        if (index + length > buffer.length) {  
            return ['', index];  
        }  
    
        const bytes = buffer.slice(index, index + length);  
        let result;  
        
        if (isHuffman) {  
            
            try {  
                result = this.decode(bytes);
            } catch (e) {  
                result = '';  
            }  
        } else {  
            try {  
            //    result = new TextDecoder().decode(bytes);  
                result = uint8ArrayToString(bytes);
            } catch (e) {  
                result = '';  
            }  
        }  
        
        return [result, index + length];  
    }  
    
    decodeIndexedHeader(buffer:Uint8Array, index:number): [string, string, number] {  
        const [staticIndex, newIndex] = this.decodeInteger(buffer, index, 7);  
        if (staticIndex <= 0) {  
            return ['', '', newIndex];  
        }  
        
        const headerField = this.staticTable[staticIndex];  
        if (!headerField) {  
            return ['', '', newIndex];  
        }  
        
        return [headerField[0], headerField[1], newIndex];  
    }  
    
    decodeLiteralHeaderWithIndexing(buffer:Uint8Array, index:number):[string, string, number] {  
        const [staticIndex, nameIndex] = this.decodeInteger(buffer, index, 6);  
        index = nameIndex;  
        
        let name;  
        if (staticIndex > 0) {  
            const headerField = this.staticTable[staticIndex];  
            name = headerField ? headerField[0] : '';  
        } else {  
            const [decodedName, newIndex] = this.decodeLiteralString(buffer, index);  
            name = decodedName;  
            index = newIndex;  
        }  
        
        const [value, finalIndex] = this.decodeLiteralString(buffer, index);  
        return [name, value, finalIndex];  
    }  
    
     decodeLiteralHeaderWithoutIndexing(buffer:Uint8Array, index:number): [string, string, number] {  
        return this.decodeLiteralHeaderWithIndexing(buffer, index);  
    } 
    

    // 直接转换为字符串的方法  
    huffmanDecodeToString(bytes: Uint8Array): string {   
        return this.decode(bytes);   
    }  

 
}
