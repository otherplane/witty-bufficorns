import { generateUsernameList } from '../../src/utils'

describe.skip('utils.ts', () => {
  it('should generate unique usernames', () => {
    // Old versions of the library failed to generate more than 6410 unique usernames,
    // entering an infinite loop
    let count = 10000
    let usernames = generateUsernameList(count)

    expect(usernames.length).toBe(count)
  })
})
