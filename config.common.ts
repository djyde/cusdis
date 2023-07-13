export enum UsageLabel {
  ApproveComment = 'approve_comment',
  QuickApprove = 'quick_approve',
  CreateSite = 'create_site'
}

export const usageLimitation = {
  [UsageLabel.ApproveComment]: 100,
  [UsageLabel.QuickApprove]: 10,
  [UsageLabel.CreateSite]: 1
}
