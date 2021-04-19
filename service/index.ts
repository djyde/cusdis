import { getSession } from "../utils.server"

export type UserSession = {
  user: {
    name: string,
    email: string
  },
  uid: string
}

export abstract class RequestScopeService {
  constructor(protected req) {}

  protected async getSession() {
    return await getSession(this.req)
  }
}
