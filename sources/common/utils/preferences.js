export const PREFERENCE_INCLUDE_RESULTS = 'PREFERENCE_INCLUDE_RESULTS';
export const PREFERENCE_END_DATE = 'PREFERENCE_END_DATE';

export const getPreference = (key, defaultValue = null) =>
    localStorage.getItem(key) || defaultValue;

export const setPreference = (key, value) => {
    localStorage.setItem(key, String(value));
};
