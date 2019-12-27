function GLMath() {
    this.mtx = this.perspective_mtx = this.ortho_mtx = this.look_mtx = this.setOne();
};
GLMath.prototype.setOne = function() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
};
GLMath.prototype.multiplyTwoMatrix = function(first, second) {
    if (first.length % second.length != 0 && second.length % first.length != 0) {
        console.error('matrixs multiply error!');
        return false
    }
    if (first.length != second.length) {
        lines_number = (first.length > second.length) ? first.length / second.length : second.length / first.length;
        columns_number = 1;
        // not today
    } else {
        if (Math.sqrt(first.length) != Math.floor(Math.sqrt(first.length))) {
            lines_number = 1;
            columns_number = 1;
            // not today
        } else {
            lines_number = columns_number = Math.sqrt(first.length);
            let result = [];
            let colum_index = 0;
            for (let index = 0; index < first.length; index++) {
                let iteretion = Math.floor(index / lines_number);
                result[index] = 0;
                for (let i = 0; i < lines_number; i++) {
                    result[index] += first[iteretion * lines_number + i] * second[i * lines_number + colum_index];
                }
                colum_index = (colum_index < 3) ? colum_index + 1 : 0;
            }
            return result;
        }
    };
};
GLMath.prototype.translateY = function(delta) {
    let delta_matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, delta, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.translateX = function(delta) {
    let delta_matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        delta, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.translateZ = function(delta) {
    let delta_matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, delta, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.rotateZ = function(angle) {
    let delta_matrix = [
        Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.rotateX = function(angle) {
    let delta_matrix = [
        1, 0, 0, 0,
        0, Math.cos(angle), Math.sin(angle), 0,
        0, -Math.sin(angle), Math.cos(angle), 0,
        0, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.rotateY = function(angle) {
    let delta_matrix = [
        Math.cos(angle), 0, Math.sin(angle), 0,
        0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0,
        0, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.scaleX = function(l) {
    let delta_matrix = [
        l, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.scaleY = function(l) {
    let delta_matrix = [
        1, 0, 0, 0,
        0, l, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.scaleZ = function(l) {
    let delta_matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, l, 0,
        0, 0, 0, 1
    ];
    this.mtx = this.multiplyTwoMatrix(this.mtx, delta_matrix);
};
GLMath.prototype.setPerspective = function(fieldOfViewInRadians, aspect, near, far) {
    let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    let rangeInv = 1.0 / (near - far);
    this.perspective_mtx = [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ];
};
GLMath.prototype.setOrtho = function(left, right, bottom, top, near, far) {
    this.ortho_mtx = [
        2 / (right - left), 0, 0, -(right + left) / (right - left),
        0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
        0, 0, -2 / (far - near), -(far + near) / (far - near),
        0, 0, 0, 1
    ];
};
GLMath.prototype.normalize = function(arr) {
    let length = 0;
    let ans = [];
    for (let i = 0; i < arr.length; i++) {
        length += Math.pow(arr[i], 2);
    };
    length = Math.sqrt(length);
    for (let i = 0; i < arr.length; i++) {
        ans[i] = arr[i] / length;
    };
    return ans;
}

GLMath.prototype.inverseMat = function(usermat) {
    this.inverse = [];
    let newMat = (usermat != undefined) ? usermat : this.matrix;
    let local_determinant = 1 / this.determinant(JSON.parse(JSON.stringify(newMat)));
    for (let index = 0; index < Math.sqrt(newMat.length); index++) {
        for (let i = 0; i < Math.sqrt(newMat.length); i++) {
            this.inverse.push(Math.pow(-1, i + index + 2) * this.minor(JSON.parse(JSON.stringify(newMat)), i, index) * local_determinant);
        }
    }
    return this;
}
GLMath.prototype.minor = function(matrix_m, column, line) {

    let new_minor = matrix_m;
    let sqrt_from = Math.sqrt(matrix_m.length);

    for (let index = 0; index < sqrt_from; index++) {
        new_minor.splice(index * sqrt_from + column - index, 1);
    };

    new_minor.splice((sqrt_from - 1) * line, sqrt_from - 1);

    return this.determinant(new_minor);
}
GLMath.prototype.determinant = function(matrix_f) {
    let sqrt_from = Math.sqrt(matrix_f.length);
    if (sqrt_from % 1 > 0) {
        console.error('the matrix is ​​not square');
    } else if (sqrt_from == 2) {
        return matrix_f[0] * matrix_f[3] - matrix_f[1] * matrix_f[2];
    } else {
        let result = 0;
        for (let index = 0; index < sqrt_from; index++) {
            let copy_f = matrix_f;
            result += Math.pow(-1, index + 2) * matrix_f[index] * this.minor(JSON.parse(JSON.stringify(copy_f)), index, 0);
        }
        return result;
    }
}
GLMath.prototype.setLookAt = function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
    var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

    fx = centerX - eyeX;
    fy = centerY - eyeY;
    fz = centerZ - eyeZ;

    // Normalize f.
    rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;

    // Calculate cross product of f and up.
    sx = fy * upZ - fz * upY;
    sy = fz * upX - fx * upZ;
    sz = fx * upY - fy * upX;

    // Normalize s.
    rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;

    // Calculate cross product of s and f.
    ux = sy * fz - sz * fy;
    uy = sz * fx - sx * fz;
    uz = sx * fy - sy * fx;

    // Set to this.
    e = [];
    e[0] = sx;
    e[1] = ux;
    e[2] = -fx;
    e[3] = 0;

    e[4] = sy;
    e[5] = uy;
    e[6] = -fy;
    e[7] = 0;

    e[8] = sz;
    e[9] = uz;
    e[10] = -fz;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
    this.look_mtx = e;

};