export const mapSearchToWords = (search: string) => {
    return search
        .split(' ')
        .map((s) => s.trim())
        .filter(Boolean);
};
