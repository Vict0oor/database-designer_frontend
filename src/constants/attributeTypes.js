export const ATTRIBUTE_TYPES = [
  "VARCHAR",
  "INTEGER",
  "TEXT",
  "BOOLEAN",
  "DATE",
  "TIMESTAMP",
  "DECIMAL",
  "BINARY",
];

export const LENGTH_SUPPORTING_TYPES = [
  "VARCHAR",  
  "CHAR",    
  "BINARY",  
  "VARBINARY"
];

export const PRECISION_SUPPORTING_TYPES = [
  "DECIMAL",  
  "NUMERIC",  
  "FLOAT",  
  "DOUBLE"
];

export const DEFAULT_ATTRIBUTE_TYPE = "INTEGER";

export const DEFAULT_LENGTH_VALUES = {
  "VARCHAR": 255,
  "CHAR": 1,
  "BINARY": 1,
  "VARBINARY": 255,
  "DECIMAL": [10, 2],
  "NUMERIC": [10, 2],
  "FLOAT": 24,
  "DOUBLE": 53
};