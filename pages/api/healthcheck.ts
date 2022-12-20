import { NextApiRequest, NextApiResponse } from "next";
import { HealthCheckService } from "../../service/healthcheck.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET')
        return res.status(405).json({ status: 'Method Not Allowed' });

    const healthCheckService = new HealthCheckService(req);

    try {
        const result = await healthCheckService.check();
        if (result) {
            res.status(200).json({ status: 'Ok' })
        } else {
            res.status(500).json({ status: 'Error' })
        }
    }
    catch (err) {
        res.status(500).json({ status: 'Error:' + err.message })
    }
}