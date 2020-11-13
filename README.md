# NgxOverlay

![Test](https://github.com/2YY/ngx-overlay/workflows/Test/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/c00046125264170a84e5/maintainability)](https://codeclimate.com/github/2YY/ngx-overlay/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c00046125264170a84e5/test_coverage)](https://codeclimate.com/github/2YY/ngx-overlay/test_coverage)

## Installation

`npm i 2yy-ngx-overlay`

## Motivation

- To follow the DRY Principle when writing overlay showing/hiding logic.
- Manage multiple overlay state in a screen.

## Usage

1. Create your overlay slot (with your overlay config)
2. Attach your overlay to slot

### Create your overlay slot

`this.myOverlaySlotId = this.ngxOverlayService.addOverlaySlot(myOverlayConfig)`

### Attach your overlay to slot

`this.ngxOverlayService.show(this.myPortal, this.myOverlaySlotId)`

## License

[MIT License](./LICENSE)
