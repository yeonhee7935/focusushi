import type { FoodItem } from "./types";

export const FOODS: FoodItem[] = [
  {
    id: "sushi-01",
    name: "성게알 군함",
    rarity: "LEGENDARY",
    image: require("../../assets/sushi/uni-gunham.png"),
    description: "희소성이 높은 고급 재료입니다. 진한 바다의 맛을 천천히 음미해 보세요.",
    category: "SUSHI",
  },
  {
    id: "sushi-02",
    name: "참치 뱃살 초밥",
    rarity: "LEGENDARY",
    image: require("../../assets/sushi/chamchi.png"),
    description:
      "마블링이 훌륭하여 입에서 부드럽게 녹는 초밥입니다. 특별한 성취에 대한 보상으로 좋아요.",
    category: "SUSHI",
  },

  // EPIC (상당히 비쌈: 고급 생선 또는 특수 재료)
  {
    id: "sushi-03",
    name: "참치 등살 초밥",
    rarity: "EPIC",
    image: require("../../assets/sushi/chamchi-deungsal.png"),
    description: "참치 본연의 담백하고 깔끔한 맛을 즐길 수 있는 대표적인 부위입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-04",
    name: "고등어 초밥",
    rarity: "EPIC",
    image: require("../../assets/sushi/godeungu.png"),
    description: "신선한 재료 관리와 숙련된 기술이 필요한 초밥입니다. 그 맛을 느껴보세요.",
    category: "SUSHI",
  },
  {
    id: "sushi-05",
    name: "광어 초밥",
    rarity: "EPIC",
    image: require("../../assets/sushi/gwangu.png"),
    description: "가장 대중적이면서도 쫄깃한 식감이 일품인 생선 초밥입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-06",
    name: "연어 초밥",
    rarity: "EPIC",
    image: require("../../assets/sushi/yeonu.png"),
    description: "부드러운 식감과 풍부한 지방 맛으로 인기가 많은 초밥 종류입니다.",
    category: "SUSHI",
  },

  // RARE (보통 가격대: 일반적인 생선 및 해산물)
  {
    id: "sushi-07",
    name: "한치 초밥",
    rarity: "RARE",
    image: require("../../assets/sushi/hanchi.png"),
    description: "오징어보다 부드럽고 쫀득하며, 담백한 맛이 매력적인 초밥입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-08",
    name: "생새우 초밥",
    rarity: "RARE",
    image: require("../../assets/sushi/saengsaeu.png"),
    description: "탱글탱글한 식감과 은은하게 느껴지는 단맛이 좋습니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-09",
    name: "타코와사비 군함",
    rarity: "RARE",
    image: require("../../assets/sushi/tacowasabi-gunham.png"),
    description: "코끝을 자극하는 와사비와 쫄깃한 문어가 잘 어우러진 별미입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-10",
    name: "날치알 군함",
    rarity: "RARE",
    image: require("../../assets/sushi/nalchial-gunham.png"),
    description: "입안에서 톡톡 터지는 식감이 재미있어 많은 분이 찾는 초밥입니다.",
    category: "SUSHI",
  },

  // COMMON (가장 저렴함: 계란, 조리된 재료, 채소 등)
  {
    id: "sushi-11",
    name: "계란 초밥",
    rarity: "COMMON",
    image: require("../../assets/sushi/gyeran.png"),
    description: "달콤하고 폭신한 맛으로, 누구나 부담 없이 즐기기 좋은 기본 초밥입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-12",
    name: "계란말이 마끼",
    rarity: "COMMON",
    image: require("../../assets/sushi/gyeran-maki.png"),
    description: "달콤한 계란말이를 김과 밥으로 감싼 마끼 형태의 초밥입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-13",
    name: "익힌 새우 초밥",
    rarity: "COMMON",
    image: require("../../assets/sushi/saeu.png"),
    description: "익숙하고 친근한 새우 맛으로, 초밥 입문자에게도 좋습니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-14",
    name: "게살 초밥",
    rarity: "COMMON",
    image: require("../../assets/sushi/gesal.png"),
    description: "부드러운 게살 또는 게맛살을 사용해 편안하게 즐기는 초밥입니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-15",
    name: "오이 마끼",
    rarity: "COMMON",
    image: require("../../assets/sushi/oi-maki.png"),
    description: "시원하고 아삭한 오이가 느끼함을 잡아주어 산뜻한 맛이 납니다.",
    category: "SUSHI",
  },
  {
    id: "sushi-16",
    name: "당근 마끼",
    rarity: "COMMON",
    image: require("../../assets/sushi/danggeun-maki.png"),
    description: "채소를 주재료로 사용하여 건강하게 즐길 수 있는 마끼입니다.",
    category: "SUSHI",
  },
];
