import { PoapValidator } from '../../src/poapValidator'

describe('poapValidtor.ts', () => {
  it('should return TRUE if the element is included in the list', () => {
    const poap = 'valid_poap_1'

    const validator = new PoapValidator([poap])

    expect(validator.isValid(poap)).toBeTruthy()
  })

  it('should return FALSE if the element not included in the list', () => {
    const poap = 'valid_poap_1'
    const invalidPoap = 'valid_poap_1'

    const validator = new PoapValidator([poap])

    expect(validator.isValid(invalidPoap)).toBeTruthy()
  })
})
