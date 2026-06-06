export class Vector2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }
    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    norm() {
        const len = this.length();
        if (len === 0)
            return new Vector2D(0, 0);
        return new Vector2D(this.x / len, this.y / len);
    }
}
//# sourceMappingURL=vector.js.map