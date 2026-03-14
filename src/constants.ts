export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  specs: {
    label: string;
    value: string;
  }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  result: string;
  image: string;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "wood-pellets",
    name: "Viên nén mùn cưa (Wood Pellets)",
    description: "Nhiên liệu sinh khối chất lượng cao, độ tro thấp, nhiệt trị ổn định cho lò hơi công nghiệp.",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800",
    specs: [
      { label: "Nhiệt trị", value: "4200 - 4600 kcal/kg" },
      { label: "Độ ẩm", value: "< 10%" },
      { label: "Độ tro", value: "< 2%" }
    ]
  },
  {
    id: "rice-husk-pellets",
    name: "Viên nén củi trấu (Rice Husk Pellets)",
    description: "Giải pháp tận dụng phế phẩm nông nghiệp, chi phí tối ưu cho các nhà máy khu vực ĐBSCL.",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=800",
    specs: [
      { label: "Nhiệt trị", value: "3800 - 4000 kcal/kg" },
      { label: "Độ ẩm", value: "< 12%" },
      { label: "Độ tro", value: "12 - 15%" }
    ]
  },
  {
    id: "cashew-shell-cake",
    name: "Bã vỏ hạt điều (Cashew Shell Cake)",
    description: "Nhiệt trị cực cao, phù hợp cho các hệ thống đốt cần công suất nhiệt lớn.",
    image: "https://images.unsplash.com/photo-1599591037488-3a5dec7fdf9c?auto=format&fit=crop&q=80&w=800",
    specs: [
      { label: "Nhiệt trị", value: "4800 - 5200 kcal/kg" },
      { label: "Độ ẩm", value: "< 12%" },
      { label: "Độ tro", value: "< 5%" }
    ]
  },
  {
    id: "wood-chips",
    name: "Dăm gỗ (Wood Chips)",
    description: "Giải pháp nhiên liệu sinh khối thô, giá thành rẻ, phù hợp cho lò hơi tầng sôi và lò ghi xích.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800",
    specs: [
      { label: "Nhiệt trị", value: "3800 - 4200 kcal/kg" },
      { label: "Độ ẩm", value: "25 - 35%" },
      { label: "Độ tro", value: "< 3%" }
    ]
  },
  {
    id: "palm-kernel-shell",
    name: "Vỏ cọ (Palm Kernel Shell)",
    description: "Nhiên liệu Net Zero năng lượng cao, cháy lâu, ít khói, lý tưởng cho các nhà máy xi măng và nhiệt điện.",
    image: "https://images.unsplash.com/photo-1605557202138-097824c39328?auto=format&fit=crop&q=80&w=800",
    specs: [
      { label: "Nhiệt trị", value: "4000 - 4600 kcal/kg" },
      { label: "Độ ẩm", value: "< 15%" },
      { label: "Độ tro", value: "< 5%" }
    ]
  },
  {
    id: "biomass-briquettes",
    name: "Củi ép sinh khối (Biomass Briquettes)",
    description: "Nhiên liệu nén mật độ cao, thời gian cháy dài, thay thế hoàn hảo cho than đá truyền thống.",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800",
    specs: [
      { label: "Nhiệt trị", value: "4000 - 4500 kcal/kg" },
      { label: "Độ ẩm", value: "< 12%" },
      { label: "Độ tro", value: "< 10%" }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "paper-mill-conversion",
    title: "Chuyển đổi lò hơi than sang Biomass cho nhà máy Giấy",
    client: "Nhà máy Giấy tại Bình Dương",
    result: "Giảm 35% chi phí vận hành & 100% phát thải lưu huỳnh.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    tags: ["CarbonLoop", "Wood Pellets"]
  },
  {
    id: "food-processing-opt",
    title: "Tối ưu hóa hiệu suất nhiệt cho tập đoàn Thực phẩm",
    client: "Tập đoàn Thực phẩm đa quốc gia",
    result: "Tăng 15% hiệu suất đốt, giảm tiêu hao nhiên liệu.",
    image: "https://images.unsplash.com/photo-1558444479-c84829091c22?auto=format&fit=crop&q=80&w=800",
    tags: ["Energy Audit", "EcoLoop"]
  }
];

export const ADMIN_EMAILS = [
  'coach.chuyen@gmail.com',
  'admin@hoangdungbiomass.com'
];

