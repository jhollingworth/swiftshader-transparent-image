# Swiftshader Image transparency bug

This issue demonstrates a bug I'm seeing when rendering WebGL with [Swiftshader](https://github.com/google/swiftshader/).

## Steps to reproduce

On Linux run `chrome --no-gpu`

And then either go to [`https://jhollingworth.github.io/swiftshader-transparent-image/index.html`](https://jhollingworth.github.io/swiftshader-transparent-image/index.html) OR run `make` and then go to `http://localhost:8000`

## Current behaviour

In the transparent regions of the overlayed image, you see nothing (i.e. transparent).

![current-behavior](images/current-behaviour.png)

## Expected behaviour

In the transparent regions of the overlayed image, you see the image behind

![expected-behavior](images/expected-behaviour.png)

_Rendered on Chrome 63_
