// make page reload when refocused
window.addEventListener('focus', () => {
    location.reload();
});

let diagram = new EntireDiagram();

// // make a text box that can be edited
// const text_box = document.createElement('textarea');

// // // when the text box is edited, update the diagram
// // text_box.addEventListener('input', () => {
// //     diagram.parseString(text_box.value);
// // });

// // set the text box's height
// text_box.style.height = '500px';

// // add the text box to the body
// document.body.appendChild(text_box);

// Create a canvas element
const canvas = document.createElement('canvas');
const brush = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 500;

// Add canvas to the body
document.body.appendChild(canvas);

const short_conj = "and";
const long_conj = "spectacularly long conjunction";
const longer_conj = "spectacularly long conjunction that's somehow still not long enough";
const longest_conj = "spectacularly long conjunction that's somehow still not long enough to be the longest conjunction";




diagram.addElement(
    new ConjunctionBranch(
        [
            "two number nines",
            "a number nine large",
            "a number six with extra dip",
            "a number seven",
            "two number forty-fives (one with cheese)",
            "a large soda",
        ],
        short_conj,
        new Word(
            "jumps",
            [],
            "V",
            null
        ),
        200,
        200
    )
);

diagram.addElement(
    new Word(
        "she",
        [],
        "S",
        new Word(
            "paints",
            [
                "quickly"
            ],
            "V",
            new Word(
                "houses",
                [],
                "O",
                new Word(
                    "green",
                    [],
                    "A"
                )
            )
        ),
        200,
        400
    )
);

// draw the word group with a refresh rate of 60 fps
setInterval(() => {
    brush.clearRect(0, 0, canvas.width, canvas.height);
    diagram.render();
}, 1000 / 60);

// dragging on the canvas moves the diagram
let is_dragging = false;
let drag_start_x = 0;
let drag_start_y = 0;
canvas.addEventListener('mousedown', (event) => {
    is_dragging = true;
    drag_start_x = event.clientX;
    drag_start_y = event.clientY;
});
canvas.addEventListener('mousemove', (event) => {
    if (is_dragging) {
        diagram.elements.forEach(
            element => {
                element.x += event.clientX - drag_start_x;
                element.y += event.clientY - drag_start_y;
            }
        );
        drag_start_x = event.clientX;
        drag_start_y = event.clientY;
    }
});
canvas.addEventListener('mouseup', () => {
    is_dragging = false;
});

// zooming on the canvas -> diagram.setZoom()
canvas.addEventListener('wheel', (event) => {
    diagram.setZoom(diagram.zoom + event.deltaY / 1000);
});

// slider that controls Word.HORIZONTAL_PADDING
const slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.max = 100;
slider.value = Word.HORIZONTAL_PADDING;
slider.addEventListener('input', () => {
    Word.HORIZONTAL_PADDING = slider.value;
});
document.body.appendChild(slider);

// value display
const value_display = document.createElement('p');
document.body.appendChild(value_display);
setInterval(() => {
    value_display.innerHTML = Word.HORIZONTAL_PADDING;
}, 1000 / 60);
