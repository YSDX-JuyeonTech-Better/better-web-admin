// 회원 타입 정의
export interface User {
  idx: number; // INT, PK, Auto Increment
  id: string; //VARCHAR(50), Not Null
  name: string; // VARCHAR(50), Not Null
  email: string; // VARCHAR(40), Not Null
  password: string; // VARCHAR(255), Not Null
  gender: string; // CHAR(1)
  phone_num: string; // VARCHAR(30)
  address: string; // VARCHAR(255)
  is_admin: boolean; // TINYINT, Default '0'
  regist_date: Date; // DATETIME
  modify_date: Date; // DATETIME
  is_active: boolean; // TINYINT, Not Null, Default '1'
}
