/**
 * The class that represents a point
 */
export class Point {
    /**
     * Constructs a point
     * @param x The x position of the point
     * @param y The y position of the point
     */
    public constructor(public x : number, public y : number) {}

    /**
     * Returns a string representation on the form x,y
     */
    public toString() : string {
        return this.x + ',' + this.y;
    }
}

/**
 * A class that represents a line
 */
export class Line {
    /**
     * Constructs a line
     * @param point A point of the line
     * @param angle The orientation of the line, in radian (Must be between 0 and PI)
     */
    public constructor(public point : Point, public angle : number) { }

    /**
     * Gets a value indicating whether this line is vertical or not
     * @returns {boolean} true if this line is vertical
     */
    public get isVertical(): boolean {
        return Math.abs(this.angle - (Math.PI / 2)) < 0.0001;
    }

    /**
     * Get the slope of the line
     * @returns {number} The slope of the line
     */
    public get slope(): number {
        if(this.isVertical) {
            return NaN;
        } else {
            return Math.tan(this.angle);
        }
    }

    /**
     * Gets the y-intercept of the line
     * @returns {number} The y-intercept of the line
     */
    public get yIntercept(): number {
        if(this.isVertical) {
            return NaN;
        } else {
            var m = this.slope;
            // y = m*x+b so b = y - m*x
            return this.point.y - m * this.point.x;
        }
    }

    /**
     * Gets a value indicating whether these lines intersect in a single point
     * @param otherLine The other line
     * @returns {boolean} the result of this test
     */
    public hasSingleIntersectionWith(otherLine : Line) : boolean {
        return Math.abs(this.angle - otherLine.angle) >= 0.0001;
    }

    /**
     * Gets an intersection between two lines
     * @param otherLine The other line to intersect with
     */
    public getIntersectionWith(otherLine : Line) : Point {
        if(Math.abs(this.angle - otherLine.angle) < 0.0001) {
            throw new Error("The two lines must not have the same angle");
        }

        var x : number;
        var y : number;

        if(this.isVertical) {
            x = this.point.x;
            y = otherLine.slope * x + otherLine.yIntercept;
            return new Point(x, y);
        } else if(otherLine.isVertical) {
            return otherLine.getIntersectionWith(this);
        }

        // m*x + b = m1*x + b1
        // (m - m1) * x = b1 - b
        // x = (b1 - b) / (m - m1)
        x = (otherLine.yIntercept - this.yIntercept) / (this.slope - otherLine.slope);
        y = this.slope * x + this.yIntercept;
        return new Point(x, y);
    }

    /**
     * Translates the line to create a parallel line at the specified distance (positive or negative)
     * @param distance the distance between the two lines
     * @returns {Line} The translated line
     */
    public translate(distance : number) : Line {
        if(Math.abs(this.angle) < 0.0001) {
            // Horizontal line, just move the point
            return new Line(new Point(this.point.x, this.point.y + distance), this.angle);
        }

        // We are looking for a point on the other line. We make an orthogonal projection and take the triangle formed by the
        // line "y = this.point.y"
        // sin(angle) = distance / deltaX
        // deltaX = distance / sin(angle)
        var deltaX = distance / Math.sin(this.angle);
        return new Line(new Point(this.point.x + deltaX, this.point.y), this.angle);
    }
}