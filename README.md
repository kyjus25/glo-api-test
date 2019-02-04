# glo-api-test

Testing grounds for Axosoft's new Glo API

## Getting Started

Install dependencies:

``` bash
npm install
```

Other dependencies:
• You will need a GLO OAuth config from Axosoft in order to proceed.
• Copy `src/config.tpl.json` to `src/config.json `

Build angular2 code and run current app locally:

``` bash
npm start
```

## Build

WARNING - electron-packager not working on latest Node.js for me... Check this later?

Install global dependencies:

``` bash
npm install electron-packager -g
```

Build for Mac

``` bash
npm run package-mac
```

Build for Windows

``` bash
npm run package-windows
```

Build for Linux

``` bash
npm run package-linux
```
