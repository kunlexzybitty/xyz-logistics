
function validate(req,res)
{
    return new Promise((resolve,reject)=>{

        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            res.status(401).json({Status:"AUTH_FAIL",Message: 'Missing Authorization Header'});
            return reject();
        }

        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (username != process.env.TEST_USERNAME || password != process.env.TEST_PASSWORD ) {
            res.status(401).json({Status:"AUTH_FAIL" ,Message: 'Invalid Authentication Credentials'});
            return reject();
        }

        //Valid credentials
        resolve();

    });
}

exports.validate=validate;