import { PaymentService } from '../../../service/payment.service'
import { apiHandler } from '../../../utils.server'

export default apiHandler().post(async (req, res) => {
  const body = req.body
  const paymentService = new PaymentService()
  res.json(await paymentService.parseBody(body))
})
