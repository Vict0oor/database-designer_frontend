
const sqlKeywords = [
    "SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER",
    "GROUP", "BY", "ORDER", "ASC", "DESC", "HAVING", "LIMIT", "OFFSET", "DISTINCT", "AND", "OR", "NOT", "IS",
    "NULL", "TRUE", "FALSE", "BETWEEN", "IN", "EXISTS", "ANY", "ALL", "LIKE", "SIMILAR", "ILIKE", "EXCEPT",
    "INTERSECT", "UNION", "VALUES", "CASE", "WHEN", "THEN", "ELSE", "END", "CAST", "AS", "CONVERT", "ALTER",
    "CREATE", "DROP", "TRUNCATE", "TABLE", "COLUMN", "INDEX", "VIEW", "SEQUENCE", "DATABASE", "USER", "ROLE",
    "GRANT", "REVOKE", "TRANSACTION", "COMMIT", "ROLLBACK", "SAVEPOINT", "LOCK", "UNLOCK", "WITH", "REPLACE", "PROCEDURE",
    "FUNCTION", "TRIGGER", "PRIMARY", "FOREIGN", "KEY", "CHECK", "REFERENCES", "DEFAULT", "UNIQUE", "NOT", "NULL",
    "AUTO_INCREMENT", "SERIAL", "BIGINT", "VARCHAR", "TEXT", "BOOLEAN", "DATE", "TIMESTAMP", "DECIMAL"
];

const isSqlKeyword = (name) => {
    return sqlKeywords.some((keyword) => keyword.toLowerCase() === name.trim().toLowerCase());
};

export const validateAttributeName = (name, attributes) => {
    const trimmedName = name.trim().toLowerCase();

    if (isSqlKeyword(trimmedName)) {
        return "Attribute name cannot be a SQL reserved keyword.";
      }

    if (!trimmedName) {
        return "Attribute name is required.";
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
        return "Attribute name must start with a letter and contain only letters, numbers, or underscores.";
    }

    if (attributes.some((attr) => attr.name.toLowerCase() === trimmedName)) {
        return "Attribute name must be unique.";
    }

    return null;
};

export const validateEntityName = (name) => {
    const trimmedName = name.trim().toLowerCase();

    if (isSqlKeyword(trimmedName)) {
        return "Entity name cannot be a SQL reserved keyword.";
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
        return "Entity name must start with a letter and contain only letters, numbers, or underscores.";
    }

    return null;
};
