import { User } from "@prisma/client";
import { prisma } from "../utils.server";
import { getSession } from "next-auth/client";

export class ProjectService {
  constructor(private req) {
    
  }

  async getSession() {
    return await getSession({ req: this.req });
  }

  async create(title: string) {
    const session = await this.getSession()
    console.log(session)
    // const created = await prisma.project.create({
    //   data: {
    //     title,
    //     owner: {
    //       connect: {
    //         id: ''
    //       }
    //     }
    //   }
    // })

    // return created
  }
}