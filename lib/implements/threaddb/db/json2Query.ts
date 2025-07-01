
import { Query,Criterion,Operation,Value as DbValue } from "./query";
// 查询条件定义

  
  // 查询对象结构
   interface DCQuery {
    condition: string;  // [{"FieldPath": "name","Operation":"=","Value":""}}] //=,!=,<>,>,<,>=,<= aa >1 and bb > 1
    ors: DCQuery[];       // 子查询对象
    sort: any;          // {"FieldPath": "Jimmy Kuu",}
    seek: string;       // 从指定instanceid开始获取结果
    limit: number;
    skip: number;
    index: string;
  }
  

  // 错误定义
  const ErrInvalidQueryConditionFormat = new Error("无效的查询条件格式");
  
  /**
   * 解析JSON字符串为查询对象
   * @param jsonQuery JSON查询字符串
   * @returns 数据库查询对象
   */
  export function parseJsonToQuery(jsonQuery: string): Query {
    const queryObject: DCQuery = {
      condition: '',
      ors: [],
      sort: {},
      seek: '',
      limit: 0,
      skip: 0,
      index: ''
    };
    
    if (jsonQuery === '') {
      jsonQuery = '{}';
    }
    
    try {
      Object.assign(queryObject, JSON.parse(jsonQuery));
      return dcQueryToDbQuery(queryObject);
    } catch (err) {
      throw new Error(`解析查询JSON失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  
  /**
   * 将自定义查询对象转换为数据库查询对象
   * @param dcQuery 自定义查询对象
   * @returns 数据库查询对象
   */
  function dcQueryToDbQuery(dcQuery: DCQuery): Query {
    try {
      const ands = parseCondition(dcQuery.condition);
      
      const dbQuery = new Query();
      dbQuery.ands = ands;
      dbQuery.sort = dcQuery.sort;
      dbQuery.seek = dcQuery.seek;
      dbQuery.limit = dcQuery.limit;
      dbQuery.skip = dcQuery.skip;
      dbQuery.index = dcQuery.index;
      dbQuery.ors = [] as any[];
      // 处理子查询
      dbQuery.ors = dcQuery.ors?.map(query => dcQueryToDbQuery(query)) || [];
      
      // 设置默认限制
      if (dbQuery.limit === 0) {
        dbQuery.limit = -1;
      }
      
      return dbQuery;
    } catch (err) {
      throw new Error(`转换查询对象失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  
  /**
   * 解析条件字符串为条件对象数组
   * @param condition 条件字符串
   * @returns 条件对象数组
   */
  function parseCondition(condition: string): Criterion[] {
    // 根据 and 进行分解
    if (!condition) return [];
    
    const criterions = condition.split(' and ');
    const ands: Criterion[] = [];
    
    for (const criterion of criterions) {
      // 解析出key，操作符以及值
      try {
        const parsed = parseSingleCondition(criterion);
        if (!parsed || parsed.length !== 3) {
          continue;
        }
        
        const value = parseValue(parsed[2]!);
        const queryCriterion = new Criterion(parsed[0]!, getDbQueryOperation(parsed[1]!), value);
        ands.push(queryCriterion);
      } catch (err) {
        // 忽略解析错误的条件
        continue;
      }
    }
    
    return ands;
  }
  
  /**
   * 解析值字符串为类型化的值对象
   * @param strValue 值字符串
   * @returns 类型化的值对象
   */
  function parseValue(strValue: string): DbValue {
    const value = new DbValue();
    
    if (strValue[0] === "'" || strValue[0] === '"') {
      const sValue = strValue.substring(1, strValue.length - 1);
      value.string = sValue;
    } else if (strValue === "true" || strValue === "false") {
      const bValue = strValue === "true";
      value.bool = bValue;
    } else {
      const fValue = parseFloat(strValue);
      if (isNaN(fValue)) {
        throw new Error(`无效的数字格式: ${strValue}`);
      }
      value.float = fValue;
    }
    
    return value;
  }
  
  // 支持的操作符
  const splitOp = ["!=", ">=", "<=", "=", "<>", ">", "<"];
  
  /**
   * 解析单个条件字符串为操作数组
   * @param condition 条件字符串
   * @returns [字段路径, 操作符, 值] 数组
   */
  function parseSingleCondition(condition: string): string[] {
    for (const op of splitOp) {
      const index = condition.indexOf(op);
      if (index > 0) {
        // 判断操作符是否出现在值的字符串中
        const qStartIndex = condition.indexOf("'");
        const dqStartIndex = condition.indexOf('"');
        if ((qStartIndex > 0 && index > qStartIndex) || (dqStartIndex > 0 && index > dqStartIndex)) {
          // 操作符出现在字符串中，不做处理，判断下一个操作符
          continue;
        }
        
        const parsedCondition: string[] = new Array(3);
        parsedCondition[0] = condition.substring(0, index).trim();
        parsedCondition[1] = op.trim();
        parsedCondition[2] = condition.substring(index + op.length).trim();
        return parsedCondition;
      }
    }
    
    throw ErrInvalidQueryConditionFormat;
  }
  
  /**
   * 获取数据库查询操作类型
   * @param op 操作符字符串
   * @returns 操作类型枚举值
   */
  function getDbQueryOperation(op: string): Operation {
    const top = op.trim();
    switch (top) {
      case "=":
        return Operation.eq;
      case "!=":
      case "<>":
        return Operation.ne;
      case ">":
        return Operation.gt;
      case "<":
        return Operation.lt;
      case ">=":
        return Operation.ge;
      case "<=":
        return Operation.le;
      default:
        return Operation.eq; // 默认等于
    }
  }