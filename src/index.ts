import {
  initModule,
  log,
  onRPCInvoke,
  ActionMessage,
  reply,
} from '@statehub/modlib'
import { Router } from 'express'

initModule({
  commands: [
    { command: 'ping', handlerId: 'ping', broadcast: false, auth: false }
  ]
})

onRPCInvoke((msg?: ActionMessage) => {
  if (!msg?.id || !msg.handlerId) return
  
  if (msg.handlerId === 'ping') {
    log('WebSocket ping received')
    reply(msg.id, { message: 'pong' })
  }
})

const router = Router()

router.get('/ping', (req, res) => {
  log('HTTP ping received')
  res.json({ message: 'pong' })
})

export { router }
