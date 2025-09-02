class Matrix {
    static add(...matrices) {
        return matrices.reduce((accumulator, matrix) => {
            return accumulator.map((row, i) => {
                return row.map((value, j) => {
                    return value + matrix[i][j];
                });
            });
        });
    }

    static multiply(...matrices) {
        return matrices.reduce((accumulator, matrix) => {
            return accumulator.map((row, i) => {
                return matrix[i].map((_, j) => {
                    return row.reduce((sum, value, index) => {
                        return sum + value * matrix[index][j];
                    }, 0);
                });
            });
        });
    }
}
