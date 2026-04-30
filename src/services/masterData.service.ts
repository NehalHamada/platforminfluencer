import { api } from "@/lib/axios";

export type MasterDataOption = {
  id: number;
  label: string;
  labelAr?: string;
  labelEn?: string;
};

type MasterDataItem = {
  id?: number | string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  label?: string;
};

type MasterDataResponse = {
  data?: MasterDataItem[] | { data?: MasterDataItem[] };
};

const getMasterDataList = (responseData: unknown): MasterDataItem[] => {
  if (Array.isArray(responseData)) return responseData as MasterDataItem[];

  if (!responseData || typeof responseData !== "object") return [];

  const data = (responseData as MasterDataResponse).data;

  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
};

const mapMasterDataOption = (item: MasterDataItem): MasterDataOption | null => {
  const id = Number(item.id);

  if (!Number.isFinite(id)) return null;

  return {
    id,
    label:
      item.name ??
      item.name_en ??
      item.name_ar ??
      item.title ??
      item.title_en ??
      item.title_ar ??
      item.label ??
      String(id),
    labelAr: item.name_ar ?? item.title_ar,
    labelEn: item.name_en ?? item.title_en,
  };
};

export const masterDataService = {
  getAllPlatforms: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/platforms");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getFollowerRange: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/follower-ranges");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getContentType: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/content-types");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getTargetAudience: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/target-audiences");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getTargetLocation: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/target-locations");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getExecutionTime: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/execution-times");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getCampaignType: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/campaign-types");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getBudgetRange: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/budget-ranges");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },

  getInfluencerCountRange: async (): Promise<MasterDataOption[]> => {
    const response = await api.get("/api/master-data/influencer-count-ranges");
    return getMasterDataList(response.data)
      .map(mapMasterDataOption)
      .filter((item): item is MasterDataOption => Boolean(item));
  },
};
