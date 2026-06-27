export interface Pet {
  id: string;
  name: string;
  description: string;
  age: "FILHOTE" | "ADULTO" | "IDOSO";
  size: "PEQUENO" | "MEDIO" | "GRANDE";
  adopted: boolean;
  created_at: Date;
  org_id: string;
}
