const config = {};
const state = { x: 0, y: 0 };

function render(context) {
    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const theta_spacing = 2*Math.PI*config.r1 / config.dot_count;
    const phi_spacing = 2*Math.PI*config.r2 / config.circle_count;

    for (let theta = 0; theta < 2*Math.PI; theta += theta_spacing) {
        for (let phi = 0; phi < 2*Math.PI; phi += phi_spacing) {
            const rotation_matrix = Matrix.multiply(
                [
                    [Math.cos(phi), -Math.sin(phi), 0],
                    [Math.sin(phi), Math.cos(phi), 0],
                    [0, 0, 1],
                ],
                [
                    [1, 0 , 0],
                    [0, Math.cos(state.x), -Math.sin(state.x)],
                    [0, Math.sin(state.x), Math.cos(state.x)],
                ],
                [
                    [Math.cos(state.y), 0, Math.sin(state.y)],
                    [0, 1, 0],
                    [-Math.sin(state.y), 0, Math.cos(state.y)],
                ],
            );

            let point = Matrix.add(
                [[config.r2, 0, 0]],
                [[config.r1 * Math.cos(theta), 0, config.r1 * Math.sin(theta)]],
            );

            point = Matrix.multiply(point, rotation_matrix);
            const [x, y, z] = point[0];

            xp = (config.k1 * x) / (config.k2 + z);
            yp = (config.k1 * y) / (config.k2 + z);

            xp += context.canvas.width / 2;
            yp += context.canvas.height / 2;

            let luminance = 1;
            if (config.shading) {
                const normal = Matrix.multiply(
                    [[Math.cos(theta), 0, Math.sin(theta)]],
                    rotation_matrix,
                );

                const [nx, ny, nz] = normal[0];
                luminance = nx * config.light_x + ny * config.light_y + nz * config.light_z;
            }

            context.fillStyle = `rgba(${config.color.red}, ${config.color.green}, ${config.color.blue}, ${luminance})`;
            context.fillRect(xp, yp, 1.5, 1.5);
        }
    }

    Object.assign(state, {
        x: state.x + config.rotation_x,
        y: state.y + config.rotation_y,
    });
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
        render(context);
        setTimeout(tick, config.delay);
    })();
});

function update (input) {
    switch (input.type) {
        case 'range':
            config[input.name] = parseFloat(input.value);
            break;
        case 'checkbox':
            config[input.name] = input.checked;
            break;
        case 'color':
            config[input.name] = {
                red: parseInt(input.value.substr(1,2), 16),
                green: parseInt(input.value.substr(3,2), 16),
                blue: parseInt(input.value.substr(5,2), 16),
            };
        default:
            break;
    }
}
