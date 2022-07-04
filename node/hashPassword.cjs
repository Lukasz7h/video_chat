const { createHmac } = require("crypto");

// zwracamy hash hasła
function hashPassword(password)
{
    const hmac = createHmac("sha512", "asd887&(*6hjkGg*^FFG**676yjTt8&oP&8%^&*RdkL*^34$HY*)8GG(80gjrfhe87856^&*^&*jhf*&%$^%&**)6");
    hmac.update(password);

    return hmac.digest("hex");
};

module.exports = {
    hashPassword
}