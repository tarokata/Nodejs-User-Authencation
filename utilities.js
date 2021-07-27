(function () {
    'use strict';

    module.exports = {
        findOneUser: findOneUser,
        validate: validate
    };

    function validate(body) {
        return { name: String(body.name), password: String(body.password) };
    }

    function findOneUser(users, name) {
        return users.find(user => user.name === name);
    }
})();