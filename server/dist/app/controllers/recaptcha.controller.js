import axios from 'axios';
async function verify(req, res) {
    const { token } = req.body;
    const unverified = { error: 'unverified' };
    if (!token)
        return res.json(unverified);
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${req.ip}`;
    const response = await axios.get(verificationUrl);
    const resBody = response.data;
    if (!resBody.success)
        return res.json({ error: 'unverified' });
    res.json({ success: true });
}
export default { verify };
//# sourceMappingURL=recaptcha.controller.js.map