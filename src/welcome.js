/**
 * Created by user on 10.10.16.
 */
'use strict';

module.exports = function (message) {

    if (NODE_ENV == 'development') {
        console.log('true');
    }

    alert(process.env.USER);

    alert(`W3lcomr ${message}`);
};