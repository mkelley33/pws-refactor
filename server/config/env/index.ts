import path from 'path';

export default await import(`./${process.env.NODE_ENV || 'development'}`).then((env) => {
  const defaults = {
    root: path.join(path.dirname('.'), '/..'),
    api: {
      title: 'API: Users and Application Resources',
      version: '0.0.1',
      description: 'A RESTful API for managing users and application resources.',
    },
    fileSizeLimit: 10 * 1024 * 1024,
  };

  return { ...env, defaults };
});
