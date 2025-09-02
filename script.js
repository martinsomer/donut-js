let dots_per_circle = 16;
let circles_per_torus = 128;

let r1 = 1; // Radius of circle
let r2 = 2; // Radius of torus

let k1 = 1024; // Camera-screen distance
let k2 = 16; // Camera-donut distance

let A = 0; // Y rotation
let B = 0; // X rotation

function render (context) {
    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const theta_spacing = 2*Math.PI*r1 / dots_per_circle;
    const phi_spacing = 2*Math.PI*r2 / circles_per_torus;

    for (let theta = 0; theta < 2*Math.PI; theta += theta_spacing) {
        for (let phi = 0; phi < 2*Math.PI; phi += phi_spacing) {
            let vertex = Matrix.add(
                [[r2, 0, 0]],
                [[r1 * Math.cos(theta), 0, r1 * Math.sin(theta)]]
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

            px = (k1 * x) / (k2 + z);
            py = (k1 * y) / (k2 + z);

            px += context.canvas.width / 2;
            py += context.canvas.height / 2;

            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.fillRect(px, py, 1.5, 1.5);
        }
    }

    A += 0.07;
    B += 0.03;
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.setInterval(() => render(context), 50);
});
