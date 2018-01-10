function serializeParams(context) {
  const pairs = Object.keys(context)
    .map(key => `${key} : ${JSON.stringify(context[key])}`)
    .join(', ')
  return `{ ${pairs} }`
}

function buildWorkerCode(fn, context) {
  function mapArgToVariable(key, index) {
    if (index === 0) {
      return (key.length !== 0 && `var ${key} = DISPATCH_TO_MAIN_THREAD;`) || ''
    } else if (index === 1) {
      return (
        (key.length !== 0 && `var ${key} = ${serializeParams(context)}`) || ''
      )
    } else {
      return ''
    }
  }

  const userWorkerCode = fn.toString()
  const argumentsStr = userWorkerCode.substring(
    userWorkerCode.indexOf('(') + 1,
    userWorkerCode.indexOf(')')
  )
  const argKeys = argumentsStr.split(',').map(s => s.trim())
  const argsCode = argKeys.map(mapArgToVariable).join('\n')

  const code = `
var DISPATCH_TO_MAIN_THREAD = (x) => postMessage(JSON.stringify(x))
${argsCode}
${userWorkerCode.substring(
    userWorkerCode.indexOf('{') + 1,
    userWorkerCode.lastIndexOf('}')
  )}
  `
  return code
}

export default function inWorker(params, fn) {
  var workerFn
  var context
  if (!fn && typeof params === 'function') {
    workerFn = params
    context = {}
  } else {
    workerFn = fn
    context = params
  }
  return (onError, onSuccess) => {
    const code = buildWorkerCode(workerFn, context)
    const blob = new Blob([code], { type: 'application/javascript' })
    const worker = new Worker(URL.createObjectURL(blob))
    const stop = () => worker.terminate()

    worker.onmessage = function(msg) {
      onSuccess(JSON.parse(msg.data))
      stop()
    }

    worker.onerror = function(err) {
      onError(err)
      stop()
    }

    return stop
  }
}

/** USAGE :

const params = {
  duration: 1000
}

const runWorker = runInWorker((done, params) => {
  // do stuff and call done()
  // to go back to main thread
  setTimeout(done, params.duration, 'Hello from a worker!')
}, params)

const killWorker = runWorker(onError, onSuccess)

// to abort the worker
killWorker()

**/
