const AWS = require('aws-sdk');

const getSessionToken = async () => {
    return new Promise((resolve, reject) => {
        const sts = new AWS.STS();
        sts.getSessionToken((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}
// given root creds
const root_creds = {
    aws_access_key_id: 'x',
    aws_secret_access_key: 'x/x',
    aws_session_token: 'x//////////x/x/x/x+yPGXdeoH2DICKIBM2LR7PlVaJxfzzg7D6wjoNIcuiZ/5Z1wcGTMIGjcB953GIk2VXVFbFTUXSv/UReqz0SAw0RplJs22QXoW/ycSyVRtjPEagApt3J5fB9leYZ1zQ+8/3kUUDFdlhfQMHySk4tAJ95J7y4MV9NtveornVAQ0Axsp+0YuR09koVKb6LpRnnW5E5ngDnz7XPOphYg+Jb97Vlq0FJV0AeNLXNG7AyVc0PRSmP0rGCYH/a1/O+LTxhIctC+GdvBelbiSJeez6klusU3sHFdCehfKpOZaMgWOhk9oKPzou+UF',
    expiration: '2019-04-11T20:02:04Z',
    region: 'eu-west-1'
};


(async () => {
    // grab temporary session token
    // const token = await getSessionToken();
    // console.log(token);

    // assume roles
    // const sts = new AWS.STS();
    // sts.assumeRole()

    // AWS.config.update(root_creds);
    console.log('Noma')
})()
