export type AboutUsData = {
  id: number;
  title: string;
  description: string;
};

export type AboutUsResponse = {
  success: boolean;
  data: AboutUsData;
};
