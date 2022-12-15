import { NextApiRequest, NextApiResponse } from "next";
import { HealthCheckService } from "../../service/healthcheck.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const healthCheckService = new HealthCheckService(req);
    if (req.method === 'GET') {
        const result = await healthCheckService.check();
        if (result) {
            res.status(200).json({ status: 'Ok' })
        } else {
            res.status(500).json({ status: 'Error' })
        }
    }
}