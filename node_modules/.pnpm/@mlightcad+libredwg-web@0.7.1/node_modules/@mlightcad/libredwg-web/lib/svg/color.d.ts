export declare class Color {
    private _colorIndex;
    private _color;
    private _colorName;
    static NAMES: Record<string, number>;
    constructor();
    get color(): number | null;
    set color(value: number | null);
    get hexColor(): string;
    get cssColor(): string;
    get red(): number | null;
    get green(): number | null;
    get blue(): number | null;
    /**
     * AutoCAD color index value. The index value will be in the range 0 to 256. 0 and 256 are special values.
     * If value less than 0 is set, 0 will be used. If value greater than 256 is set, 256 will be used.
     * - 0 indicates that the entity uses the color of the BlockReference that's displaying it. If the entity
     * is not displayed through a block reference (for example, it is directly owned by the model space
     * block table record) and its color is 0, then it will display as though its color were 7.
     * - 256 indicates that the entity uses the color specified in the layer table record it references.
     */
    get colorIndex(): number | null;
    set colorIndex(value: number | null);
    get colorName(): string | null;
    set colorName(value: string | null);
    get hasColorName(): boolean;
    get hasColorIndex(): boolean;
    get isByLayer(): boolean;
    setByLayer(): this;
    get isByBlock(): boolean;
    setByBlock(): this;
    setScalar(scalar: number): this;
    setRGB(r: number, g: number, b: number): this;
    setColorName(style: string): this;
    clone(): this;
    copy(color: Color): this;
    equals(c: Color): boolean;
    toString(): string;
    private getColorNameByValue;
    private getColorIndexByValue;
}
//# sourceMappingURL=color.d.ts.map