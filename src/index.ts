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
    { command: 'ping', handlerId: 'ping' },
    { command: 'whoami', handlerId: 'whoami' }
  ]
})

onRPCInvoke((msg?: ActionMessage) => {
  if (!msg?.id || !msg.handlerId) return

  if (msg.handlerId === 'ping') {
    log('WebSocket ping received')
    reply(msg.id, { message: 'pong' })
  }

  if (msg.handlerId === 'whoami') {
    if (!msg.user)
      return reply(msg.id, { message: `You don't have permission to do that` })
    reply(msg.id, { message: `Your name is ${msg.user.username || 'unknown'}` })
  }
})

const router = Router()

router.get('/ping', (req, res) => {
  log('HTTP ping received')
  res.json({ message: 'pong' })
})

router.get('/whoami', (req, res) => {
  const user = (req as any).user
  if (!user)
    res.status(403).json({
      message: `You don't have permission to access this resource`
    })
  
  res.json({
    message: `Your name is ${user.username || 'unknown'}`
  })
})

export { router }
