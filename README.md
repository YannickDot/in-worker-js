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

// run the worker
const killWorker = runWorker(onError, onSuccess)

// abort the worker
killWorker()
```

With Promises (useful if you want to use it with async functions) :


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

// run the worker
const workerPromise = new Promise((res, rej) => runWorker(rej, res))

workerPromise
  .then(console.log)
  .catch(console.error)
```

With Tasks :

```js
import inWorker from 'in-worker'
import Task from 'taskorama'

const params = {
  duration: 1000
}

const runWorker = inWorker(params, (done, params) => {
  setTimeout(() => done('Hello from a worker!'), params.duration)
})

const workerTask = Task((rej, res) => {
  return { cancel: runWorker(rej, res) }
})

// run the worker
const taskExec = workerTask
  .fork(console.error, console.log)

// abort the worker
taskExec.cancel()
```
