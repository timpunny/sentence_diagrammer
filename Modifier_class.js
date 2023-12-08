class Modifier extends Word {
    constructor(text, modifiers = [], next_word = null, x = 0, y = 0) {
        super(text, modifiers, null, next_word, x, y);
    }

    static UNDERLINE_OFFSET = 5;
    static HORIZONTAL_PADDING = 20;

    // #region draw;
    draw(underline_width = this.default_width, draw_x = this.x, draw_y = this.y) {
        const original_x = this.x;
        const original_y = this.y;

        this.x = draw_x;
        this.y = draw_y;

        this.updateDimensions();

        console.log(this)

        // save the current brush state
        brush.save();

        // rotate clockwise 45 degrees
        brush.translate(this.x, this.y);
        brush.rotate(Math.PI / 4);

        // draw the word
        brush.fillText(
            this.text,
            this.x,
            this.y
        );

        // restore
        brush.restore();

        // draw the underline
        brush.beginPath();
        brush.moveTo(this.x, this.y);
        brush.lineTo(this.x + underline_width, this.y);
        brush.stroke();

        // // restore the brush state
        // brush.restore();

        // draw next word at the end of the underline
        if (this.next_word) {
            this.next_word.setCoords(
                this.x + underline_width,
                this.y
            );
            this.next_word.draw();
        }

        // no decorations for modifiers

        // #endregion draw;

        this.x = original_x;
        this.y = original_y;
    }
}