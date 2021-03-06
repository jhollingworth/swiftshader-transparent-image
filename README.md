# Swiftshader Image transparency bug

This issue demonstrates a bug I'm seeing when rendering WebGL with [Swiftshader](https://github.com/google/swiftshader/) in headless mode.

[Demo](https://jhollingworth.github.io/swiftshader-transparent-image/index.html)

## Steps to reproduce

On Linux (Tested on Cent OS 7) run these two commands 

* `node screenshot.js --headless=true` 
* `xvfb-run --server-args='-screen 0 1500x1500x16' node screenshot.js --headless=false`

When Chrome is run in headless mode (headless.png) the transparent regions of the overlayed image are visible.

![current-behavior](images/current-behaviour.png)

When using XVFB to run Chrome (xvfb.png) you will see the underlying color in the transparent regions.

![expected-behavior](images/expected-behaviour.png)
