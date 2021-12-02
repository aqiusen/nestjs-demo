export const getCurl = (config: any, finalHeaders: any, encodeSign = false) => {
  let curl: string;
  if (config.params) {
    const paramStr =
      '?' +
      Object.keys(config.params)
        .reduce((prev, curr) => {
          let value = config.params[curr];
          if (encodeSign && curr === 'sign') {
            value = encodeURIComponent(value);
          }
          return `${prev}&${curr}=${value}`;
        }, '')
        .slice(1);
    curl = `curl -X ${config.method.toUpperCase()} '${config.url}${paramStr}'`;
  } else {
    curl = `curl -X ${config.method.toUpperCase()} '${config.url}'`;
  }

  if (config.data) {
    curl = `${curl}` + ` -d '${JSON.stringify(config.data)}'`;
  }

  if (finalHeaders) {
    const headerStr = Object.keys(finalHeaders).reduce((prev, curr) => {
      const value = finalHeaders[curr];
      return `${prev} -H '${curr}: ${value}'`;
    }, '');
    curl = curl + headerStr;
  }
  if (encodeSign) {
    curl += ' -k';
  }
  return curl;
};
