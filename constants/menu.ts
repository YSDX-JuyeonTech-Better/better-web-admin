export type Item = {
  name: string;
  slug: string;
};
export const menus: { name: string; items: Item[] }[] = [
  {
    name: "MENU",
    items: [
      { name: "홈", slug: "dashboard" },
      { name: "주문관리", slug: "order/list" },
      { name: "상품관리", slug: "item/list" },
      { name: "회원관리", slug: "user/list" },
    ],
  },
];
