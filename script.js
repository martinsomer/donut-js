let A = 0;
let B = 0;

const config = {};

function render (context) {
    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const theta_spacing = 2*Math.PI*config.r1 / config.dots;
    const phi_spacing = 2*Math.PI*config.r2 / config.slices;

    for (let theta = 0; theta < 2*Math.PI; theta += theta_spacing) {
        for (let phi = 0; phi < 2*Math.PI; phi += phi_spacing) {
            let vertex = Matrix.add(
                [[config.r2, 0, 0]],
                [[config.r1 * Math.cos(theta), 0, config.r1 * Math.sin(theta)]]
            );

            vertex = Matrix.multiply(vertex, [
                    [Math.cos(phi), -Math.sin(phi), 0],
                    [Math.sin(phi), Math.cos(phi), 0],
                    [0, 0, 1]
                ], [
                    [Math.cos(A), 0, Math.sin(A)],
                    [0, 1, 0],
                    [-Math.sin(A), 0, Math.cos(A)]
                ], [
                    [1, 0 , 0],
                    [0, Math.cos(B), -Math.sin(B)],
                    [0, Math.sin(B), Math.cos(0)]
                ]
            );

            const [x, y, z] = vertex[0];

            px = (config.k1 * x) / (config.k2 + z);
            py = (config.k1 * y) / (config.k2 + z);

            px += context.canvas.width / 2;
            py += context.canvas.height / 2;

            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.fillRect(px, py, 1.5, 1.5);
        }
    }

    A += config.rotation_x;
    B += config.rotation_y;
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => update(event.target));
        update(input);
    });

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    (function tick() {
        render(context)
        setTimeout(tick, config.speed)
    })();
});

function update (input) {
    config[input.name] = parseFloat(input.value);
}
