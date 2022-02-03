import { BlockList } from '../../src/blockList'
import { sleep } from '../setup'

describe('blockList.ts', () => {
  describe('isValid', () => {
    it('should return TRUE if the element is not added', () => {
      const blockList = new BlockList(1000)

      expect(blockList.isValid('example')).toBeTruthy()
    })

    it('should return FALSE if the element is added and is in cooldown', () => {
      const blockList = new BlockList(10000)

      blockList.add('example')

      expect(blockList.isValid('example')).toBeFalsy()
    })

    it('should return TRUE if the element is added and is in cooldown', async () => {
      const blockList = new BlockList(500)

      blockList.add('example')
      await sleep(600)

      expect(blockList.isValid('example')).toBeTruthy()
    })
  })
})
