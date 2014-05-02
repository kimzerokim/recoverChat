var mysqlConfiguration = (function () {
    var mysqlConfig = {
            host: 'localhost',
            port: 3306,
            user: 'recover',
            password: 'recover',
            database: 'recoverChat'
        },

        returnInfo = function () {
            return mysqlConfig;
        };

    return {
        returnInfo: returnInfo
    };
}());

module.exports = mysqlConfiguration;