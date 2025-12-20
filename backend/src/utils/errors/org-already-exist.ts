export class OrgAlreadyExits extends Error {
  constructor() {
    super("Organization Already Exist")
  }
}