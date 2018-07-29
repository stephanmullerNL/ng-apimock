# ng-apimock-webdriverio

This is a fork of [ng-apimock](https://github.com/mdasberg/ng-apimock/), modified so that it can be used with webdriver.io
instead of protractor. This is done with as little effort possible, using search & replace and cutting some corners here and there.
Use at your own risk.

It assumes that the location of `wdio.conf.js` is in your root folder (i.e. at the same level as `package.json`) to determine
the baseUrl.

## Installation and usage

Just follow the instructions for  [ng-apimock](https://github.com/mdasberg/ng-apimock/). Every time it says `require('ng-apimock')`
replace that with `require('ng-apimock-webdriverio')`. When it says `protractor.mock.js`, use `wdio.mock.js` instead.
