export class PoapValidator {
  poapList: Set<string>

  constructor(poapList: Array<string>) {
    this.poapList = new Set(poapList)
  }

  isValid(poapUrl: string): boolean {
    return this.poapList.has(poapUrl)
  }
}
