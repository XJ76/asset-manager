function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function transformRow(row) {
  if (!row) return null;
  const transformed = {};
  for (const key in row) {
    transformed[toCamelCase(key)] = row[key];
  }
  return transformed;
}

function transformRows(rows) {
  return rows.map(transformRow);
}

module.exports = { transformRow, transformRows };

