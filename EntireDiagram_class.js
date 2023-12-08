class EntireDiagram {
    constructor() {
        this.elements = [];
        this.zoom = 1;
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    addElement(element) {
        this.elements.push(element);
    }

    render() {
        // clear the canvas
        brush.clearRect(0, 0, canvas.width, canvas.height);
        this.elements.forEach(
            element => {
                brush.scale(this.zoom, this.zoom);
                element.draw(undefined, element.x, element.y + Math.sin(Date.now() / 650) * 3);
                brush.scale(1/this.zoom, 1/this.zoom);
            }
        );
    }

    parseString(string) {
        const lines = string.split("\n");

        const keywords = [
            "s",
            "v",
            "o",
            "a",
            "&",
        ]

        // if any line has more than 4 words, it's not valid
        if (lines.some(line => line.split(" ").length > 4)) {
            return;
        }




    }
}