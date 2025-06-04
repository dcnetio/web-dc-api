/**  
 * 浏览器环境的行读取器  
 * 实现类似Go bufio.Reader的行读取功能  
 */  
export class BrowserLineReader {
  text: any;
  position: number;
  lines: any;
  currentLine: number;  
  constructor(text: string) {
    this.text = text;  
    this.position = 0;  
    this.lines = text.split(/\r?\n/);  
    this.currentLine = 0;  
  }  
  
  /**  
   * 读取一行，模拟Go的bufio.Reader.ReadLine()  
   * @returns {{line: Uint8Array, isPrefix: boolean, error: Error|null}} 读取结果  
   */  
  readLine() {  
    if (this.currentLine >= this.lines.length) {  
      return {   
        line: new Uint8Array(0),   
        isPrefix: false,   
        error: new Error('EOF')   
      };  
    }  
    
    const line = this.lines[this.currentLine];  
    this.currentLine++;  
    
    // 将字符串转换为Uint8Array (类似Go的[]byte)  
    const encoder = new TextEncoder();  
    const lineBytes = encoder.encode(line);  
    
    // 这里简化了，假设单次可以读完整行  
    return {  
      line: lineBytes,  
      isPrefix: false,  
      error: null  
    };  
  }  
}  

/**  
 * 从Reader中读取完整行  
 * @param {BrowserLineReader} reader - 行读取器  
 * @returns {{line: Uint8Array, error: Error|null}} 读取结果  
 */  
export function readLine(reader: BrowserLineReader): {line: Uint8Array, error: Error|null} {  
  let ln = new Uint8Array(0);  
  let isPrefix = true;  
  let error = null;  
  
  while (isPrefix && error === null) {  
    const result = reader.readLine();  
    
    // 更新变量  
    isPrefix = result.isPrefix;  
    error = result.error;  
    
    if (result.line.length > 0) {  
      // 合并数组 (类似Go的append)  
      const newArray = new Uint8Array(ln.length + result.line.length);  
      newArray.set(ln);  
      newArray.set(result.line, ln.length);  
      ln = newArray;  
    }  
  }  
  
  return { line: ln, error };  
}  