export const validatTextAndNum = (text) => {
    const regex = /^[A-Za-z0-9]+$/;
    if (!regex.test(text)) return false;
    else return true;
};

export const validateUTF8Name = (text) => {
    var regex = /[\s\p{Alpha}\p{M}-]+/gu;
    const check = regex.exec(text);
    if (check && check[0] === text) return true;
    else return false;
};

export const validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    const regex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return regex.test(password);
};
