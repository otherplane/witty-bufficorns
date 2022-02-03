export class BlockList {
  private map: Map<string, number>
  private cooldown: number

  constructor(cooldown: number) {
    this.map = new Map<string, number>()
    this.cooldown = cooldown
  }

  public add(key: string) {
    this.map.set(key, Date.now())
  }

  public isValid(key: string): boolean {
    const entry = this.map.get(key)

    if (!entry) {
      return true
    }

    const isExpired = entry + this.cooldown < Date.now()

    if (isExpired) {
      // Remove entry from map if the cooldown is over
      this.map.delete(key)
    }

    return !!isExpired
  }

  public delete(key: string): void {
    this.map.delete(key)
  }
}
