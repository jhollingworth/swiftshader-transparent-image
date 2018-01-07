var VERTEX_SHADER = `
       attribute vec4 a_position;
       attribute vec2 a_texcoord;

       uniform mat4 u_matrix;

       varying vec2 v_texcoord;

       void main() {
        gl_Position = u_matrix * a_position;
        v_texcoord = a_texcoord;
       }
     `;

var FRAGMENT_SHADER = `
       precision mediump float;

       varying vec2 v_texcoord;

       uniform sampler2D u_texture;

       void main() {
          gl_FragColor = texture2D(u_texture, v_texcoord);
       }
     `;

var width = 750;
var height = 750;

var canvas = document.createElement('canvas');

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

var gl = canvas.getContext('webgl', {
  premultipliedAlpha: false
});

var program = createProgram();

var positionLocation = gl.getAttribLocation(program, 'a_position');
var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');

var matrixLocation = gl.getUniformLocation(program, 'u_matrix');
var textureLocation = gl.getUniformLocation(program, 'u_texture');

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

var texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

Promise.all([
  loadImageAndCreateTextureInfo('images/background.jpg'),
  loadImageAndCreateTextureInfo('images/flower.png')
]).then(render);

function render([background, flower]) {
  drawImage(background, 750, 750, 0, 0);
  drawImage(flower, 119, 181, 315, 284);
}

function drawImage(tex, texWidth, texHeight, dstX, dstY) {
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  matrix = m4.translate(matrix, dstX, dstY, 0);

  matrix = m4.scale(matrix, texWidth, texHeight, 1);

  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.uniform1i(textureLocation, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function loadImageAndCreateTextureInfo(url) {
  return new Promise(resolve => {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var img = new Image();

    img.addEventListener('load', function() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      resolve(tex);
    });

    img.src = url;
  });
}

function createProgram() {
  var program = gl.createProgram();

  gl.attachShader(program, loadShader(VERTEX_SHADER, gl.VERTEX_SHADER));
  gl.attachShader(program, loadShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER));
  gl.linkProgram(program);

  return program;

  function loadShader(shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    return shader;
  }
}
