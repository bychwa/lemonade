const AWS = require('aws-sdk');
const sts = new AWS.STS({ apiVersion: '2011-06-15' })
const request = require('request-promise');
const { Credentials } = require('./aws_files');
const { getFormItems } = require('./extract');

const UserName = Symbol();
const Password = Symbol();
const ChallengeQuestionAnswer = Symbol();
const ServerHost = Symbol();
const doRequest = Symbol();
const PrincipalArn = Symbol();
const CredentialsFile = Symbol();

class ADAuth {
    constructor(options) {
        this[CredentialsFile] = new Credentials();
        this[ServerHost] = options.idp_entry_url;
        this[PrincipalArn] = options.idp_principal_arn;
        this[UserName] = options.username;
        this[Password] = options.password;
        this[ChallengeQuestionAnswer] = options.mfa_code;
        this[doRequest] = async (form) => {
            const options = {
                url: this[ServerHost], method: 'POST',
                resolveWithFullResponse: true,
                jar: true, followRedirect: true,
                followAllRedirects: true,
                form
            };
            const response = await request(options);
            return getFormItems(response.body);
        }
        this.getSaml = async () => {
            let loginResponseFormData = await this[doRequest]({
                UserName: this[UserName],
                Password: this[Password],
            });
            if (Object.keys(loginResponseFormData).includes('SignInIdpSite')) {
                loginResponseFormData = await this[doRequest]({
                    SignInIdpSite: true,
                });
            }
            if (!loginResponseFormData.Context) {
                throw Error('INVALID_LOGIN_CREDENTIALS');
            }
            if (this[ChallengeQuestionAnswer]) {
                const mfaResponseFormData = await this[doRequest]({
                    Context: loginResponseFormData.Context,
                    ChallengeQuestionAnswer: this[ChallengeQuestionAnswer],
                    AuthMethod: 'TOTPAuthenticationProvider01'
                });
                if (mfaResponseFormData.Context) {
                    throw Error('INVALID_MFA_CODE')
                }
                return mfaResponseFormData.SAMLResponse;
            } else {
                return loginResponseFormData.SAMLResponse;
            }
        }
        this.assume = async (RoleArn) => {
            try {
                if (!this[CredentialsFile].getKeys().includes('saml')) {
                    const saml = await this.getSaml();
                    this[CredentialsFile].addKey('saml', { value: saml });
                    this[CredentialsFile].save();
                } else {
                    var params = {
                        PrincipalArn: this[PrincipalArn],   /* required */
                        SAMLAssertion: this[CredentialsFile].getValue('saml').value,                      /* required */
                        RoleArn
                        // DurationSeconds: 'NUMBER_VALUE'
                    };
                    try {
                        const res = await sts.assumeRoleWithSAML(params).promise();
                        return res;
                    } catch (error) {
                        //if fails retry fetching new;
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }
}
module.exports = ADAuth;