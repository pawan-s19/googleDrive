const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `118195583239-4dtv61unc28e0v4kh7pqr7qlc0ebv4oh.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04zxapjOZY8MKCgYIARAAGAQSNwF-L9IruRGvzngoUMsmIPHTocUX_A8k_173aMNh_Q63f7UQrz_t9mtRnJufjVA-GH6JzfZ4wt4`;
const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,
REDIRECT_URI);
authClient.setCredentials({refresh_token: REFRESH_TOKEN});
async function mailer(){
 try{
 const ACCESS_TOKEN = await authClient.getAccessToken();
 const transport = nodemailer.createTransport({
 service: "gmail",
 auth: {
 type: "OAuth2",
 user: "onkarsushant05@gmail.com",
 clientId: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 refreshToken: REFRESH_TOKEN,
 accessToken: ACCESS_TOKEN
 }
 })
 const details = {
 from: " sushant onkar <onkarsushant05@gmail.com>",
 to: "sushantwork295@gmail.com",
 subject: "happy",
 text: "message text",
 html: "<h2>NODE Mailer seekh gaya hoon bhai1</h2>"
 }
 const result = await transport.sendMail(details);
 return result;
 }
 catch(err){
 return err;
 }
}
mailer().then(res => {
 console.log("sent mail !", res);
})