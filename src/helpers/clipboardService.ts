export const copyText = (value: string | number) => {
    const textarea = document.createElement('textarea');

    textarea.value = String(value);

    document.body.appendChild(textarea);

    textarea.select();

    const ok = document.execCommand('copy');

    document.body.removeChild(textarea);

    return ok;
};
