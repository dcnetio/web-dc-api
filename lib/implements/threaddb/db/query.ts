import { Key } from 'interface-datastore';
import { InstanceID,idFieldName } from '../core/db';
import { ThreadToken } from '../core/identity';


/**
 * Query is a JSON-serializable query representation
 */
export class Query {
  ands: Criterion[] = [];
  ors: Query[] = [];
  sort: Sort = new Sort();
  seek: InstanceID = '';
  limit: number = 0;
  skip: number = 0;
  index: string = '';

  constructor() {
    
      this.ands = [];
      this.ors = [];
      this.sort = new Sort();
      this.seek = '';
      this.limit = 0;
      this.skip = 0;
      this.index = '';
   
  }

  /**
   * Validate validates the entire query
   */
  validate(): Error | null {
    if (!this) return null;
    
    for (const criterion of this.ands) {
      const error = criterion.validate();
      if (error) return error;
    }
    
    for (const query of this.ors) {
      const error = query.validate();
      if (error) return error;
    }
    
    return null;
  }

  /**
   * And concatenates a new condition in an existing field
   */
  and(field: string): Criterion {
    return new Criterion(field);
  }

  /**
   * Or concatenates a new condition that is sufficient
   * for an instance to satisfy, independent of the current Query.
   * Has left-associativity as: (a And b) Or c
   */
  or(orQuery: Query): Query {
    this.ors.push(orQuery);
    return this;
  }

  /**
   * UseIndex specifies the index to use when running this query
   */
  useIndex(path: string): Query {
    this.index = path;
    return this;
  }

  /**
   * OrderBy specifies ascending order for the query results
   */
  orderBy(field: string): Query {
    this.sort.fieldPath = field;
    this.sort.desc = false;
    return this;
  }

  /**
   * OrderByDesc specifies descending order for the query results
   */
  orderByDesc(field: string): Query {
    this.sort.fieldPath = field;
    this.sort.desc = true;
    return this;
  }

  /**
   * OrderByID specifies ascending ID order for the query results
   */
  orderById(): Query {
    this.sort.fieldPath = "_id";
    this.sort.desc = false;
    return this;
  }

  /**
   * OrderByIDDesc specifies descending ID order for the query results
   */
  orderByIdDesc(): Query {
    this.sort.fieldPath = "_id";
    this.sort.desc = true;
    return this;
  }

  /**
   * SeekID seeks to the given ID before returning query results
   */
  seekId(id: InstanceID): Query {
    this.seek = id;
    return this;
  }

  /**
   * LimitTo sets the maximum number of results
   */
  limitTo(limit: number): Query {
    this.limit = limit;
    return this;
  }

  /**
   * SkipNum skips the given number of results
   */
  skipNum(num: number): Query {
    this.skip = num;
    return this;
  }

  /**
   * Match checks if the given object matches this query
   */
  match(v: Record<string, any>): boolean {
    if (!this) {
      throw new Error("query can't be null");
    }

    // Check all AND conditions
    let andOk = true;
    for (const c of this.ands) {
      try {
        const fieldRes = traverseFieldPathMap(v, c.fieldPath);
        const ok = c.match(fieldRes);
        andOk = andOk && ok;
        if (!andOk) {
          break;
        }
      } catch (err) {
        return false;
      }
    }
    
    if (andOk) {
      return true;
    }

    // Check all OR conditions if AND fails
    for (const q of this.ors) {
      try {
        if (q.match(v)) {
          return true;
        }
      } catch (err) {
        return false;
      }
    }

    return false;
  }
}

/**
 * Criterion represents a restriction on a field
 */
export class Criterion {
  fieldPath: string;
  operation: Operation = Operation.eq;
  value: Value = new Value();
  private query: Query | null = null;

  constructor(fieldPath: string, operation?:Operation,value?:Value) {
    this.fieldPath = fieldPath;
    this.operation = operation!;
    this.value = value!;
  }

  /**
   * Validate validates a single query criterion
   */
  validate(): Error | null {
    if (!this) return null;
    
    let nonNullCount = 0;
    if (this.value.bool !== null) nonNullCount++;
    if (this.value.string !== null) nonNullCount++;
    if (this.value.float !== null) nonNullCount++;
    
    if (nonNullCount !== 1) {
      return new Error("value type should describe exactly one type");
    }
    
    return null;
  }

  /**
   * Eq is an equality operator against a field
   */
  eq(value: any): Query {
    return this.createCriterion(Operation.eq, value);
  }

  /**
   * Ne is a not equal operator against a field
   */
  ne(value: any): Query {
    return this.createCriterion(Operation.ne, value);
  }

  /**
   * Gt is a greater operator against a field
   */
  gt(value: any): Query {
    return this.createCriterion(Operation.gt, value);
  }

  /**
   * Lt is a less operation against a field
   */
  lt(value: any): Query {
    return this.createCriterion(Operation.lt, value);
  }

  /**
   * Ge is a greater or equal operator against a field
   */
  ge(value: any): Query {
    return this.createCriterion(Operation.ge, value);
  }

  /**
   * Le is a less or equal operator against a field
   */
  le(value: any): Query {
    return this.createCriterion(Operation.le, value);
  }

  /**
   * Creates a criterion with the specified operation and value
   */
  private createCriterion(op: Operation, val: any): Query {
    this.operation = op;
    this.value = createValue(val);
    
    if (!this.query) {
      this.query = new Query();
    }
    
    this.query.ands.push(this);
    return this.query;
  }

  /**
   * Match checks if the given value matches this criterion
   */
  match(value: any): boolean {
    try {
      const result = compareValue(value, this.value);
      
      switch (this.operation) {
        case Operation.eq:
          return result === 0;
        case Operation.ne:
          return result !== 0;
        case Operation.gt:
          return result > 0;
        case Operation.lt:
          return result < 0;
        case Operation.le:
          return result <= 0;
        case Operation.ge:
          return result >= 0;
        default:
          throw new Error("invalid operation");
      }
    } catch (err) {
      return false;
    }
  }
}

/**
 * Value models a single value in JSON
 */
export class Value {
  string: string | null = null;
  bool: boolean | null = null;
  float: number | null = null;
}

/**
 * Sort represents a sort order on a field
 */
export class Sort {
  fieldPath: string = '';
  desc: boolean = false;
}

/**
 * Operation models comparison operators
 */
export enum Operation {
  eq = 0, // equals
  ne = 1, // not equal to
  gt = 2, // greater than
  lt = 3, // less than
  ge = 4, // greater than or equal to
  le = 5, // less than or equal to
  fn = 6 //func
}


export class TypeMismatchError extends Error {
  constructor(value: any, expected: Value) {
    let expectedType = "unknown";
    if (expected.string !== null) expectedType = "string";
    if (expected.bool !== null) expectedType = "boolean";
    if (expected.float !== null) expectedType = "number";
    
    super(`Type mismatch: value ${value} is not of expected type ${expectedType}`);
    this.name = "TypeMismatchError";
  }
}

// Helper functions

/**
 * Where starts to create a query condition for a field
 */
export function where(field: string): Criterion {
  return new Criterion(field);
}

/**
 * OrderBy specifies ascending order for the query results
 */
export function orderBy(field: string): Query {
  const q = new Query();
  q.sort.fieldPath = field;
  q.sort.desc = false;
  return q;
}

/**
 * OrderByDesc specifies descending order for the query results
 */
export function orderByDesc(field: string): Query {
  const q = new Query();
  q.sort.fieldPath = field;
  q.sort.desc = true;
  return q;
}

/**
 * OrderByID specifies ascending ID order for the query results
 */
export function orderById(): Query {
  const q = new Query();
  q.sort.fieldPath = "_id";
  q.sort.desc = false;
  return q;
}

/**
 * OrderByIDDesc specifies descending ID order for the query results
 */
export function orderByIdDesc(): Query {
  const q = new Query();
  q.sort.fieldPath = "_id";
  q.sort.desc = true;
  return q;
}

/**
 * Creates a Value from a JavaScript value
 */
function createValue(value: any): Value {
  const v = new Value();
  
  if (typeof value === "string") {
    v.string = value;
  } else if (typeof value === "boolean") {
    v.bool = value;
  } else if (typeof value === "number") {
    v.float = value;
  } else if (value === null) {
    // Leave all properties null
  } else {
    console.warn("Unsupported value type:", value);
  }
  
  return v;
}





  

/**
 * Compares a JavaScript value to a Value
 */
function compareValue(value: any, critVal: Value): number {
  if (critVal.string !== null) {
    const s = typeof value === "string" ? value : "";
    return s.localeCompare(critVal.string);
  }
  
  if (critVal.bool !== null) {
    const b = typeof value === "boolean" ? value : false;
    return b === critVal.bool ? 0 : -1;
  }
  
  if (critVal.float !== null) {
    const f = typeof value === "number" ? value : 0;
    if (f === critVal.float) return 0;
    if (f < critVal.float) return -1;
    return 1;
  }
  
  throw new Error("no underlying value for criterion was provided");
}

/**
 * Returns a deeply nested property from an object
 */
export function traverseFieldPathMap(value: Record<string, any>, fieldPath: string): any {
  const fields = fieldPath.split('.');
  
  let curr: any = value;
  for (const field of fields) {
    if (!curr || typeof curr !== 'object') {
      return undefined;
    }
    curr = curr[field];
  }
  
  return curr;
}

/**
 * Compares two values for sorting
 */
export function compare(a: any, b: any): number {
  if (a === b) return 0;
  
  if (typeof a !== typeof b) {
    throw new Error("Cannot compare different types");
  }
  
  if (typeof a === "string") {
    return a.localeCompare(b);
  }
  
  if (typeof a === "number") {
    return a - b;
  }
  
  if (typeof a === "boolean") {
    return (a === b) ? 0 : (a ? 1 : -1);
  }
  
  throw new Error("Cannot compare values of type " + typeof a);
}

// Class for handling modified since queries
export class ModifiedSinceHandler {
  /**
   * Gets instances modified since a specific time
   */
  static async modifiedSince(
    txn: any,
    dsDispatcherPrefix: Key,
    collectionName: string,
    time: number
  ): Promise<InstanceID[]> {
    // Convert time to string for key operations
    const timestr = time.toString();
    
    // Create the query filter function
    const collectionFilter = (item: any) => {
      const key = new Key(item.key.toString());
      return key.type() === collectionName;
    };

    // Execute query
    const res = await txn.queryExtended({
      prefix: dsDispatcherPrefix.toString(),
      filters: [collectionFilter],
      keysOnly: true,
      seekPrefix: dsDispatcherPrefix.child(new Key(timestr)).toString()
    });
    
    // Create a set to store unique instance IDs
    const instanceIdSet = new Set<InstanceID>();
    
    // Process query results
    for await (const entry of res) {
      if (entry.error) {
        throw new Error(`Query error: ${entry.error}`);
      }
      
      const key = new Key(entry.key);
      instanceIdSet.add(key.name() as InstanceID);
    }
    
    // Convert set to array
    return Array.from(instanceIdSet);
  }
}