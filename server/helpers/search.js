exports.mapSearchToMatchAgainst = (search) =>
    search
        .trim()
        .split(/\W/)
        .filter(Boolean)
        .map((w) => `+${w}`)
        .join(' ');
