class ConjunctionBranch {
    constructor(words, conjunction = "and", next_word = null, x = 0, y = 0) {
        // word type of each word: string -> Word
        words.forEach((word, index) => {
            if (typeof word === 'string') {
                words[index] = new Word(word);
            }
        });

        conjunction = new Word(conjunction);

        this.x = x;
        this.y = y;
        this.words = words;
        this.conjunction = conjunction;

        this.next_word = next_word;

        this.updateDottedLine();
    }

    static CONJUNCTION_SPACER = 0;

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    addWord(word) {
        if (typeof word === 'string') {
            word = new Word(word);
        }
        this.words.push(word);
        this.updateDottedLine();
    }

    defaultWidth() {
        open_and_close = this.next_word ? 1 : 0;
        return this.widestWordWidth() + this.dotted_line.height * (open_and_close + 1) / 2;
    }

    widestWordWidth() {
        let widest_width = this.words[0].defaultWidth();

        this.words.forEach(
            word => {
                widest_width = Math.max(widest_width, word.defaultWidth());
            }
        )

        return widest_width;
    }

    defaultHeight() {
        return this.dotted_line.height + this.words[0].heightAbove() + this.words.at(-1).heightBelow();
    }

    heightAbove() {
        return this.dotted_line.height / 2 + this.words[0].heightAbove();
    }

    heightBelow() {
        return this.dotted_line.height / 2 + this.words.at(-1).heightBelow();
    }

    totalHeight() {
        // INCLUDES case where the conjunction is wide enough
        // that the dotted line height is increased.
        this.updateDottedLine();
        return this.dotted_line.height + this.words[0].heightAbove() + this.words.at(-1).heightBelow()
    }

    wordHeightSum() {
        // does NOT include case where the conjunction is wide enough
        // that the dotted line height is increased.
        // JUST the sum of the word heights.

        let sum = 0;
        // sum all word heights
        this.words.forEach(
            word => {
                sum += word.totalHeight();
            }
        );

        return sum;
    }

    updateDottedLine() {
        this.dotted_line = {
            x: this.x,
            y: this.y,
            height: 0,
            default_height: 0
        };

        // word height sum minus top and bottom of first and last words respectively
        this.dotted_line.height = this.wordHeightSum() -
            this.words[0].heightAbove() -
            this.words.at(-1).heightBelow();

        // store default height for later
        this.dotted_line.default_height = this.dotted_line.height;



        // if conjunction is too big, increase dotted line height
        this.dotted_line.height = Math.max(
            this.dotted_line.height,
            this.conjunction.defaultWidth() + ConjunctionBranch.CONJUNCTION_SPACER * 2
        );



        this.dotted_line.y -= this.dotted_line.height / 2;

        // adjust x coord to make a 90° angle
        this.dotted_line.x += this.dotted_line.height / 2;
    }

    draw(dummy_arg = null, draw_x = this.x, draw_y = this.y) {
        const original_x = this.x;
        const original_y = this.y;

        this.x = draw_x;
        this.y = draw_y;

        this.updateDottedLine();

        //#region triangle;
        // draw dotted line
        brush.beginPath();
        brush.setLineDash([5, 5]);
        brush.moveTo(this.dotted_line.x, this.dotted_line.y);
        brush.lineTo(this.dotted_line.x, this.dotted_line.y + this.dotted_line.height);
        brush.stroke();

        // draw line from this.(x, y) to this.dotted_line's top endpoint
        brush.beginPath();
        brush.setLineDash([]);
        brush.moveTo(this.x, this.y);
        brush.lineTo(this.dotted_line.x, this.dotted_line.y);
        brush.stroke();

        // draw line from this.(x, y) to this.dotted_line's bottom endpoint
        brush.beginPath();
        brush.setLineDash([]);
        brush.moveTo(this.x, this.y);
        brush.lineTo(this.dotted_line.x, this.dotted_line.y + this.dotted_line.height);
        brush.stroke();
        //#endregion triangle;

        // set coords and draw conjunction
        // center it on this.dotted_line
        // draw it vertically
        this.conjunction.setCoords(
            this.dotted_line.x - Word.UNDERLINE_OFFSET,
            this.dotted_line.y + this.dotted_line.height / 2 + this.conjunction.textWidth() / 2
        );
        this.conjunction.drawVertical();


        // #region words;
        // start at this.dotted_line's top endpoint
        let current_y = this.dotted_line.y - this.words[0].heightAbove();

        let extra_dy = this.dotted_line.height - this.dotted_line.default_height;
        extra_dy /= this.words.length - 1;

        let widest_width = this.words[0].defaultWidth();

        this.words.forEach(
            word => {
                widest_width = Math.max(widest_width, word.defaultWidth());
            }
        )

        widest_width += Word.HORIZONTAL_PADDING * 2;

        this.words.forEach(
            word => {
                current_y += word.heightAbove();

                // set word's x and y coords
                word.setCoords(
                    this.dotted_line.x,
                    current_y
                );

                // draw the word
                word.draw(widest_width);

                current_y += word.heightBelow() + extra_dy;
            }
        )

        // #endregion words;

        // #region next_word;

        if (!this.next_word) return;

        // draw lines from the end of each underline to
        // the beginning of the next word's underline
        // which is at this.x + widest_width + this.dotted_line.height, this.y
        this.words.forEach(
            word => {
                brush.beginPath();
                brush.setLineDash([]);
                brush.moveTo(
                    word.x + widest_width,
                    word.y
                );
                brush.lineTo(
                    this.x + widest_width + this.dotted_line.height,
                    this.y
                );
                brush.stroke();
            }
        );

        // draw the next word
        this.next_word.setCoords(
            this.x + widest_width + this.dotted_line.height,
            this.y
        );
        this.next_word.draw();

        // #endregion next_word;

        this.x = original_x;
        this.y = original_y;
    }
}