import { expect } from 'chai'
import * as units from '@browseth/units'

it('should convert gwei to wei', () => {
    expect(units.gweiToWei(1000000000000)).to.equal('0x3635c9adc5dea00000')
    expect(units.gweiToWei('100000020000')).to.equal('0x56bc7705dfff54000')
    expect(units.gweiToWei('1000000000')).to.equal('0xde0b6b3a7640000')
    expect(units.gweiToWei(0x1221323123fffaa)).to.equal('0x4389cd7b6766d4ce0c0800')
    expect(units.gweiToWei(234)).to.equal('0x367b7ca400')
    expect(units.gweiToWei(-1)).to.equal('0x-3b9aca00')
    expect(units.gweiToWei(0)).to.equal('0x0')
})
