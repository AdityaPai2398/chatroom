'use strict';

module.exports = (pandora) => {
  pandora
    .process('chatroom')
    .env({
      PROD: '8002',
      NODE_ENV: 'prod',
    })
    .cluster('./src/server/index.js');

  /**
  * you can custom workers scale number
  */
  // pandora
  //   .process('worker')
  //   .scale(2); // .scale('auto') means os.cpus().length

  /**
   * you can also use fork mode to start application
   */
  // pandora
  //   .fork('init', './src/server/index.js');

  /**
   * you can create another process here
   */
  // pandora
  //   .process('background')
  //   .nodeArgs(['--expose-gc']);

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
};
