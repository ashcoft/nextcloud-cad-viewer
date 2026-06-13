const MODEL_SPACE = '*MODEL_SPACE';
const MODEL_SPACE_PREFIX = '*PAPER_SPACE';
export const isModelSpace = (name) => {
    return name && name.toUpperCase() == MODEL_SPACE;
};
export const isPaperSpace = (name) => {
    return name && name.toUpperCase().startsWith(MODEL_SPACE_PREFIX);
};
export const idToString = (id) => {
    return id.toString(16).toUpperCase();
};
//# sourceMappingURL=utils.js.map