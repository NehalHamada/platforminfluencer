export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  campaigns: {
    list: (params?: unknown) => ["campaigns", "list", params] as const,
    details: (campaignId: string) =>
      ["campaigns", "details", campaignId] as const,
    request: (params?: unknown) => ["campaigns", "request", params] as const,
    myApplications: (params?: unknown) =>
      ["campaigns", "my-applications", params] as const,
    allApplications: () => ["campaigns", "all-applications"] as const,
    applications: (campaignId: string | number) =>
      ["campaigns", "applications", campaignId] as const,
  },
  dashboard: {
    company: () => ["dashboard", "company"] as const,
    companyHome: () => ["dashboard", "company", "home"] as const,
    influencer: () => ["dashboard", "influencer"] as const,
    influencerPosts: () => ["dashboard", "influencer", "posts"] as const,
  },
  influencers: {
    list: (params?: unknown) => ["influencers", "list", params] as const,
    profile: (influencerId: string) =>
      ["influencers", "profile", influencerId] as const,
  },
  offers: {
    list: (params?: unknown) => ["offers", "list", params] as const,
  },
  chat: {
    conversations: () => ["chat", "conversations"] as const,
    messages: (conversationId: string) =>
      ["chat", "messages", conversationId] as const,
  },
};
