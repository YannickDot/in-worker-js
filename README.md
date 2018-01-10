# in-worker-js

A primitive to run a function a Web Worker easily!

## Install

```sh
yarn add in-worker
```

OR

```sh
npm install --save in-worker
```

## Usage

```js
import inWorker from 'in-worker'

const params = {
  duration: 1000
}

const runWorker = inWorker(params, (done, params) => {
  // do stuff and call done()
  // to go back to main thread
  setTimeout(() => done('Hello from a worker!'), params.duration)
})

const killWorker = runWorker(onError, onSuccess) // run the worker

killWorker() // abort the worker
```
