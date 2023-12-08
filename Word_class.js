class Word {
    constructor(text, modifiers = [], leftDecoration = null, next_word = null, x = 0, y = 0) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.default_width = 0;
        this.height_below = 0;
        this.height_above = 0;
        this.next_word = next_word;
        this.leftDecoration = leftDecoration;

        this.modifiers = modifiers;
        
        // if modifiers is null, set it to an empty array
        if (!this.modifiers) {
            this.modifiers = [];
        }

        this.modifiers.forEach(
            (modifier, index) => {
                modifier = new Modifier(modifier);
                this.modifiers[index] = modifier;
            }
        );

        this.updateDimensions();
    }

    static UNDERLINE_OFFSET = 5;
    static HORIZONTAL_PADDING = 20;

    setNextWord(next_word) {
        this.next_word = next_word;
    }

    // #region draw;
    draw(underline_width = this.default_width, draw_x = this.x, draw_y = this.y) {
        const original_x = this.x;
        const original_y = this.y;

        this.x = draw_x;
        this.y = draw_y;

        this.updateDimensions();
        // draw the word
        brush.fillText(
            this.text,
            this.x + underline_width / 2 - this.text_width / 2,
            this.y - Word.UNDERLINE_OFFSET
        );
        // draw the underline
        brush.beginPath();
        brush.moveTo(this.x, this.y);
        brush.lineTo(this.x + underline_width, this.y);
        brush.stroke();

        // draw next word at the end of the underline
        if (this.next_word) {
            this.next_word.setCoords(
                this.x + underline_width,
                this.y
            );
            this.next_word.draw();
        }

        // add left decoration
        switch (this.leftDecoration) {
            case "V":
                brush.beginPath();
                brush.moveTo(this.x, this.y + Word.UNDERLINE_OFFSET * 2);
                brush.lineTo(this.x, this.y - Word.HORIZONTAL_PADDING);
                brush.stroke();
                break;
            case "O":
                brush.beginPath();
                brush.moveTo(this.x, this.y);
                brush.lineTo(this.x, this.y - Word.HORIZONTAL_PADDING);
                brush.stroke();
                break;
            case "A":
                brush.beginPath();
                brush.moveTo(this.x + Word.HORIZONTAL_PADDING / 2, this.y);
                brush.lineTo(
                    this.x - Word.HORIZONTAL_PADDING / 2,
                    this.y - Word.HORIZONTAL_PADDING);
                brush.stroke();
                break;
        }


        
        this.modifiers.forEach(
            modifier => {
                modifier.setCoords(
                    this.x + underline_width / 2,
                    this.y
                );
                modifier.draw();
            }
        );

        this.x = original_x;
        this.y = original_y;
    }

    drawVertical(x = this.x, y = this.y) {
        // save the current state of the brush
        // ie position, rotation, etc
        brush.save();

        brush.translate(x, y);
        brush.rotate(-Math.PI / 2);

        // draw the word
        brush.fillText(this.text, 0, 0);

        // restore the brush to its previous state
        brush.restore();
    }
    // #endregion draw;

    // #region updates;
    setCoords(x = this.x, y = this.y) {
        if (x) this.x = x;
        if (y) this.y = y;
    }

    updateDimensions() {
        // text dimensions
        this.text_width = brush.measureText(this.text).width;
        this.text_height = getTextHeight().height;

        // object dimensions
        this.default_width = this.text_width + 2 * Word.HORIZONTAL_PADDING;
        this.height_above = this.text_height + Word.UNDERLINE_OFFSET;
        this.height_below = 0; // TODO: include modifiers in the height
    }
    // #endregion updates;

    // #region getters;
    defaultWidth() {
        return this.default_width;
    }

    heightAbove() {
        return this.height_above;
    }

    heightBelow() {
        return this.height_below;
    }

    totalHeight() {
        return this.heightBelow() + this.heightAbove();
    }

    textWidth() {
        return this.text_width;
    }

    textHeight() {
        return this.text_height;
    }
    // #endregion getters;

}