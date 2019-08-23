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
        },
        env_production: {
            NODE_ENV: 'production',
            postgresString:'postgres://postgres:y57241896194320@89.223.88.69:5432/postgres'
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
