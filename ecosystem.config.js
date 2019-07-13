module.exports = {
    apps : [{
        name: 'uniApi',
        script: 'index.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            connectionStringPostgres:'postgres://yqidbxly:fufOn7hGH_sFZqcXz-johT8zIDzUgCdr@rogue.db.elephantsql.com:5432/yqidbxly'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

    deploy : {
        production : {
            user : 'node',
            host : '89.223.88.69',
            ref  : 'origin/master',
            repo : 'https://github.com/yinfo/uniapi.git',
            path : '/var/www/production',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
