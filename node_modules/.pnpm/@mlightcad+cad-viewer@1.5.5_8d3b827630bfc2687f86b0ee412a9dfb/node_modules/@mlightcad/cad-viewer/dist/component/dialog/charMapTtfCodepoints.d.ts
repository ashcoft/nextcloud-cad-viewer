/**
 * Inclusive Unicode ranges used to build the TTF/mesh character-map grid.
 *
 * @remarks
 * Each tuple is `[startCodePoint, endCodePoint]` (both inclusive). The dialog
 * does not walk the font’s `cmap` in JS; instead it shows this fixed superset
 * of useful blocks (Latin-1 supplement, Latin Extended-A/B, Greek, Cyrillic,
 * General Punctuation, superscripts, currency, letterlike symbols, arrows,
 * mathematical operators, misc technical, box drawing, geometric shapes,
 * dingbats, CJK punctuation/symbols). Glyphs missing from the chosen face
 * typically render as tofu or blank per the browser’s font fallback rules.
 */
export declare const MTEXT_CHARACTER_MAP_TTF_RANGES: readonly [number, number][];
/**
 * Flattens {@link MTEXT_CHARACTER_MAP_TTF_RANGES} into one ascending code-point array.
 *
 * @remarks
 * Surrogate code units U+D800–U+DFFF are skipped so every value is safe for
 * {@link String.fromCodePoint}. The result is computed once at module load in
 * the character map dialog for stable keys and iteration order.
 *
 * @returns All code points from the configured ranges, in ascending order.
 */
export declare function expandTtfCharacterMapCodepoints(): number[];
//# sourceMappingURL=charMapTtfCodepoints.d.ts.map