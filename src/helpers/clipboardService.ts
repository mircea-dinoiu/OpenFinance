export const copyText = (value) => {
    const textarea = document.createElement('textarea');

    textarea.value = value;

    document.body.appendChild(textarea);

    textarea.select();

    const ok = document.execCommand('copy');

    document.body.removeChild(textarea);

    return ok;
};
