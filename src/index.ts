import {
  initModule,
  log,
  onRPCInvoke,
  ActionMessage,
  reply,
} from "@statehub/modlib"

initModule({
  routes: [
    {
      method: 'get',
      path: '/ping',
      handlerId: 'ping',
      auth: false
    },
  ],
  commands: [
    { command: 'ping', handlerId: 'ping', broadcast: false, auth: false }
  ]
})

const handlers: Record<string, (payload: any) => any> = {
  ping: (_payload) => {
    log('Ping received')
    return {
      message: `pong`
    }
  }
}

onRPCInvoke((msg?: ActionMessage) => {
  if (!msg?.id || !msg.handlerId) return
  const fn = handlers[msg.handlerId]
  if (!fn) return

  const res = fn(msg.payload)
  reply(msg.id, res)
})
