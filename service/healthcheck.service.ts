import { RequestScopeService } from ".";
import { prisma } from '../utils.server'

export class HealthCheckService extends RequestScopeService {
    async check(): Promise<boolean> {
        try {
            const dbConnection = await prisma.$queryRaw`SELECT 1`;
            return dbConnection[0]['1'] == 1;
        }
        catch (err) {
            throw err;
        }
    }
}