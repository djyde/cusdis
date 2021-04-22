import { Comment, Page, Project } from "@prisma/client";
import { RequestScopeService } from ".";
import { NotificationService } from "./notification.service";

export class HookService extends RequestScopeService {

  notificationService = new NotificationService(this.req)

  async addComment(comment: Comment, projectId: string) {
    this.notificationService.addComment(comment, projectId)
  }
}
