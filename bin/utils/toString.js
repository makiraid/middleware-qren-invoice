const toString = (nominal) => {
  const num = nominal
                .split(',')[0]
                .replace(/\./g, '');

  return num;
}

module.exports = toString;