# Liquality <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

[![Standard Code Style](https://img.shields.io/badge/codestyle-standard-brightgreen.svg)](https://github.com/standard/standard)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./LICENSE.md)
[![Liquality](https://img.shields.io/npm/dt/liquality.svg)](https://npmjs.com/package/liquality)
[![Gitter](https://img.shields.io/gitter/room/liquality/Lobby.svg)](https://gitter.im/liquality/Lobby?source=orgpage)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/Liquality)


A handy tool to quickly get started with Liquality Atomic Swap (https://liquality.io)


## Usage

```
npx liquality --help

Usage: liquality [options]

Options:
  -V, --version            output the version number
  -s, --skip-latest-check  Use the most recent version available on the disk
  -d, --do-not-open        Do not open the application link in the browser
  -p, --port <port>        Application port. Default 8080
  --btc-rpc <url>          Bitcoin RPC endpoint. Default http://localhost:18332
  --btc-rpc-user <user>    Bitcoin RPC user. Default bitcoin
  --btc-rpc-pass <pass>    Bitcoin RPC pass. Default local321
  --eth-rpc <url>          Ethereum RPC endpoint. Default http://localhost:8545
  -h, --help               output usage information
```

## Installation

```
npm i -g liquality
```


## Deploy Your Own Liquality Instance

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## License

[MIT](./LICENSE.md)
